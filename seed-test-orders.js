import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';

dotenv.config();

async function seedTestOrders() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing orders (optional - comment out to keep existing data)
    const deleteResult = await Order.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing orders`);
    
    // Create test orders
    const testOrders = [
      {
        items: [
          { name: 'Iced Coffee', price: 120, quantity: 2, image: 'coffee.png', productId: new mongoose.Types.ObjectId() },
          { name: 'Croissant', price: 80, quantity: 1, image: 'pastry.png', productId: new mongoose.Types.ObjectId() }
        ],
        total: 320,
        subtotal: 320,
        tax: 0,
        status: 'completed',
        orderNumber: `ORD-${Date.now()}-001`,
        customerId: 'CUST-001',
        tableNumber: '5',
        type: 'Dine In',
        cashier: 'Admin',
        payment: {
          method: 'cash',
          amountPaid: 320,
          change: 0,
          status: 'completed'
        }
      },
      {
        items: [
          { name: 'Adobo Rice', price: 150, quantity: 1, image: 'rice.png', productId: new mongoose.Types.ObjectId() },
          { name: 'Iced Tea', price: 60, quantity: 1, image: 'drinks.png', productId: new mongoose.Types.ObjectId() }
        ],
        total: 210,
        subtotal: 210,
        tax: 0,
        status: 'completed',
        orderNumber: `ORD-${Date.now()}-002`,
        customerId: 'CUST-002',
        tableNumber: '3',
        type: 'Dine In',
        cashier: 'Admin',
        payment: {
          method: 'cash',
          amountPaid: 210,
          change: 0,
          status: 'completed'
        }
      },
      {
        items: [
          { name: 'Sizzling Plate', price: 250, quantity: 1, image: 'sizzling.png', productId: new mongoose.Types.ObjectId() },
          { name: 'Iced Coffee', price: 120, quantity: 2, image: 'coffee.png', productId: new mongoose.Types.ObjectId() }
        ],
        total: 490,
        subtotal: 490,
        tax: 0,
        status: 'completed',
        orderNumber: `ORD-${Date.now()}-003`,
        customerId: 'CUST-003',
        tableNumber: '1',
        type: 'Dine In',
        cashier: 'Admin',
        payment: {
          method: 'card',
          amountPaid: 490,
          change: 0,
          status: 'completed'
        }
      },
      {
        items: [
          { name: 'Milktea', price: 180, quantity: 3, image: 'milktea.png', productId: new mongoose.Types.ObjectId() }
        ],
        total: 540,
        subtotal: 540,
        tax: 0,
        status: 'completed',
        orderNumber: `ORD-${Date.now()}-004`,
        customerId: 'CUST-004',
        tableNumber: 'TO-1',
        type: 'Takeout',
        cashier: 'Admin',
        payment: {
          method: 'cash',
          amountPaid: 540,
          change: 0,
          status: 'completed'
        }
      },
      {
        items: [
          { name: 'Fried Chicken', price: 200, quantity: 1, image: 'chicken.png', productId: new mongoose.Types.ObjectId() },
          { name: 'Frappe', price: 150, quantity: 1, image: 'frappe.png', productId: new mongoose.Types.ObjectId() },
          { name: 'Iced Coffee', price: 120, quantity: 1, image: 'coffee.png', productId: new mongoose.Types.ObjectId() }
        ],
        total: 470,
        subtotal: 470,
        tax: 0,
        status: 'completed',
        orderNumber: `ORD-${Date.now()}-005`,
        customerId: 'CUST-005',
        tableNumber: '7',
        type: 'Dine In',
        cashier: 'Admin',
        payment: {
          method: 'cash',
          amountPaid: 500,
          change: 30,
          status: 'completed'
        }
      }
    ];
    
    const result = await Order.insertMany(testOrders);
    
    console.log(`\n✅ Created ${result.length} test orders`);
    console.log('\n📊 Test Orders Summary:');
    result.forEach((order, idx) => {
      console.log(`[${idx + 1}] Order #${order.orderNumber}`);
      console.log(`    Total: ₱${order.total}`);
      console.log(`    Items: ${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}`);
    });
    
    // Verify by fetching
    const count = await Order.countDocuments();
    console.log(`\n🔍 Total orders in database: ${count}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test orders:', error);
    process.exit(1);
  }
}

seedTestOrders();
