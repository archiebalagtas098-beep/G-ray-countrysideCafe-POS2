import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import MenuItem from './models/Menuitem.js';
import Stats from './models/Stats.js';
import Order from './models/Order.js';

dotenv.config();

async function seedDashboardData() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🌱 SEEDING DASHBOARD DATA');
    console.log('='.repeat(60) + '\n');
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB\n');
    
    // ==================== SEED PRODUCTS ====================
    console.log('📦 Seeding Products...');
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      const products = [
        {
          itemName: 'Fried Chicken',
          category: 'Budget Meals',
          price: 95,
          stock: 50,
          status: 'in_stock',
          isActive: true,
          unit: 'piece',
          sku: 'PROD-001',
          minStock: 10,
          maxStock: 100
        },
        {
          itemName: 'Sizzling Pork Sisig',
          category: 'Hot Sizzlers',
          price: 220,
          stock: 30,
          status: 'in_stock',
          isActive: true,
          unit: 'plate',
          sku: 'PROD-002',
          minStock: 5,
          maxStock: 50
        },
        {
          itemName: 'Pancit Bihon',
          category: 'Party Tray',
          price: 350,
          stock: 20,
          status: 'in_stock',
          isActive: true,
          unit: 'tray',
          sku: 'PROD-003',
          minStock: 5,
          maxStock: 40
        },
        {
          itemName: 'Cafe Americano',
          category: 'Coffee',
          price: 80,
          stock: 100,
          status: 'in_stock',
          isActive: true,
          unit: 'cup',
          sku: 'PROD-004',
          minStock: 20,
          maxStock: 150
        },
        {
          itemName: 'Milk Tea',
          category: 'Milk Tea',
          price: 85,
          stock: 80,
          status: 'in_stock',
          isActive: true,
          unit: 'cup',
          sku: 'PROD-005',
          minStock: 15,
          maxStock: 120
        }
      ];
      await Product.insertMany(products);
      console.log(`✅ Seeded ${products.length} products\n`);
    } else {
      console.log(`⏭️  Products already exist (${existingProducts})\n`);
    }
    
    // ==================== SEED MENU ITEMS ====================
    console.log('🍽️  Seeding Menu Items...');
    const existingMenuItems = await MenuItem.countDocuments();
    if (existingMenuItems === 0) {
      const menuItems = [
        {
          itemName: 'Fried Chicken',
          category: 'Budget Meals',
          price: 95,
          description: 'Crispy golden fried chicken',
          isAvailable: true,
          image: '/images/chicken.jpg',
          prepTime: '10-15 minutes'
        },
        {
          itemName: 'Sizzling Pork Sisig',
          category: 'Hot Sizzlers',
          price: 220,
          description: 'Hot and sizzling pork sisig',
          isAvailable: true,
          image: '/images/sisig.jpg',
          prepTime: '15-20 minutes'
        },
        {
          itemName: 'Adobo Rice',
          category: 'Rice Meals',
          price: 150,
          description: 'Fragrant adobo served with rice',
          isAvailable: true,
          image: '/images/adobo.jpg',
          prepTime: '10 minutes'
        },
        {
          itemName: 'Iced Coffee',
          category: 'Coffee',
          price: 120,
          description: 'Cold refreshing iced coffee',
          isAvailable: true,
          image: '/images/coffee.jpg',
          prepTime: '5 minutes'
        },
        {
          itemName: 'Milktea',
          category: 'Milk Tea',
          price: 180,
          description: 'Creamy delicious milk tea',
          isAvailable: true,
          image: '/images/milktea.jpg',
          prepTime: '5 minutes'
        },
        {
          itemName: 'Frappe',
          category: 'Frappe',
          price: 150,
          description: 'Blended coffee drink',
          isAvailable: true,
          image: '/images/frappe.jpg',
          prepTime: '5 minutes'
        },
        {
          itemName: 'Iced Tea',
          category: 'Drinks',
          price: 60,
          description: 'Refreshing iced tea',
          isAvailable: true,
          image: '/images/tea.jpg',
          prepTime: '2 minutes'
        },
        {
          itemName: 'Sizzling Plate',
          category: 'Hot Sizzlers',
          price: 250,
          description: 'Mixed sizzling plate',
          isAvailable: true,
          image: '/images/sizzling.jpg',
          prepTime: '20 minutes'
        }
      ];
      await MenuItem.insertMany(menuItems);
      console.log(`✅ Seeded ${menuItems.length} menu items\n`);
    } else {
      console.log(`⏭️  Menu items already exist (${existingMenuItems})\n`);
    }
    
    // ==================== SEED STATS ====================
    console.log('📊 Seeding Stats...');
    const existingStats = await Stats.countDocuments();
    if (existingStats === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stats = new Stats({
        date: today,
        totalOrders: 0,
        totalRevenue: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalCustomers: 0,
        averageOrderValue: 0,
        topProduct: null,
        lowStockItems: 0,
        outOfStockItems: 0
      });
      await stats.save();
      console.log('✅ Seeded daily stats record\n');
    } else {
      console.log(`⏭️  Stats already exist (${existingStats})\n`);
    }
    
    // ==================== SEED TEST ORDERS ====================
    console.log('📋 Seeding Test Orders...');
    const existingOrders = await Order.countDocuments();
    if (existingOrders === 0) {
      const testOrders = [
        {
          items: [
            { name: 'Iced Coffee', price: 120, quantity: 2 },
            { name: 'Pancit Bihon', price: 350, quantity: 1 }
          ],
          total: 590,
          subtotal: 590,
          tax: 0,
          status: 'completed',
          orderNumber: `ORD-${Date.now()}-001`,
          customerId: 'WALK-IN-001',
          tableNumber: '5',
          type: 'Dine In',
          cashier: 'Admin',
          payment: {
            method: 'cash',
            amountPaid: 590,
            change: 0,
            status: 'completed'
          }
        },
        {
          items: [
            { name: 'Adobo Rice', price: 150, quantity: 1 },
            { name: 'Iced Tea', price: 60, quantity: 1 }
          ],
          total: 210,
          subtotal: 210,
          tax: 0,
          status: 'completed',
          orderNumber: `ORD-${Date.now()}-002`,
          customerId: 'WALK-IN-002',
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
            { name: 'Sizzling Plate', price: 250, quantity: 1 },
            { name: 'Iced Coffee', price: 120, quantity: 2 }
          ],
          total: 490,
          subtotal: 490,
          tax: 0,
          status: 'completed',
          orderNumber: `ORD-${Date.now()}-003`,
          customerId: 'WALK-IN-003',
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
            { name: 'Milktea', price: 180, quantity: 3 }
          ],
          total: 540,
          subtotal: 540,
          tax: 0,
          status: 'completed',
          orderNumber: `ORD-${Date.now()}-004`,
          customerId: 'WALK-IN-004',
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
            { name: 'Fried Chicken', price: 95, quantity: 1 },
            { name: 'Frappe', price: 150, quantity: 1 },
            { name: 'Iced Coffee', price: 120, quantity: 1 }
          ],
          total: 365,
          subtotal: 365,
          tax: 0,
          status: 'completed',
          orderNumber: `ORD-${Date.now()}-005`,
          customerId: 'WALK-IN-005',
          tableNumber: '7',
          type: 'Dine In',
          cashier: 'Admin',
          payment: {
            method: 'cash',
            amountPaid: 400,
            change: 35,
            status: 'completed'
          }
        }
      ];
      
      await Order.insertMany(testOrders);
      console.log(`✅ Seeded ${testOrders.length} test orders\n`);
    } else {
      console.log(`⏭️  Orders already exist (${existingOrders})\n`);
    }
    
    // ==================== SUMMARY ====================
    console.log('='.repeat(60));
    console.log('\n✅ DATABASE SEEDING COMPLETED!\n');
    
    const finalCounts = {
      products: await Product.countDocuments(),
      menuItems: await MenuItem.countDocuments(),
      stats: await Stats.countDocuments(),
      orders: await Order.countDocuments()
    };
    
    console.log('📊 Final Database Summary:');
    console.log(`   📦 Products: ${finalCounts.products}`);
    console.log(`   🍽️  Menu Items: ${finalCounts.menuItems}`);
    console.log(`   📊 Stats Records: ${finalCounts.stats}`);
    console.log(`   📋 Orders: ${finalCounts.orders}`);
    console.log(`\n✅ Dashboard is now ready to display data!\n`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDashboardData();
