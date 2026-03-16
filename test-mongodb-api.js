#!/usr/bin/env node

/**
 * Quick Fix: Test MongoDB Connection & API Endpoints
 * This script checks if MongoDB is accessible and APIs are working
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function testMongoDBConnection() {
    console.log('🔍 Testing MongoDB Connection...\n');
    
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not set in .env file\n');
            return false;
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log('✅ MongoDB connection successful\n');
        
        // Get some stats
        const admin = mongoose.connection.db.admin();
        const status = await admin.ping();
        console.log('✅ MongoDB server is responding\n');

        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📊 Database Collections: ${collections.length}`);
        collections.forEach(col => console.log(`   - ${col.name}`));

        await mongoose.connection.close();
        return true;

    } catch (error) {
        console.error('❌ MongoDB connection failed');
        console.error(`   Error: ${error.message}\n`);
        return false;
    }
}

async function testAPIEndpoints() {
    console.log('\n🔍 Testing API Endpoints...\n');
    
    const baseURL = process.env.API_URL || 'http://localhost:5050';
    const endpoints = [
        { method: 'GET', path: '/api/inventory', description: 'Get all inventory items' },
        { method: 'GET', path: '/api/menu-items', description: 'Get all menu items' },
        { method: 'GET', path: '/api/health', description: 'Health check' }
    ];

    for (const endpoint of endpoints) {
        try {
            const url = `${baseURL}${endpoint.path}`;
            const response = await axios({
                method: endpoint.method,
                url: url,
                timeout: 3000
            });
            console.log(`✅ ${endpoint.method} ${endpoint.path}`);
            console.log(`   Description: ${endpoint.description}`);
            console.log(`   Status: ${response.status}\n`);
        } catch (error) {
            console.log(`❌ ${endpoint.method} ${endpoint.path}`);
            console.log(`   Description: ${endpoint.description}`);
            console.log(`   Status: ${error.response?.status || 'Connection failed'}\n`);
        }
    }
}

async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('  MongoDB & API Endpoint Diagnostic Tool');
    console.log('═══════════════════════════════════════════\n');

    const mongoConnected = await testMongoDBConnection();
    
    if (!mongoConnected) {
        console.log('\n⚠️  MongoDB is not accessible');
        console.log('SOLUTION:');
        console.log('1. Make sure MongoDB is running');
        console.log('2. Check your .env file for correct MONGODB_URI');
        console.log('3. Verify network connection to MongoDB server');
        console.log('4. Run: npm install');
        console.log('5. Run: node fix-inventory-data.js\n');
    } else {
        console.log('\n💡 MongoDB is working. Now checking APIs...\n');
        await testAPIEndpoints();
    }

    console.log('═══════════════════════════════════════════\n');
}

main().catch(console.error);
