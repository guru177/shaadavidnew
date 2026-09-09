import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

function isApproved(review: { status?: string }) {
  // Treat legacy reviews without status as approved
  return !review.status || review.status === 'approved';
}

export async function GET(request: Request) {
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const status = searchParams.get('status'); // approved | pending | rejected | all

  let reviews = db.reviews || [];

  if (productId) {
    reviews = reviews.filter((r: { productId: string }) => r.productId === productId);
  }

  if (!status || status === 'approved') {
    // Default: public storefront only sees approved
    reviews = reviews.filter((r: { status?: string }) => isApproved(r));
  } else if (status === 'pending') {
    reviews = reviews.filter((r: { status?: string }) => r.status === 'pending');
  } else if (status === 'rejected') {
    reviews = reviews.filter((r: { status?: string }) => r.status === 'rejected');
  }
  // status=all → no status filter (admin)

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, title, content, rating } = body;

    if (!productId || !name || !title || !content || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    if (!db.reviews) db.reviews = [];

    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      name,
      title,
      content,
      rating: Number(rating),
      helpful: 0,
      status: 'pending' as ReviewStatus,
      date: `Reviewed in India on ${new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`,
    };

    db.reviews.unshift(newReview);
    // Do not bump public review counts until approved
    await saveDb(db);
    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body as { id?: string; status?: ReviewStatus };

    if (!id || !status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid id and status required' }, { status: 400 });
    }

    const db = await getDb();
    if (!db.reviews) db.reviews = [];

    const index = db.reviews.findIndex((r: { id: string }) => r.id === id);
    if (index === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    const review = db.reviews[index];
    const wasApproved = isApproved(review);
    const willBeApproved = status === 'approved';

    db.reviews[index] = { ...review, status };

    const { recomputeProductRatings } = await import("@/lib/products");
    recomputeProductRatings(db, review.productId);

    await saveDb(db);
    return NextResponse.json(db.reviews[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = await getDb();
    if (!db.reviews) db.reviews = [];

    const review = db.reviews.find((r: { id: string }) => r.id === id);
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    db.reviews = db.reviews.filter((r: { id: string }) => r.id !== id);

    const { recomputeProductRatings } = await import("@/lib/products");
    recomputeProductRatings(db, review.productId);

    await saveDb(db);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
