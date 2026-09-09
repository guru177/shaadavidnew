import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `product-${Date.now()}`;
}

function normalizeStock(body: { stock?: unknown; inStock?: unknown }, fallback = 0) {
  if (body.stock != null && body.stock !== '') {
    const qty = Math.max(0, Math.floor(Number(body.stock)));
    return Number.isFinite(qty) ? qty : fallback;
  }
  if (body.inStock === false) return 0;
  if (body.inStock === true) return Math.max(fallback, 1);
  return fallback;
}

export async function GET(request: Request) {
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  const products = (db.products || []).filter((p: { deletedAt?: string }) => {
    if (searchParams.get("includeDeleted") === "1") return true;
    return !p.deletedAt;
  });

  if (slug) {
    const product = products.find((p: { slug: string }) => p.slug === slug);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  }

  if (id) {
    const product = products.find((p: { id: string }) => p.id === id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  }

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    if (!db.products) db.products = [];

    const titleEn = body.titleEn || body.title || 'New Product';
    const price = Number(body.price) || 0;
    const mrp = Number(body.mrp) || price;
    const discountPercent =
      body.discountPercent != null
        ? Number(body.discountPercent)
        : mrp > 0
          ? Math.round(((mrp - price) / mrp) * 100)
          : 0;

    const stock = normalizeStock(body, body.inStock === false ? 0 : 10);

    const newProduct = {
      id: `prod-${Date.now()}`,
      slug: body.slug || slugify(titleEn),
      title: body.title || titleEn,
      titleEn,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      moreInfo: body.moreInfo || '',
      features: Array.isArray(body.features) ? body.features : [],
      price,
      mrp,
      discountPercent,
      currency: body.currency || 'INR',
      images: Array.isArray(body.images) && body.images.length ? body.images : ['/product.webp'],
      rating: Number(body.rating) || 0,
      ratingCount: Number(body.ratingCount) || 0,
      reviewCount: Number(body.reviewCount) || 0,
      ratingBreakdown: Array.isArray(body.ratingBreakdown)
        ? body.ratingBreakdown
        : [
            { star: 5, pct: 0 },
            { star: 4, pct: 0 },
            { star: 3, pct: 0 },
            { star: 2, pct: 0 },
            { star: 1, pct: 0 },
          ],
      bookDetails: Array.isArray(body.bookDetails) ? body.bookDetails : [],
      dimensions: Array.isArray(body.dimensions) ? body.dimensions : [],
      breadcrumbs: Array.isArray(body.breadcrumbs)
        ? body.breadcrumbs
        : ['ഹോം', 'പുസ്തകങ്ങളും പഠനസാമഗ്രികളും', 'ഇംഗ്ലീഷ് പഠനം'],
      stock,
      inStock: stock > 0,
      sku: body.sku || "",
      seoTitle: body.seoTitle || "",
      seoDescription: body.seoDescription || "",
      seoKeywords: body.seoKeywords || "",
      variantLabel: body.variantLabel || "",
      featured: Boolean(body.featured),
      deletedAt: null,
    };

    db.products.unshift(newProduct);
    await saveDb(db);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'Product id required' }, { status: 400 });

    const db = await getDb();
    if (!db.products) db.products = [];

    const index = db.products.findIndex((p: { id: string }) => p.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const current = db.products[index];
    const price = body.price != null ? Number(body.price) : Number(current.price);
    const mrp = body.mrp != null ? Number(body.mrp) : Number(current.mrp);
    const discountPercent =
      body.discountPercent != null
        ? Number(body.discountPercent)
        : mrp > 0
          ? Math.round(((mrp - price) / mrp) * 100)
          : current.discountPercent || 0;

    const currentStock =
      current.stock != null && Number.isFinite(Number(current.stock))
        ? Math.max(0, Math.floor(Number(current.stock)))
        : current.inStock === false
          ? 0
          : 1;

    let stock = currentStock;
    if (body.stock != null && body.stock !== '') {
      stock = normalizeStock(body, currentStock);
    } else if (body.inStock === false) {
      stock = 0;
    } else if (body.inStock === true && currentStock === 0) {
      stock = 1;
    }

    db.products[index] = {
      ...current,
      ...body,
      price,
      mrp,
      discountPercent,
      stock,
      inStock: stock > 0,
      slug: body.slug || current.slug || slugify(body.titleEn || body.title || current.titleEn),
    };

    await saveDb(db);
    return NextResponse.json(db.products[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const hard = searchParams.get("hard") === "1";

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();
    if (!db.products) db.products = [];

    const index = db.products.findIndex((p: { id: string }) => p.id === id);
    if (index === -1) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (hard) {
      db.products = db.products.filter((p: { id: string }) => p.id !== id);
      if (db.reviews) {
        db.reviews = db.reviews.filter((r: { productId: string }) => r.productId !== id);
      }
    } else {
      db.products[index] = {
        ...db.products[index],
        deletedAt: new Date().toISOString(),
        inStock: false,
      };
    }

    await saveDb(db);
    return NextResponse.json({ success: true, soft: !hard });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
