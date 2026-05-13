import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.gallery || []);
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    const db = getDb();
    
    const newImage = {
      id: Math.random().toString(36).substring(7),
      url,
      date: new Date().toISOString().split('T')[0]
    };
    
    if (!db.gallery) db.gallery = [];
    db.gallery.unshift(newImage); // Add to beginning
    
    saveDb(db);
    
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const db = getDb();
    if (!db.gallery) db.gallery = [];
    
    db.gallery = db.gallery.filter((g: any) => g.id !== id);
    saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
