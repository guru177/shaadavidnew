import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.orders || []);
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const db = getDb();
    
    if (!db.orders) db.orders = [];
    if (!db.users) db.users = [];

    // Check if user exists by mobile
    let user = db.users.find((u: any) => u.mobile === orderData.address.mobile);
    
    if (!user) {
      // Create new user
      user = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: orderData.address.name,
        mobile: orderData.address.mobile,
        location: `${orderData.address.city}, ${orderData.address.state}`,
        registeredDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        role: 'customer'
      };
      db.users.unshift(user);
    }

    // Create Order
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      customerDetails: {
        name: orderData.address.name,
        mobile: orderData.address.mobile,
      },
      shippingAddress: orderData.address,
      product: 'Shaa David English Companion',
      amount: '₹499.00',
      status: 'Pending',
      screenshotUrl: orderData.screenshotUrl,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    
    db.orders.unshift(newOrder); // Add to beginning
    saveDb(db);
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'ID and Status required' }, { status: 400 });

    const db = getDb();
    if (!db.orders) db.orders = [];
    
    const index = db.orders.findIndex((o: any) => o.id === id);
    if (index === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    
    db.orders[index].status = status;
    saveDb(db);
    
    return NextResponse.json(db.orders[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
