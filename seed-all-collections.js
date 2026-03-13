import mongoose from "mongoose";
import dotenv from "dotenv";
import Stats from "./models/Stats.js";
import StockDeduction from "./models/StockDeduction.js";
import StaffAssignment from "./models/staffassignModel.js";
import Product from "./models/Product.js";
import StockTransfer from "./models/StocktransferModel.js";
import InventoryItem from "./models/InventoryItem.js";
import User from "./models/User.js";
import MenuItem from "./models/Menuitem.js";
import Settings from "./models/SettingsModel.js";

dotenv.config();

async function seedAllCollections() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // ==================== SEED PRODUCTS ====================
        console.log('\n🔄 Seeding Products collection...');
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
            console.log(`✅ Seeded ${products.length} products`);
        } else {
            console.log(`⏭️  Products already exist (${existingProducts} records)`);
        }

        // ==================== SEED STATS ====================
        console.log('\n🔄 Seeding Stats collection...');
        const existingStats = await Stats.countDocuments();
        if (existingStats === 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const stats = new Stats({
                date: today,
                totalOrders: 45,
                totalRevenue: 8500,
                totalProfit: 2550,
                todayOrders: 12,
                todayRevenue: 2800,
                todayProfit: 840,
                totalCustomers: 158,
                averageOrderValue: 188.89,
                topProduct: 'Fried Chicken',
                topProductQuantity: 35,
                paymentMethods: {
                    cash: 1500,
                    gcash: 1300
                },
                orderTypes: {
                    dineIn: 8,
                    takeOut: 4
                },
                status: 'active'
            });
            await stats.save();
            console.log('✅ Seeded Stats record');
        } else {
            console.log(`⏭️  Stats already exist (${existingStats} records)`);
        }

        // ==================== SEED STOCK DEDUCTIONS ====================
        console.log('\n🔄 Seeding StockDeduction collection...');
        const existingDeductions = await StockDeduction.countDocuments();
        if (existingDeductions === 0) {
            const deductions = [
                {
                    productName: 'Fried Chicken',
                    productId: 'PROD-001',
                    ingredientName: 'Chicken Meat',
                    quantityDeducted: 2.5,
                    unit: 'kg',
                    stockBefore: 10,
                    stockAfter: 7.5,
                    status: 'success',
                    reason: 'Menu product preparation',
                    notes: 'Morning preparation - 5 orders',
                    createdAt: new Date()
                },
                {
                    productName: 'Sizzling Pork Sisig',
                    productId: 'PROD-002',
                    ingredientName: 'Pork Meat',
                    quantityDeducted: 1.8,
                    unit: 'kg',
                    stockBefore: 8,
                    stockAfter: 6.2,
                    status: 'success',
                    reason: 'Menu product preparation',
                    notes: 'Lunch rush - 3 orders'
                },
                {
                    productName: 'Pancit Bihon',
                    productId: 'PROD-003',
                    ingredientName: 'Rice Noodles',
                    quantityDeducted: 1.2,
                    unit: 'kg',
                    stockBefore: 5,
                    stockAfter: 3.8,
                    status: 'success',
                    reason: 'Menu product preparation',
                    notes: 'Party event - 2 trays'
                }
            ];
            await StockDeduction.insertMany(deductions);
            console.log(`✅ Seeded ${deductions.length} stock deductions`);
        } else {
            console.log(`⏭️  StockDeductions already exist (${existingDeductions} records)`);
        }

        // ==================== GET STAFF AND MENU ITEMS FOR ASSIGNMENTS ====================
        const staff = await User.findOne({ role: 'staff' });
        const menuItem = await MenuItem.findOne({ isActive: true });

        // ==================== SEED STAFF ASSIGNMENTS ====================
        console.log('\n🔄 Seeding StaffAssignment collection...');
        const existingAssignments = await StaffAssignment.countDocuments();
        if (existingAssignments === 0 && staff && menuItem) {
            const assignments = [
                {
                    staffId: staff._id,
                    menuItemId: menuItem._id,
                    status: 'active',
                    assignedQuantity: 5,
                    maxQuantity: 20,
                    notes: 'Assigned for morning shift'
                },
                {
                    staffId: staff._id,
                    menuItemId: menuItem._id,
                    status: 'active',
                    assignedQuantity: 8,
                    maxQuantity: 30,
                    notes: 'Assigned for afternoon shift'
                }
            ];
            await StaffAssignment.insertMany(assignments);
            console.log(`✅ Seeded ${assignments.length} staff assignments`);
        } else if (!staff || !menuItem) {
            console.log('⏭️  Skipping StaffAssignments - need Staff and MenuItem records first');
        } else {
            console.log(`⏭️  StaffAssignments already exist (${existingAssignments} records)`);
        }

        // ==================== SEED STOCK TRANSFERS ====================
        console.log('\n🔄 Seeding StockTransfer collection...');
        const existingTransfers = await StockTransfer.countDocuments();
        if (existingTransfers === 0 && staff && menuItem) {
            const transfers = [
                {
                    type: 'transfer_to_staff',
                    staffId: staff._id,
                    menuItemId: menuItem._id,
                    menuItemName: menuItem.itemName,
                    quantity: 10,
                    previousStock: 50,
                    newStock: 40,
                    status: 'completed',
                    notes: 'Stock transfer for morning shift',
                    processedAt: new Date(),
                    processedBy: staff._id
                },
                {
                    type: 'request_from_inventory',
                    staffId: staff._id,
                    menuItemId: menuItem._id,
                    menuItemName: menuItem.itemName,
                    quantity: 5,
                    previousStock: 40,
                    newStock: 45,
                    status: 'pending',
                    notes: 'Request for restock',
                    managerNotes: 'Awaiting approval'
                }
            ];
            await StockTransfer.insertMany(transfers);
            console.log(`✅ Seeded ${transfers.length} stock transfers`);
        } else if (!staff || !menuItem) {
            console.log('⏭️  Skipping StockTransfers - need Staff and MenuItem records first');
        } else {
            console.log(`⏭️  StockTransfers already exist (${existingTransfers} records)`);
        }

        // ==================== SEED SETTINGS ====================
        console.log('\n🔄 Seeding Settings collection...');
        const admin = await User.findOne({ role: 'admin' });
        const existingSettings = await Settings.countDocuments();
        if (existingSettings === 0 && admin) {
            const settings = new Settings({
                userId: admin._id,
                fullName: admin.firstName && admin.lastName ? `${admin.firstName} ${admin.lastName}` : 'Administrator',
                firstName: admin.firstName || 'Admin',
                lastName: admin.lastName || 'User',
                businessName: "G'RAY COUNTRYSIDE CAFÉ",
                businessAddress: "IPO Road, Barangay Minuyan Proper",
                businessCity: "City of San Jose Del Monte, Bulacan",
                businessPhone: "(+63) 123-456-7890",
                vatRegNo: "VAT-Reg-TIN: 123-456-789-000",
                permitNo: "BTRCP-2024-00123",
                receiptHeader: "BESTLINK COLLEGE OF THE PHILIPPINES",
                theme: 'light',
                language: 'en',
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12h',
                currency: 'PHP',
                notifications: {
                    emailNotifications: false,
                    lowStockAlerts: true,
                    orderNotifications: true,
                    systemAlerts: true
                },
                twoFactorAuth: false,
                sessionTimeout: 30,
                timezone: 'Asia/Manila',
                taxRate: 0.12,
                discountPolicy: {
                    allowManualDiscounts: true,
                    maxDiscountPercentage: 50
                },
                lowStockThreshold: 5,
                autoReorderEnabled: false,
                receiptSettings: {
                    includeCompanyLogo: true,
                    includeQRCode: false,
                    paperWidth: '80mm',
                    printFooterMessage: 'Thank you for visiting G\'RAY COUNTRYSIDE CAFÉ!'
                },
                autoBackup: {
                    enabled: true,
                    frequency: 'daily'
                },
                isActive: true,
                lastModifiedBy: admin._id
            });
            await settings.save();
            console.log('✅ Seeded Settings record');
        } else if (!admin) {
            console.log('⏭️  Skipping Settings - need Admin user first');
        } else {
            console.log(`⏭️  Settings already exist (${existingSettings} records)`);
        }

        console.log('\n✅✅✅ SEEDING COMPLETED SUCCESSFULLY! ✅✅✅\n');
        console.log('📊 Summary:');
        console.log(`   • Products: ${await Product.countDocuments()} records`);
        console.log(`   • Stats: ${await Stats.countDocuments()} records`);
        console.log(`   • StockDeductions: ${await StockDeduction.countDocuments()} records`);
        console.log(`   • StaffAssignments: ${await StaffAssignment.countDocuments()} records`);
        console.log(`   • StockTransfers: ${await StockTransfer.countDocuments()} records`);
        console.log(`   • Settings: ${await Settings.countDocuments()} records`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedAllCollections();
