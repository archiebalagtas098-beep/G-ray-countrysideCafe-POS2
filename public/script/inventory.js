// ==================== UI ELEMENTS ====================
let elements = {}; // Will be initialized after DOM loads

function initializeElements() {
    elements = {
        // Modal elements
        itemModal: document.getElementById('itemModal'),
        modalTitle: document.getElementById('modalTitle'),
        itemForm: document.getElementById('itemForm'),
        closeModal: document.getElementById('closeModal'),
        duplicateNotification: document.getElementById('duplicateNotification'),
        duplicateIngredientName: document.getElementById('duplicateIngredientName'),
        
        // Form fields
        itemId: document.getElementById('itemId'),
        itemName: document.getElementById('itemName'),
        itemType: document.getElementById('itemTypes'),
        itemCategory: document.getElementById('itemCategories'),
        itemUnit: document.getElementById('itemUnit'),
        currentStock: document.getElementById('currentStock'),
        minStock: document.getElementById('minStock'),
        maxStock: document.getElementById('maxStock'),
        description: document.getElementById('description'),
        
        // Buttons
        addNewItem: document.getElementById('addNewItem'),
        saveItemBtn: document.getElementById('saveItemBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        refreshDashboard: document.getElementById('refreshDashboard'),
        
        // Grid containers
        inventoryGrid: document.getElementById('inventoryGrid'),
        dashboardGrid: document.getElementById('dashboardGrid'),
        
        // Dashboard stats
        totalItems: document.getElementById('allInventoryItems'),
        lowStock: document.getElementById('lowStock'),
        outOfStock: document.getElementById('outOfStock'),
        inStock: document.getElementById('inStock'),
        
        // Navigation
        navLinks: document.querySelectorAll('.nav-link[data-section]'),
        categoryItems: document.querySelectorAll('.category-item[data-category]'),
        
        // Info displays
        recipeInfo: document.getElementById('recipeInfo'),
        
        // Search
        searchInput: document.getElementById('searchInventory')
    };
    
    console.log('✅ Elements initialized');
}

// ==================== GLOBAL VARIABLES ====================
let allInventoryItems = [];
let currentSection = 'dashboard';
let currentCategory = '';
let isModalOpen = false;

const categoryUnitsMapping = {
    'meat': ['kg', 'g', 'pieces'],
    'seafood': ['kg', 'g', 'pieces'],
    'produce': ['kg', 'g', 'pieces'],
    'dairy': ['liters', 'ml', 'pieces'],
    'dry': ['kg', 'g', 'liters', 'ml', 'pieces'],
    'beverage': ['liters', 'ml', 'pieces'],
    'packaging': ['pieces', 'packs']
};

// ==================== ITEM-SPECIFIC UNITS ====================
// Override category units for specific items
const itemSpecificUnits = {
    'Soda (Mismo)': ['bottle'],
    'Soda 1.5L': ['bottle'],
    'Blue Lemonade (Glass)': ['glass'],
    'Blue Lemonade (Pitcher)': ['pitcher'],
    'Cucumber Lemonade (Glass)': ['glass'],
    'Cucumber Lemonade (Pitcher)': ['pitcher'],
    'Red Tea (Glass)': ['glass']
};

const validRawIngredients = {
    // ==================== MEAT & POULTRY ====================
    'Pork': 'meat',
    'Pork belly': 'meat',
    'Pork chop': 'meat',
    'Ground pork': 'meat',
    'Chicken': 'meat',
    'Fried chicken': 'meat',
    'Shrimp': 'meat',
    'Fish fillet': 'meat',
    'Cream dory': 'meat',
    'Beef shank': 'meat',
    'Bagnet': 'meat',
    'Tinapa': 'meat',
    'Tuyo': 'meat',
    'Ham': 'meat',
    'Hotdog': 'meat',
    
    // ==================== SEAFOOD ====================
    'Fish': 'seafood',
    
    // ==================== FRESH PRODUCE ====================
    'Garlic': 'produce',
    'Onion': 'produce',
    'Carrot': 'produce',
    'Cabbage': 'produce',
    'Tomato': 'produce',
    'Lettuce': 'produce',
    'Cucumber': 'produce',
    'Lemon': 'produce',
    'Bell pepper': 'produce',
    'Calamansi': 'produce',
    'Chili': 'produce',
    'Siling green': 'produce',
    'Radish': 'produce',
    'Kangkong': 'produce',
    'Eggplant': 'produce',
    'Squash': 'produce',
    'Okra': 'produce',
    'Ampalaya': 'produce',
    'Corn': 'produce',
    'Potato': 'produce',
    'Bread': 'produce',
    
    // ==================== DAIRY & EGGS ====================
    'Butter': 'dairy',
    'Egg': 'dairy',
    'Milk': 'dairy',
    'Cheese': 'dairy',
    'Cream': 'dairy',
    'Mayonnaise': 'dairy',
    
    // ==================== PANTRY STAPLES ====================
    'Soy sauce': 'dry',
    'Vinegar': 'dry',
    'Salt': 'dry',
    'Sugar': 'dry',
    'Black Pepper': 'dry',
    'Cooking oil': 'dry',
    'Sesame oil': 'dry',
    'Flour': 'dry',
    'Cornstarch': 'dry',
    'Breadcrumbs': 'dry',
    'Gochujang': 'dry',
    'Oyster sauce': 'dry',
    'Shrimp paste': 'dry',
    'Tamarind mix': 'dry',
    'Peppercorn': 'dry',
    'Chili flakes': 'dry',
    'Honey': 'dry',
    'Paprika': 'dry',
    'Bay leaves': 'dry',
    'Herbs': 'dry',
    'Vegetables': 'dry',
    'Sweet tomato sauce': 'dry',
    'Pasta Sauce': 'dry',
    'Gravy': 'dry',
    'Butter': 'dry',
    'Cheese sauce': 'dry',
    'Ground meat': 'dry',
    'Water': 'dry',
    'Ice': 'dry',
    
    // ==================== NOODLES & PASTA ====================
    'Pancit canton': 'dry',
    'Spaghetti pasta': 'dry',
    'Pasta': 'dry',
    'Pancit bihon': 'dry',
    
    // ==================== RICE & GRAINS ====================
    'Rice': 'dry',
    
    // ==================== BEVERAGES ====================
    'Lemon juice': 'beverage',
    'Blue syrup': 'beverage',
    'Tea': 'beverage',
    'Black tea': 'beverage',
    'Espresso': 'beverage',
    'Hot water': 'beverage',
    'Steamed milk': 'beverage',
    'Carbonated soft drink': 'beverage',
    'beef broth': 'beverage',
    'Milk tea base': 'beverage',
    
    // ==================== COFFEE & TEA INGREDIENTS ====================
    'Coffee beans': 'dry',
    'Matcha powder': 'dry',
    'Matcha Green Tea Powder': 'dry',
    'Caramel syrup': 'dry',
    'Caramel Sauce': 'dry',
    'Vanilla syrup': 'dry',
    'Strawberry syrup': 'dry',
    'Mango flavor': 'dry',
    'Cream cheese flavor': 'dry',
    'Tapioca pearls': 'dry',
    'Cookie crumbs': 'dry',
    'Sweetener': 'dry',
    
    // ==================== SNACKS & SIDES ====================
    'Nacho chips': 'dry',
    'Lumpiang wrapper': 'dry',
    'French fries': 'dry',
    
    // ==================== PACKAGING ====================
    'Paper cups': 'packaging',
    'Straws': 'packaging',
    'Napkins': 'packaging',
    'Food containers': 'packaging',
    'Plastic utensils': 'packaging',
    'Tray S': 'packaging',
    'Tray M': 'packaging',
    'Tray L': 'packaging'
};

// ==================== COMPLETE RECIPE MAPPING ====================
const recipeMapping = {
    // ================ MEAT & POULTRY ================
    'Pork': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Pork Shanghai',
        'Sinigang (Pork)',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop'
    ],
    'Pork belly': [
        'Crispy Pork Lechon Kawali',
        'Sizzling Liempo'
    ],
    'Chicken': [
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Fried Chicken',
        'Sizzling Fried Chicken',
        'Clubhouse Sandwich'
    ],
    'Fried chicken': [
        'Fried Chicken',
        'Budget Fried Chicken',
        'Fish and Fries'
    ],
    'Cream dory': [
        'Cream Dory Fish Fillet',
        'Fish and Fries'
    ],
    'Shrimp': [
        'Sinigang (Shrimp)',
        'Buttered Shrimp',
        'Special Bulalo'
    ],
    'Bagnet': [
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Tinapa': [
        'Tinapa Rice'
    ],
    'Tuyo': [
        'Tuyo Pesto'
    ],
    
    // ================ FRESH PRODUCE ================
    'Garlic': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Fried Chicken',
        'Pork Shanghai',
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Special Bulalo',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti (Filipino Style)',
        'Fried Rice'
    ],
    'Onion': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Sizzling Pork Sisig',
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Special Bulalo',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti (Filipino Style)',
        'Fried Rice',
        'Cheesy Nachos',
        'Nachos Supreme'
    ],
    'Chili': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Sizzling Pork Sisig',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)'
    ],
    'Calamansi': [
        'Sizzling Pork Sisig',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Buttered Shrimp',
        'Cucumber Lemonade',
        'Blue Lemonade'
    ],
    'Tomato': [
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Spaghetti (Filipino Style)'
    ],
    'Cucumber': [
        'Cucumber Lemonade',
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Corn': [
        'Special Bulalo',
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Potato': [
        'Special Bulalo',
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Carrot': [
        'Special Bulalo',
        'Paknet (Pakbet w/ Bagnet)',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)'
    ],
    
    // ================ DAIRY & EGGS ================
    'Egg': [
        'Sizzling Pork Sisig',
        'Fried Rice'
    ],
    'Butter': [
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Buttered Shrimp'
    ],
    'Mayonnaise': [
        'Sizzling Pork Sisig',
        'Clubhouse Sandwich'
    ],
    'Cream': [
        'Caramel Macchiato',
        'Cookies & Cream',
        'Strawberry & Cream',
        'Mango Cheesecake'
    ],
    'Cream cheese flavor': [
        'Mango Cheesecake'
    ],
    'Milk': [
        'Cafe Latte',
        'Caramel Macchiato',
        'Milk Tea',
        'Cookies & Cream',
        'Strawberry & Cream',
        'Mango Cheesecake',
        'Steamed milk'
    ],
    'Cheese': [
        'Cheesy Nachos',
        'Nachos Supreme',
        'Cheesy Dynamite Lumpia'
    ],
    
    // ================ PANTRY STAPLES ================
    'Gochujang': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)'
    ],
    'Sesame oil': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Fried Rice'
    ],
    'Soy sauce': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Chicken Adobo',
        'Sizzling Pork Sisig',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti (Filipino Style)',
        'Fried Rice'
    ],
    'Oyster sauce': [
        'Sizzling Pork Sisig',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Shrimp paste': [
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Tuyo Pesto'
    ],
    'Tamarind mix': [
        'Sinigang (Pork)',
        'Sinigang (Shrimp)'
    ],
    'Cooking oil': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Pork Shanghai',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Fried Chicken',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet',
        'Fish and Fries',
        'French Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai',
        'Fried Rice',
        'Cheesy Nachos',
        'Nachos Supreme'
    ],
    'Salt': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Fried Chicken',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet',
        'Fish and Fries',
        'French Fries',
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo',
        'Fried Rice',
        'Plain Rice'
    ],
    'Black pepper': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Sizzling Pork Sisig',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp'
    ],
    'Peppercorn': [
        'Korean Salt and Pepper (Pork)'
    ],
    'Cornstarch': [
        'Crispy Pork Lechon Kawali',
        'Pork Shanghai',
        'Lumpiang Shanghai',
        'Cheesy Dynamite Lumpia'
    ],
    'Bay leaves': [
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Special Bulalo'
    ],
    'Honey': [
        'Buttered Honey Chicken',
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea'
    ],
    'Sugar': [
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea',
        'Cafe Latte',
        'Cafe Americano',
        'Caramel Macchiato',
        'Milk Tea',
        'Matcha Green Tea',
        'Cookies & Cream',
        'Strawberry & Cream',
        'Mango Cheesecake',
        'Fried Rice'
    ],
    'Breadcrumbs': [
        'Pork Shanghai',
        'Lumpiang Shanghai',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet'
    ],
    'Flour': [
        'Pork Shanghai',
        'Lumpiang Shanghai',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet',
        'French Fries',
        'Fish and Fries'
    ],
    'Gravy': [
        'Clubhouse Sandwich'
    ],
    'Cheese sauce': [
        'Cheesy Nachos',
        'Nachos Supreme',
        'Cheesy Dynamite Lumpia'
    ],
    'Sweet tomato sauce': [
        'Spaghetti (Filipino Style)'
    ],
    'Vegetables': [
        'Special Bulalo',
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Water': [
        'Special Bulalo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Fried Rice'
    ],
    
    // ================ NOODLES & PASTA ================
    'Pancit canton': [
        'Pancit Canton + Bihon (Mixed)'
    ],
    'noodles': [
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Spaghetti pasta': [
        'Spaghetti (Filipino Style)'
    ],
    'Pasta Sauce': [
        'Spaghetti (Filipino Style)'
    ],
    
    // ================ RICE ================
    'Rice': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Pork Shanghai',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Fried Chicken',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Fried Rice',
        'Plain Rice',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo'
    ],
    
    // ================ BEVERAGES ================
    'Lemon juice': [
        'Cucumber Lemonade',
        'Blue Lemonade'
    ],
    'Blue syrup': [
        'Blue Lemonade'
    ],
    'Tea': [
        'Red Tea',
        'Milk Tea',
        'Matcha Green Tea'
    ],
    'Black tea': [
        'Red Tea'
    ],
    'Espresso': [
        'Cafe Americano',
        'Cafe Latte',
        'Caramel Macchiato'
    ],
    'Hot water': [
        'Cafe Americano',
        'Red Tea'
    ],
    'Steamed milk': [
        'Cafe Latte',
        'Caramel Macchiato'
    ],
    'Carbonated soft drink': [
        'Soda'
    ],
    'Chicken broth': [
        'Special Bulalo'
    ],
    
    // ================ COFFEE & TEA INGREDIENTS ================
    'Coffee beans': [
        'Cafe Americano',
        'Cafe Latte',
        'Caramel Macchiato'
    ],
    'Matcha powder': [
        'Matcha Green Tea'
    ],
    'Caramel syrup': [
        'Caramel Macchiato'
    ],
    'Vanilla syrup': [
        'Cafe Latte'
    ],
    'Strawberry syrup': [
        'Strawberry & Cream'
    ],
    'Mango flavor': [
        'Mango Cheesecake'
    ],
    'Tapioca pearls': [
        'Milk Tea',
        'Matcha Green Tea',
        'Cookies & Cream',
        'Strawberry & Cream',
        'Mango Cheesecake'
    ],
    'Cookie crumbs': [
        'Cookies & Cream'
    ],
    
    // ================ SNACKS & SIDES ================
    'Nacho chips': [
        'Cheesy Nachos',
        'Nachos Supreme'
    ],
    'Lumpiang wrapper': [
        'Lumpiang Shanghai',
        'Cheesy Dynamite Lumpia'
    ],
    'French fries': [
        'French Fries',
        'Fish and Fries'
    ],
    'Bread': [
        'Clubhouse Sandwich'
    ],
    
    // ================ PACKAGING ================
    'Paper cups': [
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea',
        'Cafe Americano',
        'Cafe Latte',
        'Caramel Macchiato',
        'Milk Tea',
        'Matcha Green Tea',
        'Cookies & Cream',
        'Strawberry & Cream',
        'Mango Cheesecake',
        'Soda'
    ],
    'Straws': [
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea',
        'Milk Tea',
        'Matcha Green Tea',
        'Cookies & Cream',
        'Strawberry & Cream',
        'Mango Cheesecake',
        'Soda'
    ],
    'Napkins': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Pork Shanghai',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Fried Chicken',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cheesy Nachos',
        'Nachos Supreme',
        'French Fries',
        'Clubhouse Sandwich',
        'Fish and Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo'
    ],
    'Food containers': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Pork Shanghai',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Fried Chicken',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti (Filipino Style)',
        'Cheesy Nachos',
        'Nachos Supreme',
        'French Fries',
        'Clubhouse Sandwich',
        'Fish and Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai',
        'Fried Rice',
        'Plain Rice',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo'
    ]
};

