import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.blogs || []);
}

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    const db = getDb();
    
    const newBlog = {
      ...postData,
      id: Math.random().toString(36).substring(7),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      readTime: postData.readTime || '5 min',
      author: postData.author || 'Shaa David'
    };
    
    if (!db.blogs) db.blogs = [];
    db.blogs.unshift(newBlog); // Add to beginning
    
    saveDb(db);
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const db = getDb();
    if (!db.blogs) db.blogs = [];
    
    db.blogs = db.blogs.filter((b: any) => b.id !== id);
    saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json();
    if (!updatedData.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDb();
    if (!db.blogs) db.blogs = [];
    
    const index = db.blogs.findIndex((b: any) => b.id === updatedData.id);
    if (index === -1) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    
    db.blogs[index] = {
      ...db.blogs[index],
      ...updatedData,
      slug: updatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    };
    
    saveDb(db);
    return NextResponse.json(db.blogs[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}
