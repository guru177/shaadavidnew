import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.testimonials || []);
}

export async function POST(request: Request) {
  try {
    const newTestimonial = await request.json();
    const db = getDb();
    
    // Add ID and Date
    newTestimonial.id = Math.random().toString(36).substring(7);
    newTestimonial.date = new Date().toISOString().split('T')[0];
    
    if (!db.testimonials) db.testimonials = [];
    db.testimonials.push(newTestimonial);
    
    saveDb(db);
    
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, content, rating } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = getDb();
    if (!db.testimonials) db.testimonials = [];

    const index = db.testimonials.findIndex((t: { id: string }) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    db.testimonials[index] = {
      ...db.testimonials[index],
      name: name ?? db.testimonials[index].name,
      role: role ?? db.testimonials[index].role,
      content: content ?? db.testimonials[index].content,
      rating: typeof rating === "number" ? rating : db.testimonials[index].rating,
    };

    saveDb(db);
    return NextResponse.json(db.testimonials[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const db = getDb();
    if (!db.testimonials) db.testimonials = [];
    
    db.testimonials = db.testimonials.filter((t: any) => t.id !== id);
    saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