// ==================== IN STOCK FUNCTIONS ====================

function getInStockCount() {
    return allInventoryItems.filter(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || 10;
        return currentStock > minStock;
    }).length;
}

function getInStockItems() {
    return allInventoryItems.filter(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || 10;
        return currentStock > minStock;
    });
}

function updateInStockIndicator(inStockCount, totalCount) {
    const inStockEl = document.getElementById('inStock');
    const statCard = inStockEl ? inStockEl.closest('.stat-card') : null;
    
    if (!statCard) return;
    
    const percentage = totalCount > 0 ? Math.round((inStockCount / totalCount) * 100) : 0;
    
    const statChangeEl = statCard.querySelector('.stat-change');
    if (statChangeEl) {
        statChangeEl.textContent = `${percentage}% stocked`;
        statChangeEl.className = `stat-change ${
            percentage >= 70 ? 'positive' : 
            percentage >= 50 ? 'warning' : 
            'negative'
        }`;
    }
    
    statCard.classList.remove('in-stock-stat', 'warning', 'critical');
    if (percentage >= 70) {
        statCard.classList.add('in-stock-stat');
    } else if (percentage >= 50) {
        statCard.classList.add('warning');
    } else {
        statCard.classList.add('critical');
    }
}

// ==================== DASHBOARD STATS FUNCTION ====================

function updateDashboardStats() {
    console.log('📊 Updating dashboard stats...');
    
    const totalItemsEl = document.getElementById('allInventoryItems');
    const lowStockEl = document.getElementById('lowStock');
    const outOfStockEl = document.getElementById('outOfStock');
    const inStockEl = document.getElementById('inStock');
    
    if (!totalItemsEl || !lowStockEl || !outOfStockEl || !inStockEl) {
        console.warn('⚠️ Some dashboard stat elements not found');
        return;
    }
    
    const totalItems = allInventoryItems.length;
    const lowStockItems = allInventoryItems.filter(item => isLowStock(item)).length;
    const outOfStockItems = allInventoryItems.filter(item => isOutOfStock(item)).length;
    const inStockItems = getInStockCount();
    
    totalItemsEl.textContent = totalItems;
    lowStockEl.textContent = lowStockItems;
    outOfStockEl.textContent = outOfStockItems;
    inStockEl.textContent = inStockItems;
    
    updateInStockIndicator(inStockItems, totalItems);
    updateCategoryCounts();
    
    console.log('✅ Dashboard stats updated:', { totalItems, inStockItems, lowStockItems, outOfStockItems });
}

// ==================== CATEGORY FILTERING FUNCTION ====================

function filterIngredientsByCategory(selectedCategory) {
    const ingredientSelect = document.getElementById('itemName');
    if (!ingredientSelect) return;
    
    ingredientSelect.value = '';
    
    // Keep only the first option (Select Ingredient)
    while (ingredientSelect.options.length > 1) {
        ingredientSelect.remove(1);
    }
    
    if (selectedCategory) {
        Object.entries(validRawIngredients).forEach(([itemName, category]) => {
            if (category === selectedCategory) {
                const option = document.createElement('option');
                option.value = itemName;
                option.textContent = itemName;
                option.dataset.category = category;
                ingredientSelect.appendChild(option);
            }
        });
    }
}

// ==================== CATEGORY OPTIONS FUNCTIONS ====================

function updateCategoryOptions() {
    if (!elements.itemCategory) return;
    
    elements.itemCategory.innerHTML = '<option value="">Select Category</option>';
    
    const categories = {
        'meat': 'Meat & Poultry',
        'seafood': 'Seafood',
        'produce': 'Vegetables & Fruits',
        'dairy': 'Dairy & Eggs',
        'dry': 'Dry Goods',
        'beverage': 'Beverages',
        'packaging': 'Packaging'
    };
    
    Object.entries(categories).forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        elements.itemCategory.appendChild(option);
    });
}

function updateItemNameOptions() {
    if (!elements.itemName) return;
    
    const currentValue = elements.itemName.value;
    
    elements.itemName.innerHTML = '<option value="">Select Ingredient</option>';
    
    Object.keys(validRawIngredients).forEach(itemName => {
        const option = document.createElement('option');
        option.value = itemName;
        option.textContent = itemName;
        option.dataset.category = validRawIngredients[itemName];
        elements.itemName.appendChild(option);
    });
    
    elements.itemName.value = currentValue;
}

function updateUnitOptions(category, itemName = null) {
    if (!elements.itemUnit) return;
    
    elements.itemUnit.innerHTML = '<option value="">Select Unit</option>';
    
    // Check if this item has specific unit restrictions
    let units;
    if (itemName && itemSpecificUnits[itemName]) {
        units = itemSpecificUnits[itemName];
    } else {
        units = categoryUnitsMapping[category] || ['pieces', 'kg', 'g', 'liters', 'ml'];
    }
    
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        elements.itemUnit.appendChild(option);
    });
}

// ==================== AUTO-FILL FROM CATEGORY ====================

function autoFillItemFromCategory(category) {
    if (!elements.itemName || !elements.itemCategory) return;
    
    console.log(`🔄 Auto-filling from category: ${category}`);
    
    elements.itemCategory.value = category;
    
    const categoryItems = Object.entries(validRawIngredients)
        .filter(([itemName, itemCategory]) => itemCategory === category)
        .map(([itemName]) => itemName);
    
    if (categoryItems.length > 0) {
        // Clear and add category-specific items
        elements.itemName.innerHTML = '<option value="">Select Ingredient</option>';
        
        categoryItems.forEach(itemName => {
            const option = document.createElement('option');
            option.value = itemName;
            option.textContent = itemName;
            option.dataset.category = category;
            elements.itemName.appendChild(option);
        });
        
        // Auto-select the first item
        const firstItem = categoryItems[0];
        elements.itemName.value = firstItem;
        
        // Update unit options with first item
        updateUnitOptions(category, firstItem);
        
        // Auto-fill unit
        const unit = getUnitFromItem(firstItem, category);
        if (elements.itemUnit) {
            elements.itemUnit.value = unit;
        }
        
        // Set item type to raw
        if (elements.itemType) {
            elements.itemType.value = 'raw';
        }
        
        // Set default stock values
        if (elements.currentStock) elements.currentStock.value = 0;
        if (elements.minStock) elements.minStock.value = 10;
        if (elements.maxStock) elements.maxStock.value = 50;
        
        // Show recipe info
        showRecipeInfo(firstItem);
        
        console.log(`✅ Auto-filled: ${firstItem}`);
        showToast(`Auto-filled with "${firstItem}"`, 'info');
    }
}

// ==================== DUPLICATE DETECTION ====================

function checkAndShowDuplicateNotification() {
    const itemName = elements.itemName?.value;
    const itemId = elements.itemId?.value;
    const isEdit = itemId && itemId.trim() !== '';
    
    if (!itemName || !elements.duplicateNotification) {
        hideDuplicateNotification();
        return;
    }
    
    // Check if this ingredient already exists
    const isDuplicate = allInventoryItems.some(item => {
        const isSameName = item.itemName.toLowerCase() === itemName.toLowerCase();
        
        // When adding new, any match is a duplicate
        if (!isEdit) {
            return isSameName;
        }
        
        // When editing, exclude the current item from comparison
        return isSameName && (item._id !== itemId && item.id !== itemId);
    });
    
    if (isDuplicate) {
        showDuplicateNotification(itemName);
    } else {
        hideDuplicateNotification();
    }
}

function showDuplicateNotification(ingredientName) {
    if (!elements.duplicateNotification || !elements.duplicateIngredientName) return;
    
    elements.duplicateIngredientName.textContent = ingredientName;
    elements.duplicateNotification.classList.add('show');
    elements.duplicateNotification.style.display = 'flex';
}

function hideDuplicateNotification() {
    if (!elements.duplicateNotification) return;
    
    elements.duplicateNotification.classList.remove('show');
    elements.duplicateNotification.style.display = 'none';
}

// ==================== MODAL FUNCTIONS ====================

function openAddModal() {
    if (elements.modalTitle) elements.modalTitle.textContent = 'Add New Raw Ingredient';
    if (elements.itemId) elements.itemId.value = '';
    if (elements.itemForm) elements.itemForm.reset();
    
    // Hide duplicate notification when opening add modal
    hideDuplicateNotification();
    
    updateCategoryOptions();
    updateItemNameOptions();
    updateUnitOptions('dry');
    
    // Reset ingredient filter
    filterIngredientsByCategory('');
    
    if (elements.itemModal) {
        elements.itemModal.style.display = 'flex';
        isModalOpen = true;
    }
}

// FIXED EDIT MODAL FUNCTION
function openEditModal(itemId) {
    const item = allInventoryItems.find(item => item._id === itemId || item.id === itemId);
    if (!item) {
        showToast('Item not found', 'error');
        return;
    }
    
    console.log('Editing item:', item);
    
    if (elements.modalTitle) elements.modalTitle.textContent = 'Edit Raw Ingredient';
    if (elements.itemId) elements.itemId.value = item._id || item.id || '';
    
    // Get category from item or derive from name
    const category = item.category || getCategoryFromName(item.itemName);
    
    // Update form fields
    if (elements.itemName) {
        // First filter ingredients by category
        filterIngredientsByCategory(category);
        // Then set the value
        setTimeout(() => {
            elements.itemName.value = item.itemName;
        }, 10);
    }
    
    if (elements.itemType) elements.itemType.value = item.itemType || 'raw';
    if (elements.itemCategory) {
        elements.itemCategory.value = category;
        // Update unit options based on category and item name
        updateUnitOptions(category, item.itemName);
    }
    
    if (elements.itemUnit) {
        setTimeout(() => {
            elements.itemUnit.value = item.unit || getUnitFromItem(item.itemName, category);
        }, 10);
    }
    
    if (elements.currentStock) elements.currentStock.value = item.currentStock || 0;
    if (elements.minStock) elements.minStock.value = item.minStock || 10;
    if (elements.maxStock) elements.maxStock.value = item.maxStock || 50;
    if (elements.description) elements.description.value = item.description || '';
    
    // ✅ Allow editing all fields including stock for out-of-stock items
    if (elements.currentStock) {
        elements.currentStock.disabled = false;
        elements.currentStock.style.backgroundColor = '';
        elements.currentStock.style.borderColor = '';
        elements.currentStock.title = '';
    }
    
    // Show recipe info
    showRecipeInfo(item.itemName);
    
    // Check for duplicate notification (in case name was changed to match another)
    checkAndShowDuplicateNotification();
    
    // Open modal
    elements.itemModal.style.display = 'flex';
    isModalOpen = true;
}

function closeModal() {
    if (elements.itemModal) {
        elements.itemModal.style.display = 'none';
        isModalOpen = false;
    }
    if (elements.itemForm) elements.itemForm.reset();
    hideDuplicateNotification();
}

// ==================== VIEW USAGE HISTORY ====================
function viewUsageHistory(itemId, itemName) {
    const item = allInventoryItems.find(i => (i._id || i.id) === itemId);
    
    if (!item) {
        alert('Item not found');
        return;
    }
    
    const usageHistory = item.usageHistory || [];
    
    if (usageHistory.length === 0) {
        alert(`📋 No deduction history for ${itemName}\n\nThis ingredient has not been deducted from any orders yet.`);
        return;
    }
    
    // Create a detailed history modal
    const historyModal = document.createElement('div');
    historyModal.className = 'history-modal';
    historyModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    `;
    
    const sortedHistory = [...usageHistory].reverse();
    const totalDeducted = usageHistory.reduce((sum, record) => sum + (record.quantity || 0), 0);
    
    const historyHTML = `
        <div style="background: white; border-radius: 8px; padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #333;">📋 Usage History: ${itemName}</h3>
                <button onclick="this.closest('.history-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">✕</button>
            </div>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center;">
                    <div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Total Deductions</div>
                        <div style="font-size: 24px; font-weight: bold; color: #dc3545;">-${totalDeducted} ${item.unit || 'units'}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Total Records</div>
                        <div style="font-size: 24px; font-weight: bold; color: #4e8a6a;">${usageHistory.length}</div>
                    </div>
                </div>
            </div>
            
            <div style="border-top: 2px solid #e0e0e0; padding-top: 15px;">
                ${sortedHistory.map((record, idx) => `
                    <div style="padding: 12px; margin-bottom: 10px; background: #f9f9f9; border-left: 4px solid #dc3545; border-radius: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; gap: 10px;">
                            <div style="flex: 1;">
                                <div style="font-weight: bold; color: #333; margin-bottom: 4px;">
                                    <span style="color: #dc3545; font-size: 16px;">-${record.quantity} ${item.unit || 'units'}</span>
                                </div>
                                <div style="font-size: 13px; color: #666; margin-bottom: 4px;">
                                    ${record.notes || 'Manual deduction'}
                                </div>
                                <div style="font-size: 11px; color: #999;">
                                    <strong>By:</strong> ${record.usedBy || 'System'} 
                                    <span style="margin-left: 10px;">📅 ${new Date(record.date).toLocaleString('en-PH')}</span>
                                </div>
                            </div>
                            <div style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap;">
                                #${idx + 1}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0; text-align: center;">
                <button onclick="this.closest('.history-modal').remove()" style="background: #4e8a6a; color: white; border: none; padding: 10px 30px; border-radius: 6px; cursor: pointer; font-weight: 500;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    historyModal.innerHTML = historyHTML;
    document.body.appendChild(historyModal);
    
    console.log(`✅ Opened usage history for ${itemName}:`, {
        totalRecords: usageHistory.length,
        totalDeducted: totalDeducted,
        unit: item.unit
    });
}

// ==================== GRID RENDERING FUNCTIONS ====================

function renderDashboardGrid() {
    if (!elements.dashboardGrid) return;
    
    // Sort items by stock status (out of stock first, then low stock)
    const sortedItems = [...allInventoryItems].sort((a, b) => {
        const aStock = parseFloat(a.currentStock) || 0;
        const bStock = parseFloat(b.currentStock) || 0;
        const aMin = parseFloat(a.minStock) || 10;
        const bMin = parseFloat(b.minStock) || 10;
        
        if (aStock === 0 && bStock > 0) return -1;
        if (aStock > 0 && bStock === 0) return 1;
        if (aStock <= aMin && bStock > bMin) return -1;
        if (aStock > aMin && bStock <= bMin) return 1;
        return 0;
    });
    
    // Display all inventory items (changed from 12 to show all items with pagination)
    const displayItems = sortedItems.slice(0, Math.max(sortedItems.length, 24));
    
    if (displayItems.length === 0) {
        elements.dashboardGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"></div>
                <h3>No inventory data</h3>
            </div>
        `;
        return;
    }
    
    elements.dashboardGrid.innerHTML = displayItems.map(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const maxStock = parseFloat(item.maxStock) || 50;
        const minStock = parseFloat(item.minStock) || 10;
        const unit = item.unit || 'pieces';
        const isOutOfStock = currentStock === 0;
        const isLowStock = currentStock > 0 && currentStock <= minStock;
        const percentage = maxStock > 0 ? Math.min(100, (currentStock / maxStock) * 100) : 0;
        
        // Get recent usage history (last 3 entries)
        const recentUsage = (item.usageHistory || []).slice(-3).reverse();
        const usageHTML = recentUsage.length > 0 ? `
            <div class="usage-history">
                <div class="usage-header">
                    <span class="label">🧂 Recent Deductions:</span>
                </div>
                <div class="usage-list">
                    ${recentUsage.map(usage => `
                        <div class="usage-item">
                            <span class="usage-qty">-${usage.quantity} ${unit}</span>
                            <span class="usage-note">${usage.notes || 'Manual deduction'}</span>
                            <span class="usage-user">${usage.usedBy || 'System'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';
        
        return `
            <div class="dashboard-card ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}">
                <div class="card-header">
                    <h4>${item.itemName}</h4>
                    <span class="card-badge ${isOutOfStock ? 'badge-danger' : isLowStock ? 'badge-warning' : 'badge-success'}">
                        ${isOutOfStock ? 'Out' : isLowStock ? 'Low' : 'Good'}
                    </span>
                </div>
                <div class="card-body">
                    <div class="stock-info">
                        <div class="stock-bar">
                            <div class="stock-bar-fill" style="width: ${percentage}%; background-color: ${isOutOfStock ? '#dc3545' : isLowStock ? '#ffc107' : '#28a745'};"></div>
                        </div>
                        <div class="stock-numbers">
                            <span>${currentStock} / ${maxStock} ${unit}</span>
                        </div>
                    </div>
                    <div class="card-details">
                        <div class="detail">
                            <span class="label">Min:</span>
                            <span class="value">${minStock}${unit}</span>
                        </div>
                        <div class="detail">
                            <span class="label">Status:</span>
                            <span class="value ${isOutOfStock ? 'text-danger' : isLowStock ? 'text-warning' : 'text-success'}">
                                ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                            </span>
                        </div>
                    </div>
                    ${usageHTML}
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-primary" onclick="openEditModal('${item._id || item.id}')">
                        Edit Raw Ingredients
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== UPDATED INVENTORY GRID WITHOUT DISH COUNTS ====================
function renderInventoryGrid() {
    if (!elements.inventoryGrid) return;
    
    if (allInventoryItems.length === 0) {
        elements.inventoryGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"></div>
                <h3>No inventory items</h3>
            </div>
        `;
        return;
    }
    
    elements.inventoryGrid.innerHTML = allInventoryItems.map(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || 10;
        const maxStock = parseFloat(item.maxStock) || 50;
        const unit = item.unit || 'pieces';
        const isOutOfStock = currentStock === 0;
        const isLowStock = currentStock > 0 && currentStock <= minStock;
        const categoryLabel = getCategoryLabel(item.category || getCategoryFromName(item.itemName));
        
        return `
            <div class="inventory-card ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}">
                <div class="card-header">
                    <div>
                        <h4>${item.itemName}</h4>
                        <span class="category-badge">${categoryLabel}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon" onclick="openEditModal('${item._id || item.id}')" title="Edit">✏️</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="stock-details">
                        <div class="stock-row">
                            <span class="label">Current:</span>
                            <span class="value ${isOutOfStock ? 'text-danger' : isLowStock ? 'text-warning' : 'text-success'}">
                                ${currentStock} ${unit}
                            </span>
                        </div>
                        <div class="stock-row">
                            <span class="label">Min:</span>
                            <span class="value">${minStock} ${unit}</span>
                        </div>
                        <div class="stock-row">
                            <span class="label">Max:</span>
                            <span class="value">${maxStock} ${unit}</span>
                        </div>
                    </div>
                    
                    <div class="status-display ${isOutOfStock ? 'status-out' : isLowStock ? 'status-low' : 'status-good'}">
                        ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </div>
                    
                    ${item.description ? `<div class="description">📝 ${item.description}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ==================== FILTERED RENDERING ====================

function renderFilteredInventoryGrid(filteredItems) {
    if (!elements.inventoryGrid) return;
    
    if (filteredItems.length === 0) {
        elements.inventoryGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No items found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
        return;
    }
    
    elements.inventoryGrid.innerHTML = filteredItems.map(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || 10;
        const maxStock = parseFloat(item.maxStock) || 50;
        const isOutOfStock = currentStock === 0;
        const isLowStock = currentStock > 0 && currentStock <= minStock;
        const categoryLabel = getCategoryLabel(item.category || getCategoryFromName(item.itemName));
        
        return `
            <div class="inventory-card ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}">
                <div class="card-header">
                    <div>
                        <h4>${item.itemName}</h4>
                        <span class="category-badge">${categoryLabel}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon" onclick="openEditModal('${item._id || item.id}')">✏️</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="stock-details">
                        <div class="stock-row">
                            <span class="label">Current:</span>
                            <span class="value ${isOutOfStock ? 'text-danger' : isLowStock ? 'text-warning' : 'text-success'}">
                                ${currentStock} ${item.unit || 'pieces'}
                            </span>
                        </div>
                        <div class="stock-row">
                            <span class="label">Min:</span>
                            <span class="value">${minStock} ${item.unit || 'pieces'}</span>
                        </div>
                        <div class="stock-row">
                            <span class="label">Max:</span>
                            <span class="value">${maxStock} ${item.unit || 'pieces'}</span>
                        </div>
                    </div>
                    
                    <div class="status-display ${isOutOfStock ? 'status-out' : isLowStock ? 'status-low' : 'status-good'}">
                        ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </div>
                </div>
            </div>
        `; 
    }).join('');
}

function renderFilteredDashboardGrid(filteredItems) {
    if (!elements.dashboardGrid) return;
    
    if (filteredItems.length === 0) {
        elements.dashboardGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No matching items</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }
    
    const displayItems = filteredItems.slice(0, Math.max(filteredItems.length, 24));
    
    elements.dashboardGrid.innerHTML = displayItems.map(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const maxStock = parseFloat(item.maxStock) || 50;
        const minStock = parseFloat(item.minStock) || 10;
        const unit = item.unit || 'pieces';
        const isOutOfStock = currentStock === 0;
        const isLowStock = currentStock > 0 && currentStock <= minStock;
        const percentage = maxStock > 0 ? Math.min(100, (currentStock / maxStock) * 100) : 0;
        
        // Get recent usage history (last 3 entries)
        const recentUsage = (item.usageHistory || []).slice(-3).reverse();
        const usageHTML = recentUsage.length > 0 ? `
            <div class="usage-history">
                <div class="usage-header">
                    <span class="label">🧂 Recent Deductions:</span>
                </div>
                <div class="usage-list">
                    ${recentUsage.map(usage => `
                        <div class="usage-item">
                            <span class="usage-qty">-${usage.quantity} ${unit}</span>
                            <span class="usage-note">${usage.notes || 'Manual deduction'}</span>
                            <span class="usage-user">${usage.usedBy || 'System'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';
        
        return `
            <div class="dashboard-card ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}">
                <div class="card-header">
                    <h4>${item.itemName}</h4>
                    <span class="card-badge ${isOutOfStock ? 'badge-danger' : isLowStock ? 'badge-warning' : 'badge-success'}">
                        ${isOutOfStock ? 'Out' : isLowStock ? 'Low' : 'Good'}
                    </span>
                </div>
                <div class="card-body">
                    <div class="stock-info">
                        <div class="stock-bar">
                            <div class="stock-bar-fill" style="width: ${percentage}%; background-color: ${isOutOfStock ? '#dc3545' : isLowStock ? '#ffc107' : '#28a745'};"></div>
                        </div>
                        <div class="stock-numbers">
                            <span>${currentStock} / ${maxStock} ${unit}</span>
                        </div>
                    </div>
                    <div class="card-details">
                        <div class="detail">
                            <span class="label">Min:</span>
                            <span class="value">${minStock}${unit}</span>
                        </div>
                        <div class="detail">
                            <span class="label">Status:</span>
                            <span class="value ${isOutOfStock ? 'text-danger' : isLowStock ? 'text-warning' : 'text-success'}">
                                ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                            </span>
                        </div>
                    </div>
                    ${usageHTML}
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-primary" onclick="openEditModal('${item._id || item.id}')">
                        ✏️ Edit
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== SEARCH FUNCTION ====================

function debounceSearch(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        if (currentSection === 'inventory') {
            renderInventoryGrid();
        } else if (currentSection === 'dashboard') {
            renderDashboardGrid();
        }
        return;
    }
    
    const filteredItems = allInventoryItems.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return item.itemName.toLowerCase().includes(searchLower) ||
               (item.category && item.category.toLowerCase().includes(searchLower)) ||
               (item.description && item.description.toLowerCase().includes(searchLower));
    });
    
    if (currentSection === 'inventory') {
        renderFilteredInventoryGrid(filteredItems);
    } else if (currentSection === 'dashboard') {
        renderFilteredDashboardGrid(filteredItems);
    }
}

// ==================== HELPER FUNCTIONS ====================

function getCategoryFromName(itemName) {
    return validRawIngredients[itemName] || 'dry';
}

// ==================== LIQUID ITEMS IN DRY GOODS ====================
const liquidItemsInDryGoods = [
    'Soy sauce',
    'Vinegar',
    'Cooking oil',
    'Sesame oil',
    'Oyster sauce',
    'Tamarind mix',
    'Honey',
    'Sweet tomato sauce',
    'Pasta Sauce',
    'Gravy',
    'Cheese sauce',
    'Water',
    'Gochujang',
    'Caramel syrup',
    'Vanilla syrup',
    'Strawberry syrup',
    'Mango flavor',
    'Cream cheese flavor',
    'Calamansi juice',
    'Lemon juice concentrate',
    'Fish sauce'
];

function isLiquidItem(itemName) {
    return liquidItemsInDryGoods.some(liquid => 
        itemName.toLowerCase().includes(liquid.toLowerCase())
    );
}

function getUnitFromItem(itemName, category) {
    const defaultUnits = {
        'meat': 'kg',
        'seafood': 'kg',
        'produce': 'kg',
        'dairy': 'liters',
        'dry': 'kg',
        'beverage': 'liters',
        'packaging': 'pieces'
    };
    
    // For dry goods, check if it's a liquid item
    if (category === 'dry' && isLiquidItem(itemName)) {
        return 'liters';
    }
    
    return defaultUnits[category] || 'pieces';
}

function getItemTypeFromName(itemName) {
    return validRawIngredients[itemName] ? 'raw' : 'finished';
}

function getCategoryLabel(category) {
    const labels = {
        'meat': 'Meat & Poultry',
        'seafood': 'Seafood',
        'produce': 'Vegetables & Fruits',
        'dairy': 'Dairy & Eggs',
        'dry': 'Dry Goods',
        'beverage': 'Beverages',
        'packaging': 'Packaging',
        'all': 'All Raw Ingredients'
    };
    return labels[category] || category || 'Uncategorized';
}

function showRecipeInfo(itemName) {
    if (!elements.recipeInfo) return;
    
    const recipes = recipeMapping[itemName] || [];
    if (recipes.length > 0) {
        elements.recipeInfo.innerHTML = `
            <div class="recipe-info">
                <strong>🍳 Used in:</strong>
                <span>${recipes.join(', ')}</span>
            </div>
        `;
        elements.recipeInfo.style.display = 'block';
    } else {
        elements.recipeInfo.style.display = 'none';
    }
}

// ==================== INGREDIENT NAME MAPPING ====================
// Maps inventory item names to recipe mapping names
const ingredientNameMapping = {
    'Coke': 'Carbonated soft drink',
    'Soda': 'Carbonated soft drink',
    'Carbonated soft drink': 'Carbonated soft drink',
    'Carrots': 'Carrot',
    'Carrot': 'Carrot',
    'Cream dory fillet': 'Cream dory',
    'Cream dory': 'Cream dory',
    'Fish fillet': 'Fish',
    'Fish': 'Fish',
    'Pancit bihon': 'noodles',
    'noodles': 'noodles',
    'Pancit canton': 'Pancit canton',
    'Spaghetti pasta': 'Spaghetti pasta',
    'Lumpiang wrapper': 'Lumpiang wrapper',
    'French fries': 'French fries',
    'Nacho chips': 'Nacho chips'
};

// Helper function to get the recipe mapping name for an ingredient
function getRecipeMappingName(inventoryItemName) {
    return ingredientNameMapping[inventoryItemName] || inventoryItemName;
}

// ==================== CHECK IF MENU ITEM CAN BE MADE ====================
function canMakeMenuItem(menuItemName) {
    // Find all ingredients needed for this menu item
    const ingredients = [];
    for (const [ingredient, dishes] of Object.entries(recipeMapping)) {
        if (dishes.includes(menuItemName)) {
            ingredients.push(ingredient);
        }
    }
    
    if (ingredients.length === 0) {
        return { canMake: false, reason: 'No ingredient mapping found' };
    }
    
    // Build stock lookup map
    const stockMap = new Map();
    allInventoryItems.forEach(item => {
        stockMap.set(item.itemName, parseFloat(item.currentStock || 0));
    });
    
    // Check each ingredient
    const missingIngredients = [];
    for (const ingredient of ingredients) {
        const stock = stockMap.get(ingredient) || 0;
        if (stock <= 0) {
            missingIngredients.push(ingredient);
        }
    }
    
    if (missingIngredients.length > 0) {
        return { 
            canMake: false, 
            reason: `Missing: ${missingIngredients.join(', ')}`,
            missingIngredients 
        };
    }
    
    return { canMake: true, ingredients };
}

// ==================== REDUCE STOCK WHEN MENU ITEM IS CREATED ====================
// ==================== REDUCE STOCK WHEN MENU ITEM IS CREATED (FIXED VERSION) ====================
async function reduceStockForMenuItem(menuItemName, quantity = 1) {
    console.log(`🍽️ Reducing stock for menu item: ${menuItemName} (x${quantity})`);
    
    // Find all ingredients needed for this menu item
    const ingredients = [];
    for (const [ingredient, dishes] of Object.entries(recipeMapping)) {
        if (dishes.includes(menuItemName)) {
            ingredients.push(ingredient);
        }
    }
    
    if (ingredients.length === 0) {
        console.log(`No ingredients found for ${menuItemName}`);
        showToast(`No ingredient mapping found for ${menuItemName}`, 'warning');
        return { success: false, message: 'No ingredients found' };
    }
    
    console.log(`📋 Required ingredients:`, ingredients);
    
    // Show loading
    showLoading(`Checking stock for ${menuItemName}...`);
    
    try {
        // STEP 1: Get FRESH data from database first to ensure accuracy
        console.log('📦 Fetching fresh inventory data from database...');
        const freshResponse = await fetch('/api/inventory', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        });
        
        if (!freshResponse.ok) {
            throw new Error('Failed to fetch current inventory');
        }
        
        const freshResult = await freshResponse.json();
        
        if (freshResult.success && freshResult.data) {
            // Update local array with FRESH database values
            allInventoryItems = freshResult.data.map(item => ({
                ...item,
                currentStock: parseFloat(item.currentStock) || 0,
                minStock: parseFloat(item.minStock) || 10,
                maxStock: parseFloat(item.maxStock) || 50,
                usageHistory: item.usageHistory || []
            }));
            console.log('✅ Fresh inventory data loaded from database');
        }
        
        // STEP 2: Check stock levels with fresh data
        const insufficientIngredients = [];
        const itemsToUpdate = [];
        
        for (const ingredientName of ingredients) {
            const item = allInventoryItems.find(i => 
                i.itemName.toLowerCase() === ingredientName.toLowerCase()
            );
            
            if (!item) {
                insufficientIngredients.push(`${ingredientName} (not in inventory)`);
                continue;
            }
            
            const currentStock = parseFloat(item.currentStock) || 0;
            const newStock = currentStock - quantity;
            
            // Check if we have enough stock
            if (currentStock < quantity) {
                insufficientIngredients.push(`${ingredientName} (only ${currentStock} ${item.unit || 'units'} available)`);
            }
            
            itemsToUpdate.push({
                item: item,
                itemId: item._id || item.id,
                ingredientName: ingredientName,
                currentStock: currentStock,
                newStock: newStock,
                unit: item.unit || 'units'
            });
        }
        
        // If there are insufficient ingredients, abort
        if (insufficientIngredients.length > 0) {
            hideLoading();
            const errorMsg = `⚠️ Insufficient stock: ${insufficientIngredients.join(', ')}`;
            console.error('❌', errorMsg);
            showToast(errorMsg, 'error');
            return { success: false, message: errorMsg };
        }
        
        // Update loading message
        showLoading(`Deducting stock for ${ingredients.length} ingredients...`);
        
        // STEP 3: Process each ingredient update
        const updates = [];
        const timestamp = new Date().toISOString();
        const usedBy = 'Admin'; // You can make this dynamic
        
        for (const itemData of itemsToUpdate) {
            const { item, itemId, ingredientName, currentStock, newStock, unit } = itemData;
            
            console.log(`🔄 Updating ${ingredientName}: ${currentStock}${unit} → ${newStock}${unit} (-${quantity}${unit})`);
            
            try {
                // Prepare usage history entry
                const usageEntry = {
                    quantity: quantity,
                    date: timestamp,
                    notes: `Used in ${menuItemName}`,
                    usedBy: usedBy,
                    oldStock: currentStock,
                    newStock: newStock
                };
                
                // Get current usage history
                const currentHistory = item.usageHistory || [];
                const updatedHistory = [...currentHistory, usageEntry];
                
                // Prepare update payload
                const payload = {
                    currentStock: newStock,
                    usageHistory: updatedHistory
                };
                
                // Send update to database
                const response = await fetch(`/api/inventory/${itemId}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success) {
                        // Update local item with the database response
                        const updatedItem = result.data;
                        item.currentStock = parseFloat(updatedItem.currentStock);
                        item.usageHistory = updatedItem.usageHistory || updatedHistory;
                        
                        console.log(`  ✅ ${ingredientName}: Successfully updated to ${item.currentStock}${unit}`);
                        
                        updates.push({ 
                            ingredient: ingredientName, 
                            success: true, 
                            oldStock: currentStock,
                            newStock: item.currentStock,
                            unit: unit
                        });
                    } else {
                        console.error(`  ❌ Failed to update ${ingredientName}:`, result.message);
                        updates.push({ 
                            ingredient: ingredientName, 
                            success: false, 
                            error: result.message 
                        });
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`  ❌ HTTP ${response.status} for ${ingredientName}:`, errorText);
                    updates.push({ 
                        ingredient: ingredientName, 
                        success: false, 
                        error: `HTTP ${response.status}` 
                    });
                }
            } catch (error) {
                console.error(`  ❌ Error updating ${ingredientName}:`, error);
                updates.push({ 
                    ingredient: ingredientName, 
                    success: false, 
                    error: error.message 
                });
            }
            
            // Small delay to prevent overwhelming the database
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        hideLoading();
        
        // STEP 4: Refresh data from database to ensure consistency
        try {
            console.log('🔄 Refreshing inventory from database...');
            const refreshResponse = await fetch('/api/inventory', {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            
            if (refreshResponse.ok) {
                const refreshResult = await refreshResponse.json();
                if (refreshResult.success && refreshResult.data) {
                    allInventoryItems = refreshResult.data.map(item => ({
                        ...item,
                        currentStock: parseFloat(item.currentStock) || 0,
                        minStock: parseFloat(item.minStock) || 10,
                        maxStock: parseFloat(item.maxStock) || 50,
                        usageHistory: item.usageHistory || []
                    }));
                    console.log('✅ Inventory refreshed from database');
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not refresh inventory:', error);
        }
        
        // STEP 5: Update UI
        renderInventoryGrid();
        renderDashboardGrid();
        updateDashboardStats();
        updateCategoryCounts();
        
        // STEP 6: Show results
        const successCount = updates.filter(u => u.success).length;
        const failedCount = updates.filter(u => !u.success).length;
        const allSuccessful = failedCount === 0;
        
        if (allSuccessful) {
            // Create detailed success message
            const details = updates.map(u => 
                `${u.ingredient}: ${u.oldStock}${u.unit} → ${u.newStock}${u.unit}`
            ).join('\n');
            
            showToast(
                `✅ ${menuItemName} created!\nStock reduced for ${successCount} ingredients:\n${details}`, 
                'success'
            );
            
            console.log('📊 Stock deduction completed successfully:', updates);
            
            return { 
                success: true, 
                message: `Successfully reduced stock for ${ingredients.length} ingredients`,
                updates 
            };
        } else {
            const failed = updates.filter(u => !u.success).map(u => u.ingredient).join(', ');
            const failureMsg = failedCount === updates.length 
                ? `❌ All updates failed: ${failed}`
                : `⚠️ Partial success. Failed: ${failed}`;
            
            showToast(failureMsg, failedCount === updates.length ? 'error' : 'warning');
            
            console.warn('⚠️ Stock deduction had issues:', updates);
            
            return { 
                success: false, 
                message: failureMsg,
                successCount,
                failedCount,
                updates 
            };
        }
        
    } catch (error) {
        hideLoading();
        console.error('❌ Error in reduceStockForMenuItem:', error);
        showToast(`Error: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// ==================== GET ALL AVAILABLE MENU ITEMS ====================
function getAvailableMenuItems() {
    // Get all unique menu items from recipeMapping
    const allMenuItems = new Set();
    for (const dishes of Object.values(recipeMapping)) {
        dishes.forEach(dish => allMenuItems.add(dish));
    }
    
    // Check each menu item
    const available = [];
    const unavailable = [];
    
    allMenuItems.forEach(menuItem => {
        const result = canMakeMenuItem(menuItem);
        if (result.canMake) {
            available.push(menuItem);
        } else {
            unavailable.push({ name: menuItem, reason: result.reason });
        }
    });
    
    return { available, unavailable };
}

function isLowStock(item) {
    if (!item) return false;
    const currentStock = parseFloat(item.currentStock) || 0;
    const minStock = parseFloat(item.minStock) || 10;
    return currentStock > 0 && currentStock <= minStock;
}

function isOutOfStock(item) {
    if (!item) return false;
    const currentStock = parseFloat(item.currentStock) || 0;
    return currentStock === 0;
}

// ==================== SAVE ITEM FUNCTION (WITH MONGODB) ====================

async function handleSaveItem() {
    const itemId = elements.itemId ? elements.itemId.value : '';
    const isEdit = itemId && itemId.trim() !== '';
    
    const itemData = {
        itemName: elements.itemName ? elements.itemName.value : '',
        itemType: elements.itemType ? elements.itemType.value : 'raw',
        category: elements.itemCategory ? elements.itemCategory.value : '',
        unit: elements.itemUnit ? elements.itemUnit.value : '',
        currentStock: elements.currentStock ? parseFloat(elements.currentStock.value) || 0 : 0,
        minStock: elements.minStock ? parseFloat(elements.minStock.value) || 10 : 10,
        maxStock: elements.maxStock ? parseFloat(elements.maxStock.value) || 50 : 50,
        description: elements.description ? elements.description.value : '',
        isActive: true
    };
    
    // Validation
    if (!itemData.itemName) {
        showToast('Please select an ingredient name', 'error');
        return;
    }
    
    if (!itemData.category) {
        showToast('Please select a category', 'error');
        return;
    }
    
    if (!itemData.unit) {
        showToast('Please select a unit', 'error');
        return;
    }
    
    // CHECK FOR DUPLICATE INGREDIENTS (when adding new)
    if (!isEdit) {
        const isDuplicate = allInventoryItems.some(item => 
            item.itemName.toLowerCase().trim() === itemData.itemName.toLowerCase().trim()
        );
        
        if (isDuplicate) {
            showToast(`❌ ERROR: "${itemData.itemName}" already exists in inventory!`, 'error');
            console.warn(`❌ Duplicate detected: ${itemData.itemName}`);
            return;
        }
    } else {
        // When editing, check if another ingredient with same name exists (excluding current one)
        const isDuplicate = allInventoryItems.some(item => {
            const sameNameCheck = item.itemName.toLowerCase().trim() === itemData.itemName.toLowerCase().trim();
            const differentItemCheck = item._id !== itemId && item.id !== itemId;
            return sameNameCheck && differentItemCheck;
        });
        
        if (isDuplicate) {
            showToast(`❌ ERROR: Another ingredient already has this name`, 'error');
            console.warn(`❌ Duplicate detected during edit: ${itemData.itemName}`);
            return;
        }
    }
    
    try {
        showLoading(isEdit ? 'Updating item...' : 'Adding item...');
        
        let apiUrl = '/api/inventory';
        let method = 'POST';
        
        if (isEdit) {
            apiUrl = `/api/inventory/${itemId}`;
            method = 'PUT';
        }
        
        // Save to MongoDB via API
        const response = await fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(itemData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            
            // Handle out-of-stock error specifically
            if (errorData.isOutOfStock) {
                console.error(`🚫 Out-of-stock error: ${errorData.error}`);
                showToast(`🚫 ${errorData.error}`, 'error');
                hideLoading();
                return;
            }
            
            // Handle duplicate error specifically
            if (response.status === 409 || errorData.duplicate) {
                console.error(`❌ Duplicate conflict: ${errorData.message}`);
                showToast(`❌ ${errorData.message}`, 'error');
                hideLoading();
                return;
            }
            
            throw new Error(errorData.message || 'Failed to save item');
        }
        
        const result = await response.json();
        
        if (result.success) {
            showToast(isEdit ? '✅ Item updated successfully!' : '✅ Item added successfully!', 'success');
            
            // Refresh inventory from MongoDB - ONLY source of truth
            await fetchInventoryItems();
            
            // Update UI with fresh database values
            renderInventoryGrid();
            renderDashboardGrid();
            updateDashboardStats();
            updateCategoryCounts();
            
            // Refresh dashboard stats to sync with backend
            await refreshDashboardInventoryCount();
            
            // Close modal
            closeModal();
        } else {
            throw new Error(result.message || 'Failed to save item');
        }
        
    } catch (error) {
        console.error('Error saving item:', error);
        showToast(`❌ Failed to save item: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

function updateFromItemName() {
    const itemName = elements.itemName?.value;
    if (!itemName) return;
    
    const category = getCategoryFromName(itemName);
    const unit = getUnitFromItem(itemName, category);
    
    if (elements.itemType) elements.itemType.value = 'raw';
    if (elements.itemCategory) {
        elements.itemCategory.value = category;
        updateUnitOptions(category, itemName);
    }
    if (elements.itemUnit) {
        elements.itemUnit.value = unit;
    }
    
    showRecipeInfo(itemName);
    
    // Check for duplicate ingredients and show notification
    checkAndShowDuplicateNotification();
}

// ==================== FETCH INVENTORY ITEMS FROM MONGODB ====================

async function fetchInventoryItems() {
    try {
        console.log('📦 Fetching inventory items from MongoDB...');
        
        const response = await fetch('/api/inventory', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            console.warn(`⚠️ API returned status ${response.status}`);
            return { success: false, data: [] };
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            // Update the global array with MongoDB data
            allInventoryItems = result.data;
            console.log('✅ Inventory items loaded from MongoDB:', allInventoryItems.length);
            return { success: true, data: allInventoryItems };
        } else if (result.data && Array.isArray(result.data)) {
            // Handle cases where API just returns array
            allInventoryItems = result.data;
            console.log('✅ Inventory items loaded from MongoDB:', allInventoryItems.length);
            return { success: true, data: allInventoryItems };
        } else {
            console.warn('⚠️ Unexpected API response format:', result);
            return { success: false, data: [] };
        }
        
    } catch (error) {
        console.error('❌ Error fetching inventory from MongoDB:', error);
        showToast(`Failed to load inventory: ${error.message}`, 'error');
        return { success: false, data: [] };
    }
}

// ==================== LOAD PERSISTED INVENTORY STOCK ====================
// DISABLED: No longer using localStorage - always fetch from database
function loadInventoryWithPersistedValues() {
    console.log('📦 Skipping localStorage load - fetching fresh data from database instead');
    return false; // Always return false to skip localStorage
}

// ==================== SAVE PERSISTED INVENTORY STOCK ====================
// DISABLED: No longer saving to localStorage - database is single source of truth
function saveInventoryStockValues() {
    console.log('💾 Skipping localStorage save - data already persisted to MongoDB database');
    // Do nothing - all data goes directly to MongoDB via API
}

// ==================== REFRESH DASHBOARD INVENTORY COUNT ====================

async function refreshDashboardInventoryCount() {
    try {
        // Only refresh if we're on the inventory page or if dashboard exists
        const totalInventoryElement = document.getElementById('totalInventory');
        if (!totalInventoryElement) {
            console.log('ℹ️ Dashboard not visible, skipping inventory count refresh');
            return;
        }
        
        console.log('🔄 Refreshing dashboard inventory count...');
        
        // Fetch fresh stats from backend
        const response = await fetch('/api/dashboard/stats', {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            console.warn('⚠️ Failed to fetch updated stats');
            return;
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            const newCount = result.data.totalInventoryItems || 0;
            const currentCount = parseInt(totalInventoryElement.textContent) || 0;
            
            console.log(`📊 Dashboard inventory count updated: ${currentCount} → ${newCount}`);
            
            // Update the dashboard display with animation
            if (newCount !== currentCount) {
                animateCountUpdate(totalInventoryElement, currentCount, newCount);
            }
        }
    } catch (error) {
        console.error('❌ Error refreshing dashboard inventory count:', error);
    }
}

// Animate count update
function animateCountUpdate(element, oldValue, newValue) {
    element.classList.add('count-updating');
    
    const step = (newValue - oldValue) / 10;
    let current = oldValue;
    let steps = 0;
    
    const interval = setInterval(() => {
        steps++;
        current += step;
        
        if (steps >= 10) {
            current = newValue;
            clearInterval(interval);
            element.classList.remove('count-updating');
        }
        
        element.textContent = Math.round(current);
    }, 50);
}

// ==================== CATEGORY COUNT UPDATES ====================

function updateCategoryCounts() {
    console.log('📊 Updating category counts...');
    
    if (!elements.categoryItems || elements.categoryItems.length === 0) {
        console.warn('⚠️ Category items not found');
        return;
    }
    
    elements.categoryItems.forEach(categoryItem => {
        const category = categoryItem.getAttribute('data-category');
        
        let count = 0;
        if (category === 'all') {
            count = allInventoryItems.length;
        } else if (category === 'in-stock') {
            count = getInStockCount();
        } else if (category === 'low-stock') {
            count = allInventoryItems.filter(item => isLowStock(item)).length;
        } else if (category === 'out-of-stock') {
            count = allInventoryItems.filter(item => isOutOfStock(item)).length;
        } else {
            count = allInventoryItems.filter(item => {
                const itemCategory = item.category || getCategoryFromName(item.itemName);
                return itemCategory === category;
            }).length;
        }
        
        const countElement = categoryItem.querySelector('.category-count');
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// ==================== SECTION NAVIGATION ====================

function showSection(section) {
    currentSection = section;
    
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(sec => {
        sec.classList.remove('active-section');
        sec.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active-section');
        targetSection.style.display = 'block';
    }
    
    // Update active nav
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Render appropriate grid
    if (section === 'dashboard') {
        renderDashboardGrid();
        updateDashboardStats();
    } else if (section === 'inventory') {
        // Fetch fresh data before rendering inventory
        fetchInventoryItems().then(() => {
            renderInventoryGrid();
            updateDashboardStats();
        });
    }
}

function filterByCategory(category) {
    currentCategory = category;
    
    // Update active category in UI
    if (elements.categoryItems) {
        elements.categoryItems.forEach(item => {
            if (item.getAttribute('data-category') === category) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Filter items based on category
    let filteredItems = [];
    
    if (category === 'all') {
        filteredItems = allInventoryItems;
    } else if (category === 'in-stock') {
        filteredItems = getInStockItems();
    } else if (category === 'low-stock') {
        filteredItems = allInventoryItems.filter(item => isLowStock(item));
    } else if (category === 'out-of-stock') {
        filteredItems = allInventoryItems.filter(item => isOutOfStock(item));
    } else {
        filteredItems = allInventoryItems.filter(item => {
            const itemCategory = item.category || getCategoryFromName(item.itemName);
            return itemCategory === category;
        });
    }
    
    // Update UI based on current section
    if (currentSection === 'inventory') {
        renderFilteredInventoryGrid(filteredItems);
    } else if (currentSection === 'dashboard') {
        renderFilteredDashboardGrid(filteredItems);
    }
}

// ==================== LOADING & NOTIFICATION FUNCTIONS ====================

function showLoading(message = 'Loading...') {
    hideLoading();
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column;
        justify-content: center; align-items: center; z-index: 9999;
        color: white; font-size: 18px;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.3);
        border-radius: 50%; border-top-color: white;
        animation: spin 1s ease-in-out infinite; margin-bottom: 20px;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = message;
    
    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            display: flex; flex-direction: column; gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        padding: 15px 25px; border-radius: 8px; color: white;
        margin-bottom: 10px; animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background-color: ${type === 'success' ? '#28a745' : 
                         type === 'error' ? '#dc3545' : 
                         type === 'warning' ? '#ffc107' : '#17a2b8'};
    `;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== EVENT LISTENER INITIALIZATION ====================

function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Button event listeners
    if (elements.addNewItem) {
        elements.addNewItem.addEventListener('click', openAddModal);
    }
    
    if (elements.saveItemBtn) {
        elements.saveItemBtn.addEventListener('click', handleSaveItem);
    }
    
    if (elements.cancelBtn) {
        elements.cancelBtn.addEventListener('click', closeModal);
    }
    
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeModal);
    }
    
    if (elements.refreshDashboard) {
        elements.refreshDashboard.addEventListener('click', async () => {
            console.log('🔄 Refreshing inventory data...');
            await fetchInventoryItems();
            updateDashboardStats();
            renderDashboardGrid();
            renderInventoryGrid();
            updateCategoryCounts();
            showToast('✅ Inventory refreshed', 'success');
        });
    }
    
    // Navigation
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                showSection(section);
            });
        });
    }
    
    // Form field changes
    if (elements.itemName) {
        elements.itemName.addEventListener('change', updateFromItemName);
    }
    
    if (elements.itemCategory) {
        elements.itemCategory.addEventListener('change', function() {
            const category = this.value;
            if (category) {
                filterIngredientsByCategory(category);
                const itemName = elements.itemName ? elements.itemName.value : null;
                updateUnitOptions(category, itemName);
            }
        });
    }
    
    // Category items click listeners - open modal and auto-fill
    if (elements.categoryItems && elements.categoryItems.length > 0) {
        elements.categoryItems.forEach(categoryItem => {
            categoryItem.addEventListener('click', (e) => {
                const category = categoryItem.getAttribute('data-category');
                
                if (category !== 'all' && 
                    category !== 'in-stock' && 
                    category !== 'low-stock' && 
                    category !== 'out-of-stock') {
                    // Open the modal and auto-fill
                    openAddModal();
                    setTimeout(() => {
                        autoFillItemFromCategory(category);
                    }, 100);
                } else {
                    // Just filter
                    filterByCategory(category);
                }
            });
        });
    }
    
    // Search input
    if (elements.searchInput) {
        let searchTimeout;
        elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                debounceSearch(e.target.value);
            }, 300);
        });
    }
    
    // Close modal when clicking outside
    if (elements.itemModal) {
        elements.itemModal.addEventListener('click', (e) => {
            if (e.target === elements.itemModal) {
                closeModal();
            }
        });
    }
    
    console.log('✅ Event listeners initialized');
}

// ==================== INITIALIZE THE SYSTEM ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inventory Management System initializing...');
    
    // Initialize DOM elements
    initializeElements();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update form options
    updateCategoryOptions();
    updateItemNameOptions();
    
    // Add CSS animations and styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        /* Inventory Card Styles */
        .inventory-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            border-left: 4px solid #28a745;
        }
        
        .inventory-card.out-of-stock {
            border-left-color: #dc3545;
        }
        
        .inventory-card.low-stock {
            border-left-color: #ffc107;
        }
        
        .inventory-card.in-stock {
            border-left-color: #28a745;
        }
        
        .inventory-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .card-header h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
        }
        
        .category-badge {
            font-size: 12px;
            color: #666;
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 12px;
        }
        
        .btn-icon {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        
        .btn-icon:hover {
            opacity: 1;
            background: #f0f0f0;
        }
        
        .card-body {
            margin-bottom: 12px;
        }
        
        .stock-details {
            margin-bottom: 12px;
        }
        
        .stock-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 14px;
        }
        
        .stock-row .label {
            color: #666;
            font-weight: 500;
        }
        
        .stock-row .value {
            font-weight: 600;
        }
        
        .status-display {
            font-size: 14px;
            font-weight: 600;
            margin: 10px 0;
            padding: 4px 8px;
            background: #f8f9fa;
            border-radius: 4px;
            display: inline-block;
        }
        
        .status-display.status-out {
            color: #dc3545;
        }
        
        .status-display.status-low {
            color: #ffc107;
        }
        
        .status-display.status-good {
            color: #28a745;
        }
        
        .description {
            font-size: 12px;
            color: #666;
            margin: 8px 0;
            padding: 6px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        
        .text-success { color: #28a745; }
        .text-danger { color: #dc3545; }
        .text-warning { color: #ffc107; }
        
        /* Dashboard Card Styles */
        .dashboard-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 4px solid #28a745;
        }
        
        .dashboard-card.out-of-stock {
            border-left-color: #dc3545;
        }
        
        .dashboard-card.low-stock {
            border-left-color: #ffc107;
        }
        
        .dashboard-card.in-stock {
            border-left-color: #28a745;
        }
        
        .card-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .badge-danger {
            background: #dc3545;
            color: white;
        }
        
        .badge-warning {
            background: #ffc107;
            color: #333;
        }
        
        .badge-success {
            background: #28a745;
            color: white;
        }
        
        .stock-info {
            margin: 10px 0;
        }
        
        .stock-bar {
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .stock-bar-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .stock-numbers {
            text-align: center;
            margin-top: 5px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .card-details {
            margin-top: 10px;
        }
        
        .detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
        }
        
        .detail .label {
            color: #666;
        }
        
        .detail .value {
            font-weight: 600;
        }
        
        .card-footer {
            margin-top: 12px;
            display: flex;
            justify-content: flex-end;
        }
        
        .btn-sm {
            padding: 4px 8px;
            font-size: 12px;
        }
        
        .btn-primary {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn-primary:hover {
            background: #0056b3;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            background: #f8f9fa;
            border-radius: 12px;
            grid-column: 1 / -1;
        }
        
        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        
        .empty-state h3 {
            margin: 0 0 8px 0;
            color: #333;
        }
        
        .empty-state p {
            margin: 0 0 16px 0;
            color: #666;
        }
        
        .mt-3 {
            margin-top: 16px;
        }
    `;
    document.head.appendChild(style);
    
    // Load initial data
    fetchInventoryItems().then(() => {
        console.log('📦 Inventory items loaded:', allInventoryItems.length);
        
        // Load persisted inventory stock values BEFORE rendering
        loadInventoryWithPersistedValues();
        
        // Update UI
        updateCategoryCounts();
        updateDashboardStats();
        
        // Show default section
        showSection('dashboard');
        renderDashboardGrid();
        renderInventoryGrid();
        
        console.log('✅ Inventory system initialized successfully');
    }).catch(error => {
        console.error('❌ Error during initialization:', error);
        showToast('Failed to load inventory', 'error');
    });
});

// ==================== EXPORT FUNCTIONS TO GLOBAL SCOPE ====================

window.updateDashboardStats = updateDashboardStats;
window.openEditModal = openEditModal;
window.filterByCategory = filterByCategory;
window.showSection = showSection;
window.debounceSearch = debounceSearch;
window.closeModal = closeModal;
window.handleSaveItem = handleSaveItem;
window.updateFromItemName = updateFromItemName;
window.openAddModal = openAddModal;
window.fetchInventoryItems = fetchInventoryItems;
window.renderInventoryGrid = renderInventoryGrid;
window.updateCategoryCounts = updateCategoryCounts;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.getInStockCount = getInStockCount;
window.getInStockItems = getInStockItems;
window.autoFillItemFromCategory = autoFillItemFromCategory;
window.canMakeMenuItem = canMakeMenuItem;
window.reduceStockForMenuItem = reduceStockForMenuItem;
window.getAvailableMenuItems = getAvailableMenuItems;

// ==================== AUTO-DETECT MENU ITEM CREATION & DEDUCT STOCK ====================
// This system silently monitors menu item creation and automatically deducts raw ingredients
// NO visible UI changes - works entirely in the background

(function initializeAutoStockDeduction() {
    console.log('🔄 Initializing automatic stock deduction monitoring...');
    
    // Track processed clicks to prevent duplicate deductions
    const processedClicks = new Set();
    const CLICK_DEBOUNCE_MS = 500;
    
    /**
     * Extract menu item name from various possible sources
     */
    function extractMenuItemName(button, clickTarget) {
        // 1. Try data attributes on the button itself
        if (button.dataset.itemName) return button.dataset.itemName;
        if (button.dataset.menuItem) return button.dataset.menuItem;
        if (button.dataset.productName) return button.dataset.productName;
        if (button.dataset.dishName) return button.dataset.dishName;
        
        // 2. Try aria-label or title
        if (button.getAttribute('aria-label')) return button.getAttribute('aria-label');
        if (button.title) return button.title;
        
        // 3. Try text content (clean up button text)
        const buttonText = button.textContent?.trim();
        if (buttonText && !['Add', 'Order', 'Create', 'Add to Order', 'Order Now', 'Add to Cart'].includes(buttonText)) {
            return buttonText;
        }
        
        // 4. Look for menu item name in parent container data attributes
        const container = button.closest('[data-item-name], [data-menu-item], [data-product-name], [data-product-id], .menu-item, .product-item, .order-item, .menu-card, .product-card');
        if (container) {
            if (container.dataset.itemName) return container.dataset.itemName;
            if (container.dataset.menuItem) return container.dataset.menuItem;
            if (container.dataset.productName) return container.dataset.productName;
            
            // Try to find h4, h3, or h2 with product name
            const nameElement = container.querySelector('h4, h3, h2, .product-name, .item-name, .menu-name, [data-name]');
            if (nameElement) return nameElement.textContent?.trim();
        }
        
        // 5. Look at siblings and nearby elements
        const heading = button.closest('div, section, article')?.querySelector('h1, h2, h3, h4, .title, .name');
        if (heading) return heading.textContent?.trim();
        
        console.warn('⚠️ Could not extract menu item name from button:', button);
        return null;
    }
    
    /**
     * Extract quantity from various sources
     */
    function extractQuantity(button) {
        // 1. Try data attribute
        if (button.dataset.quantity) {
            const qty = parseInt(button.dataset.quantity, 10);
            if (!isNaN(qty) && qty > 0) return qty;
        }
        
        // 2. Look for quantity input nearby
        const container = button.closest('.menu-item, .product-item, .order-item, .menu-card, .product-card, form, .card');
        if (container) {
            const quantityInput = container.querySelector('input[name*="quantity" i], input[data-qty], input.qty, [data-quantity]');
            if (quantityInput) {
                const qty = parseInt(quantityInput.value, 10);
                if (!isNaN(qty) && qty > 0) return qty;
            }
        }
        
        // 3. Look for quantity selector
        const qtySelector = button.closest('div')?.querySelector('select[name*="quantity" i], input[type="number"]');
        if (qtySelector) {
            const qty = parseInt(qtySelector.value, 10);
            if (!isNaN(qty) && qty > 0) return qty;
        }
        
        // Default to 1
        return 1;
    }
    
    /**
     * Process menu item creation and deduct stock
     */
    async function processMenuItemCreation(menuItemName, quantity) {
        if (!menuItemName || menuItemName.trim() === '') {
            console.warn('⚠️ Invalid menu item name');
            return false;
        }
        
        console.log(`📍 Processing menu item creation: "${menuItemName}" (qty: ${quantity})`);
        
        try {
            // Call the reduceStockForMenuItem function
            const result = await reduceStockForMenuItem(menuItemName, quantity);
            
            if (result.success) {
                console.log(`✅ Auto-deduction successful for: ${menuItemName}`);
                return true;
            } else {
                console.warn(`⚠️ Auto-deduction encountered issues: ${result.message}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ Error during auto-deduction: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Monitor all order/add buttons
     */
    function setupButtonMonitoring() {
        // Use event delegation for both existing and dynamically added buttons
        document.addEventListener('click', async function(event) {
            // Identify if this is an order/add button
            const button = event.target.closest(
                '.add-to-order, ' +
                '.create-order, ' +
                '.menu-item-add, ' +
                '.add-to-cart, ' +
                '.order-now, ' +
                '.btn-add, ' +
                '.btn-order, ' +
                'button[data-action="add-order"], ' +
                'button[data-action="order"], ' +
                'button[data-action="create"], ' +
                'button[onclick*="addOrder"], ' +
                'button[onclick*="order"], ' +
                'button[onclick*="createOrder"], ' +
                '.product-add-btn, ' +
                '.add-btn, ' +
                'button.add'
            );
            
            if (!button) return;
            
            // Create a unique ID for this click to prevent duplicates
            const clickId = `${button.offsetParent?.offsetTop || 0}-${button.offsetParent?.offsetLeft || 0}-${Date.now()}`;
            
            // Skip if we've already processed this click recently
            if (processedClicks.has(clickId)) return;
            
            // Mark this click as processed
            processedClicks.add(clickId);
            setTimeout(() => processedClicks.delete(clickId), CLICK_DEBOUNCE_MS);
            
            // Extract menu item info
            const menuItemName = extractMenuItemName(button, event.target);
            if (!menuItemName) {
                console.warn('⚠️ Could not determine menu item name for stock deduction');
                return;
            }
            
            const quantity = extractQuantity(button);
            
            // Process deduction silently in the background
            await processMenuItemCreation(menuItemName, quantity);
        }, true); // Use capture phase for better event handling
        
        console.log('✅ Button monitoring setup complete');
    }
    
    /**
     * Monitor global order/menu creation functions
     */
    function setupGlobalFunctionInterception() {
        const originalWindow = {};
        
        // Intercept common order function patterns
        const functionsToMonitor = [
            'addOrder',
            'createOrder',
            'addToCart',
            'addToOrder',
            'orderNow',
            'createMenuItem',
            'addMenuItem'
        ];
        
        functionsToMonitor.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                originalWindow[funcName] = window[funcName];
                
                window[funcName] = function(...args) {
                    console.log(`🔍 Intercepted: ${funcName}(${args})`);
                    
                    // Call original function
                    const result = originalWindow[funcName].apply(this, args);
                    
                    // Try to extract menu item name from arguments
                    if (args[0]) {
                        const itemName = typeof args[0] === 'string' ? args[0] : args[0].name || args[0].itemName || args[0];
                        const qty = args[1] || 1;
                        
                        if (typeof itemName === 'string') {
                            processMenuItemCreation(itemName, qty);
                        }
                    }
                    
                    return result;
                };
            }
        });
    }
    
    /**
     * Monitor form submissions for menu creation
     */
    function setupFormMonitoring() {
        document.addEventListener('submit', async function(event) {
            // Check if this is a menu/order form
            const form = event.target;
            const isMenuForm = form.id?.includes('menu') || 
                              form.id?.includes('order') ||
                              form.classList.contains('menu-form') ||
                              form.classList.contains('order-form') ||
                              form.classList.contains('product-form');
            
            if (!isMenuForm) return;
            
            // Extract form data
            const formData = new FormData(form);
            const itemName = formData.get('itemName') || formData.get('item-name') || 
                           formData.get('menuItem') || formData.get('productName') || 
                           formData.get('name');
            const quantity = parseInt(formData.get('quantity') || 1, 10);
            
            if (itemName && quantity > 0) {
                console.log(`📝 Form submission detected: ${itemName} (qty: ${quantity})`);
                // Don't prevent default - let the form submit normally
                // But queue the deduction to run after the form processes
                setTimeout(() => processMenuItemCreation(itemName, quantity), 100);
            }
        }, true);
        
        console.log('✅ Form monitoring setup complete');
    }
    
    /**
     * Monitor API calls for menu item creation
     */
    function setupAPIInterception() {
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            const [resource, config] = args;
            const url = typeof resource === 'string' ? resource : resource.url;
            
            // Check if this is a menu/product creation API call
            const isMenuAPI = url.includes('/api/menu') || 
                             url.includes('/api/product') ||
                             url.includes('/api/order') ||
                             url.includes('create');
            
            if (isMenuAPI && config?.method === 'POST') {
                console.log(`📡 Menu creation API detected: ${url}`);
                
                // Capture the request body to extract item name
                if (config.body) {
                    try {
                        const bodyData = typeof config.body === 'string' ? 
                            JSON.parse(config.body) : config.body;
                        
                        const itemName = bodyData.itemName || bodyData.name || bodyData.productName;
                        const quantity = bodyData.quantity || 1;
                        
                        if (itemName) {
                            // Call original fetch
                            const fetchPromise = originalFetch.apply(this, args);
                            
                            // After successful response, deduct stock
                            fetchPromise.then(response => {
                                if (response.ok) {
                                    console.log(`📱 API response OK, processing stock deduction`);
                                    processMenuItemCreation(itemName, quantity);
                                }
                            }).catch(err => {
                                console.error('API call failed:', err);
                            });
                            
                            return fetchPromise;
                        }
                    } catch (e) {
                        console.warn('Could not parse API body for stock deduction');
                    }
                }
            }
            
            // Call original fetch for all other requests
            return originalFetch.apply(this, args);
        };
        
        console.log('✅ API interception setup complete');
    }
    
    /**
     * Initialize all monitoring systems
     */
    function initialize() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('🚀 DOMContentLoaded - Starting auto-deduction setup');
                setupButtonMonitoring();
                setupGlobalFunctionInterception();
                setupFormMonitoring();
                setupAPIInterception();
            });
        } else {
            // DOM already loaded
            setupButtonMonitoring();
            setupGlobalFunctionInterception();
            setupFormMonitoring();
            setupAPIInterception();
        }
        
        console.log('🎯 Automatic stock deduction system initialized');
    }
    
    // Start initialization
    initialize();
})();

// ==================== AUTO-DEDUCT FOR ALL MENU ITEMS ====================
// Add this at the very end of your file

(function() {
    console.log('🔍 Setting up auto-deduction for ALL menu items...');
    
    // Map of menu item categories to their ingredients (for verification)
    const menuItemIngredients = {
        'Cafe Americano': ['Coffee beans', 'Hot water', 'Sugar', 'Paper cups', 'Straws'],
        'Cafe Latte': ['Coffee beans', 'Milk', 'Sugar', 'Vanilla syrup', 'Paper cups', 'Straws'],
        'Caramel Macchiato': ['Coffee beans', 'Milk', 'Sugar', 'Caramel syrup', 'Paper cups', 'Straws'],
        'Fried Chicken': ['Chicken', 'Flour', 'Cooking oil', 'Salt', 'Cornstarch', 'Breadcrumbs', 'Food containers'],
        'Korean Spicy Bulgogi (Pork)': ['Pork', 'Garlic', 'Onion', 'Chili', 'Gochujang', 'Sesame oil', 'Soy sauce', 'Cooking oil', 'Salt', 'Black pepper', 'Rice', 'Food containers', 'Napkins'],
        'Korean Salt and Pepper (Pork)': ['Pork', 'Garlic', 'Onion', 'Chili', 'Gochujang', 'Sesame oil', 'Soy sauce', 'Cooking oil', 'Salt', 'Black pepper', 'Peppercorn', 'Rice', 'Food containers', 'Napkins'],
        'Crispy Pork Lechon Kawali': ['Pork', 'Pork belly', 'Garlic', 'Onion', 'Cooking oil', 'Salt', 'Cornstarch', 'Rice', 'Food containers', 'Napkins'],
        'Pork Shanghai': ['Pork', 'Garlic', 'Cooking oil', 'Cornstarch', 'Breadcrumbs', 'Flour', 'Rice', 'Food containers', 'Napkins'],
        'Sinigang (Pork)': ['Pork', 'Garlic', 'Onion', 'Chili', 'Calamansi', 'Tomato', 'Tamarind mix', 'Shrimp paste', 'Salt', 'Black pepper', 'Bay leaves', 'Water', 'Rice', 'Food containers', 'Napkins'],
        'Sizzling Pork Sisig': ['Pork', 'Garlic', 'Onion', 'Chili', 'Calamansi', 'Soy sauce', 'Oyster sauce', 'Cooking oil', 'Salt', 'Black pepper', 'Egg', 'Mayonnaise', 'Rice', 'Food containers', 'Napkins'],
        'Sizzling Liempo': ['Pork', 'Pork belly', 'Garlic', 'Cooking oil', 'Salt', 'Rice', 'Food containers', 'Napkins'],
        'Sizzling Porkchop': ['Pork', 'Pork chop', 'Garlic', 'Cooking oil', 'Salt', 'Rice', 'Food containers', 'Napkins'],
        'Buttered Honey Chicken': ['Chicken', 'Butter', 'Honey', 'Rice', 'Food containers', 'Napkins'],
        'Buttered Spicy Chicken': ['Chicken', 'Butter', 'Rice', 'Food containers', 'Napkins'],
        'Chicken Adobo': ['Chicken', 'Garlic', 'Onion', 'Tomato', 'Soy sauce', 'Salt', 'Bay leaves', 'Rice','Black Pepper','Plates', 'Napkins'],
        'Sizzling Fried Chicken': ['Chicken', 'Garlic', 'Cooking oil', 'Salt', 'Rice', 'Food containers', 'Napkins'],
        'Clubhouse Sandwich': ['Chicken', 'Bread', 'Mayonnaise', 'Gravy', 'Napkins'],
        'Budget Fried Chicken': ['Fried chicken', 'Cooking oil', 'Salt', 'Breadcrumbs', 'Flour', 'Rice', 'Food containers', 'Napkins'],
        'Fish and Fries': ['Fried chicken', 'Cream dory', 'Cooking oil', 'Salt', 'Flour', 'French fries', 'Food containers', 'Napkins'],
        'Cream Dory Fish Fillet': ['Cream dory', 'Cooking oil', 'Salt', 'Breadcrumbs', 'Flour', 'Rice', 'Food containers', 'Napkins'],
        'Buttered Shrimp': ['Shrimp', 'Garlic', 'Calamansi', 'Butter', 'Salt', 'Black pepper', 'Rice', 'Food containers', 'Napkins'],
        'Special Bulalo': ['Beef shank', 'Shrimp', 'Garlic', 'Onion', 'Corn', 'Potato', 'Vegetables', 'Bay leaves', 'Salt', 'Water', 'Chicken broth', 'Rice', 'Food containers', 'Napkins'],
        'Paknet (Pakbet w/ Bagnet)': ['Bagnet', 'Garlic', 'Onion', 'Tomato', 'Cucumber', 'Corn', 'Potato', 'Vegetables', 'Salt', 'Black pepper', 'Rice', 'Food containers', 'Napkins'],
        'Tinapa Rice': ['Tinapa', 'Rice', 'Food containers', 'Napkins'],
        'Tuyo Pesto': ['Tuyo', 'Shrimp paste', 'Rice', 'Food containers', 'Napkins'],
        'Pancit Bihon': [' noodles', 'Garlic', 'Onion', 'Carrot', 'Soy sauce', 'Oyster sauce', 'Food containers'],
        'Pancit Canton + Bihon (Mixed)': ['Pancit canton', 'noodles', 'Garlic', 'Onion', 'Carrot', 'Soy sauce', 'Oyster sauce', 'Food containers'],
        'Spaghetti (Filipino Style)': ['Spaghetti pasta', 'Garlic', 'Onion', 'Tomato', 'Soy sauce', 'Sweet tomato sauce', 'Food containers'],
        'Fried Rice': ['Rice', 'Garlic', 'Onion', 'Sesame oil', 'Soy sauce', 'Cooking oil', 'Salt', 'Sugar', 'Egg', 'Water', 'Food containers'],
        'Plain Rice': ['Rice', 'Salt', 'Water', 'Food containers'],
        'Cucumber Lemonade': ['Lemon', 'Cucumber', 'Calamansi', 'Honey', 'Sugar', 'Lemon juice', 'Paper cups', 'Straws'],
        'Blue Lemonade': ['Lemon', 'Calamansi', 'Honey', 'Sugar', 'Lemon juice', 'Blue syrup', 'Paper cups', 'Straws'],
        'Red Tea': ['Tea', 'Black tea', 'Honey', 'Sugar', 'Hot water', 'Paper cups', 'Straws'],
        'Milk Tea': ['Milk', 'Tea', 'Sugar', 'Tapioca pearls', 'Paper cups', 'Straws'],
        'Matcha Green Tea': ['Matcha powder', 'Tea', 'Sugar', 'Tapioca pearls', 'Paper cups', 'Straws'],
        'Cookies & Cream': ['Cream', 'Milk', 'Sugar', 'Tapioca pearls', 'Cookie crumbs', 'Paper cups', 'Straws'],
        'Strawberry & Cream': ['Cream', 'Milk', 'Sugar', 'Strawberry syrup', 'Tapioca pearls', 'Paper cups', 'Straws'],
        'Mango Cheesecake': ['Cream', 'Milk', 'Cream cheese flavor', 'Mango flavor', 'Sugar', 'Tapioca pearls', 'Paper cups', 'Straws'],
        'Cafe Americano': ['Coffee beans', 'Espresso', 'Hot water', 'Sugar', 'Paper cups'],
        'Cafe Latte': ['Coffee beans', 'Espresso', 'Milk', 'Steamed milk', 'Sugar', 'Vanilla syrup', 'Paper cups'],
        'Caramel Macchiato': ['Coffee beans', 'Espresso', 'Milk', 'Steamed milk', 'Sugar', 'Caramel syrup', 'Paper cups'],
        'Soda': ['Carbonated soft drink', 'Paper cups', 'Straws'],
        'Cheesy Nachos': ['Nacho chips', 'Cheese', 'Cheese sauce', 'Cooking oil', 'Onion', 'Food containers', 'Napkins'],
        'Nachos Supreme': ['Nacho chips', 'Cheese', 'Cheese sauce', 'Cooking oil', 'Onion', 'Food containers', 'Napkins'],
        'French Fries': ['French fries', 'Cooking oil', 'Salt', 'Flour', 'Food containers', 'Napkins'],
        'Cheesy Dynamite Lumpia': ['Lumpiang wrapper', 'Cheese', 'Cheese sauce', 'Cooking oil', 'Cornstarch', 'Food containers', 'Napkins'],
        'Lumpiang Shanghai': ['Lumpiang wrapper', 'Pork', 'Cooking oil', 'Cornstarch', 'Breadcrumbs', 'Flour', 'Food containers', 'Napkins']
    };
    
    // Listen for any button clicks that might create menu items
    document.addEventListener('click', async function(e) {
        // Find the clicked button or its parent
        const target = e.target.closest('button, .btn, [role="button"], .add-to-order, .create-order, .menu-item-add, .add-to-cart, .order-now');
        
        if (!target) return;
        
        // Look for menu item name in various places
        let menuItemName = null;
        
        // Check data attributes
        if (target.dataset.menuItem) {
            menuItemName = target.dataset.menuItem;
        } else if (target.dataset.itemName) {
            menuItemName = target.dataset.itemName;
        } else if (target.dataset.name) {
            menuItemName = target.dataset.name;
        }
        
        // Look in parent elements
        if (!menuItemName) {
            const menuItem = target.closest('.menu-item, .product-item, .order-item, [class*="menu"], [class*="product"]');
            if (menuItem) {
                const nameElement = menuItem.querySelector('.item-name, .product-name, .name, h3, h4, .title, .menu-item-name');
                if (nameElement) {
                    menuItemName = nameElement.textContent.trim();
                }
            }
        }
        
        // Check button text
        if (!menuItemName) {
            const buttonText = target.textContent.trim();
            // Check if this button text matches any menu item
            for (const item of Object.keys(menuItemIngredients)) {
                if (buttonText.includes(item) || item.includes(buttonText)) {
                    menuItemName = item;
                    break;
                }
            }
        }
        
        // If we found a menu item name, trigger deduction
        if (menuItemName && menuItemIngredients[menuItemName]) {
            console.log(`🍽️ Menu item detected: ${menuItemName}`);
            
            // Get quantity (default 1)
            let quantity = 1;
            const qtyInput = target.closest('.menu-item, .product-item')?.querySelector('input[type="number"], .quantity-input');
            if (qtyInput) {
                quantity = parseInt(qtyInput.value) || 1;
            }
            
            // Prevent multiple triggers
            if (target.hasAttribute('data-deducting')) return;
            target.setAttribute('data-deducting', 'true');
            
            // Call the reduce stock function
            await window.reduceStockForMenuItem(menuItemName, quantity);
            
            // Remove the attribute after a delay
            setTimeout(() => {
                target.removeAttribute('data-deducting');
            }, 2000);
        }
    });
    
    console.log('✅ Auto-deduction ready - Coffee beans will decrease when coffee drinks are ordered');
})();