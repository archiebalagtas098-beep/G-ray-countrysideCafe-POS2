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
    'Pork Belly': 'meat',
    'Pork Chop': 'meat',
    'Pork Hocks': 'meat',
    'Oxtail': 'meat',
    'Tripe': 'meat',
    'Beef': 'meat',
    'Bacon': 'meat',
    'Ground Pork': 'meat',
    'Chicken': 'meat',
    'Chicken Wings': 'meat',
    'Shrimp': 'meat',
    'Fish Fillet': 'meat',
    'Cream Dory': 'meat',
    'Beef Shank': 'meat',
    'Bagnet': 'meat',
    'Ham': 'meat',
    'Hotdog': 'meat',
    'Ground Meat': 'meat',
 
    
    // ==================== SEAFOOD ====================
    
    'Tuyo': 'seafood',
    'Tinapa': 'seafood',
    'Fish Fillet': 'seafood',
    
    
    // ==================== FRESH PRODUCE ====================
    'Garlic': 'produce',
    'Onion': 'produce',
    'Carrot': 'produce',
    'Cabbage': 'produce',
    'Tomato': 'produce',
    'Lettuce': 'produce',
    'Cucumber': 'produce',
    'Lemon': 'produce',
    'Bell Pepper': 'produce',
    'Calamansi': 'produce',
    'Chili': 'produce',
    'Siling Green': 'produce',
    'Radish': 'produce',
    'Kangkong': 'produce',
    'Eggplant': 'produce',
    'Squash': 'produce',
    'Okra': 'produce',
    'Ampalaya': 'produce',
    'Corn': 'produce',
    'Potato': 'produce',
    'Bread': 'produce',
    'String Beans': 'produce',
    'Banana Blossom': 'produce',
    'Pechay': 'produce',
    'Banana Flower Bud': 'produce',
    'Pineapple': 'produce',
    
    // ==================== DAIRY & EGGS ====================
    'Butter': 'dairy',
    'Egg': 'dairy',
    'Milk': 'dairy',
    'Cheese': 'dairy',
    'Cream': 'dairy',
    'Mayonnaise': 'dairy',
    'Ice Cream': 'dairy',
    'Whipped Cream': 'dairy',
    
    // ==================== PANTRY STAPLES ====================
    'Soy Sauce': 'dry',
    'Vinegar': 'dry',
    'Salt': 'dry',
    'Sugar': 'dry',
    'Black Pepper': 'dry',
    'Cooking Oil': 'dry',
    'Sesame Oil': 'dry',
    'Olive Oil': 'dry',
    'Flour': 'dry',
    'Cornstarch': 'dry',
    'Breadcrumbs': 'dry',
    'Gochujang': 'dry',
    'Oyster Sauce': 'dry',
    'Shrimp Paste': 'dry',
    'Bagoong': 'dry',
    'Tamarind Mix': 'dry',
    'Peppercorn': 'dry',
    'Honey': 'dry',
    'Paprika': 'dry',
    'Bay Leaves': 'dry',
    'Annatto oil': 'dry',
    'Herbs': 'dry',
    'Vegetables': 'dry',
    'Sweet Tomato Sauce': 'dry',
    'Tomato Sauce': 'dry',
    'Pasta Sauce': 'dry',
    'Gravy': 'dry',
    'Cheese Sauce': 'dry',
    'Water': 'dry',
    'Ice': 'dry',
    'Pine Nuts': 'dry',
    'Basil Pesto': 'dry',
    'Buffalo Sauce': 'dry',
    'Peanut Butter': 'dry',
    'Rice Flour': 'dry',
    'Ground Peanuts': 'dry',
    
    // ==================== NOODLES & PASTA ====================
    'Pancit Canton Noodles': 'dry',
    'Spaghetti Pasta': 'dry',
    'Bihon Noodles': 'dry',
    
    // ==================== RICE & GRAINS ====================
    'Rice': 'dry',
    'Toasted Ground Rice': 'dry',
    'Fried Rice': 'dry',
    
    // ==================== BEVERAGES ====================
    'Lemon Juice': 'beverage',
    'Blue Syrup': 'beverage',
    'Tea': 'beverage',
    'Black Tea': 'beverage',
    'Red Tea': 'beverage',
    'Peppermint Tea': 'beverage',
    'Espresso': 'beverage',
    'Hot Water': 'beverage',
    'Steamed Milk': 'beverage',
    'Carbonated Soft Drink': 'beverage',
    'Carbonated Water': 'beverage',
    'Beef Broth': 'beverage',
    'Milk Tea Base': 'beverage',
    
    // ==================== COFFEE & TEA INGREDIENTS ====================
    'Coffee Beans': 'dry',
    'Matcha Powder': 'dry',
    'Matcha Green Tea Powder': 'dry',
    'Caramel Syrup': 'dry',
    'Caramel Sauce': 'dry',
    'Vanilla Syrup': 'dry',
    'Strawberry Syrup': 'dry',
    'Mango Syrup': 'dry',
    'Mango Flavor': 'dry',
    'Mango Puree': 'dry',
    'Cream Cheese Flavor': 'dry',
    'White Chocolate Syrup': 'dry',
    'Dark Chocolate Syrup': 'dry',
    'Chocolate Syrup': 'dry',
    'Chocolate Sauce': 'dry',
    'Chocolate Mousse': 'dry',
    'Tapioca Pearls': 'dry',
    'Cookie Crumbs': 'dry',
    'Sweetener': 'dry',
    'Okinawa Syrup': 'dry',
    'Wintermelon Syrup': 'dry',
    'Marshmallows': 'dry',
    'Nuts': 'dry',
    'Graham Crumbs': 'dry',
    'Coke Syrup': 'beverage',
    'Coke Zero Syrup': 'beverage',
    'Sprite Syrup': 'beverage',
    'Royal Syrup': 'beverage',
    
    // ==================== SNACKS & SIDES ====================
    'Nacho Chips': 'dry',
    'Tortilla Chips': 'dry',
    'Lumpiang Wrapper': 'dry',
    'French Fries': 'dry',
    
    // ==================== PACKAGING ====================
    'Plastic Containers (Small)': 'packaging',
    'Plastic Containers (Medium)': 'packaging',
    'Plastic Containers (Large)': 'packaging',
    'Plastic Cups (12oz)': 'packaging',
    'Plastic Cups (16oz)': 'packaging',
    'Plastic Cups (20oz)': 'packaging',
    'Collins Glass': 'packaging',
    'Plates (Small)': 'packaging',
    'Plates (Medium)': 'packaging',
    'Plates (Large)': 'packaging',
    'Straws (Regular)': 'packaging',
    'Straws (Boba)': 'packaging',
    'Straws': 'packaging',
    'Napkins': 'packaging',
    'Plastic Utensils': 'packaging',
    'Plastic Utensils Set': 'packaging',
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
        'Sizzling Porkchop',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti',
        'Lumpiang Shanghai'
    ],
    'Pork Belly': [
        'Crispy Pork Lechon Kawali',
        'Sizzling Liempo'
    ],
    'Pork Chop': [
        'Sizzling Porkchop'
    ],
    'Ground Pork': [
        'Pork Shanghai',
        'Lumpiang Shanghai',
        'Spaghetti'
    ],
    'Chicken': [
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Fried Chicken',
        'Sizzling Fried Chicken',
        'Budget Fried Chicken',
        'Clubhouse Sandwich',
        'Chicken Buffalo Wings',
        'Pancit Bihon (S)',
        'Pancit Bihon (L)',
        'Pancit Bihon (M)'

    ],
    'Chicken Wings': [
        'Chicken Buffalo Wings'
    ],
    'Cream Dory': [
        'Cream Dory Fish Fillet',
        'Fish and Fries'
    ],
    'Fish Fillet': [
        'Fish and Fries',
        'Cream Dory Fish Fillet'
    ],
    'Shrimp': [
        'Sinigang (Shrimp)',
        'Buttered Shrimp'
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
    'Beef Shank': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'
    ],
    'Oxtail': [
        'Kare-Kare'
    ],
    'Tripe': [
        'Kare-Kare'
    ],
    'Bacon': [
        'Creamy Carbonara'
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
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti',
        'Creamy Carbonara',
        'Creamy Pesto',
        'Tuyo Pesto',
        'Kare-Kare',
        'Chicken Buffalo Wings',
        'Fried Rice',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Cheesy Nachos',
        'Nachos Supreme',
        'French Fries',
        'Clubhouse Sandwich',
        'Fish and Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai'
    ],
    'Onion': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Pork Shanghai',
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti',
        'Creamy Carbonara',
        'Creamy Pesto',
        'Tuyo Pesto',
        'Kare-Kare',
        'Chicken Buffalo Wings',
        'Fried Rice',
        'Tinapa Rice',
        'Cheesy Nachos',
        'Nachos Supreme',
        'Clubhouse Sandwich',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai'
    ],
    'Chili': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Sizzling Pork Sisig',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Tuyo Pesto',
        'Chicken Buffalo Wings'
    ],
    'Chili flakes': [
        'Buttered Spicy Chicken',
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)'
    ],
    'Calamansi': [
        'Sizzling Pork Sisig',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Buttered Shrimp',
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Calamansi Juice'
    ],
    'Lemon': [
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Hot Ceylon Tea Lemon',
        'Cream Dory Fish Fillet'
    ],
    'Lemon juice': [
        'Cucumber Lemonade',
        'Blue Lemonade'
    ],
    'Tomato': [
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Spaghetti',
        'Nachos Supreme',
        'Clubhouse Sandwich'
    ],
    'Tomato sauce': [
        'Spaghetti'
    ],
    'Cucumber': [
        'Cucumber Lemonade',
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Corn': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Potato': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Paknet (Pakbet w/ Bagnet)',
        'French Fries'
    ],
    'Carrot': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Paknet (Pakbet w/ Bagnet)',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Pork Shanghai',
        'Lumpiang Shanghai'
    ],
    'Carrots': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Paknet (Pakbet w/ Bagnet)',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Cabbage': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Kangkong': [
        'Sinigang (Pork)',
        'Sinigang (Shrimp)'
    ],
    'Radish': [
        'Sinigang (Pork)'
    ],
    'Eggplant': [
        'Paknet (Pakbet w/ Bagnet)',
        'Kare-Kare'
    ],
    'Squash': [
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'Okra': [
        'Paknet (Pakbet w/ Bagnet)',
        'Kare-Kare'
    ],
    'Ampalaya': [
        'Paknet (Pakbet w/ Bagnet)'
    ],
    'String beans': [
        'Kare-Kare'
    ],
    'Banana blossom': [
        'Kare-Kare'
    ],
    'Siling Green': [
        'Cheesy Dynamite Lumpia'
    ],
    'Lettuce': [
        'Clubhouse Sandwich'
    ],
    'Pine nuts': [
        'Creamy Pesto'
    ],
    
    // ================ DAIRY & EGGS ================
    'Egg': [
        'Sizzling Pork Sisig',
        'Pork Shanghai',
        'Creamy Carbonara',
        'Fried Rice',
        'Tinapa Rice',
        'Clubhouse Sandwich',
        'Lumpiang Shanghai'
    ],
    'Butter': [
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Buttered Shrimp',
        'Cream Dory Fish Fillet',
        'Creamy Carbonara',
        'Chicken Buffalo Wings'
    ],
    'Mayonnaise': [
        'Sizzling Pork Sisig',
        'Clubhouse Sandwich'
    ],
    'Cream': [
        'Cream Dory Fish Fillet',
        'Creamy Carbonara',
        'Creamy Pesto',
        'Cookies & Cream Frappe',
        'Strawberry Cream Frappe',
        'Mango Cheesecake Frappe'
    ],
    'Cream cheese flavor': [
        'Mango Cheesecake Frappe'
    ],
    'Milk': [
        'Cafe Latte',
        'Caramel Macchiato',
        'Milk Tea',
        'Matcha Green Tea',
        'Cookies & Cream Frappe',
        'Strawberry Cream Frappe',
        'Mango Cheesecake Frappe',
        'Iced Coffee Drinks',
        'Steamed milk'
    ],
    'Cheese': [
        'Cheesy Nachos',
        'Nachos Supreme',
        'Cheesy Dynamite Lumpia',
        'Spaghetti',
        'Creamy Carbonara',
        'Creamy Pesto'
    ],
    'Cheese sauce': [
        'Cheesy Nachos',
        'Nachos Supreme',
        'Cheesy Dynamite Lumpia'
    ],
    'Ice cream': [
        'Matcha Green Tea Frappe',
        'Salted Caramel Frappe',
        'Strawberry Cheesecake Frappe',
        'Mango Cheesecake Frappe',
        'Strawberry Cream Frappe',
        'Cookies & Cream Frappe',
        'Rocky Road Frappe',
        'Choco Fudge Frappe',
        'Choco Mousse Frappe',
        'Coffee Crumble Frappe',
        'Vanilla Cream Frappe'
    ],
    'Whipped cream': [
        'Matcha Green Tea Frappe',
        'Salted Caramel Frappe',
        'Strawberry Cheesecake Frappe',
        'Mango Cheesecake Frappe',
        'Strawberry Cream Frappe',
        'Cookies & Cream Frappe',
        'Rocky Road Frappe',
        'Choco Fudge Frappe',
        'Choco Mousse Frappe',
        'Coffee Crumble Frappe',
        'Vanilla Cream Frappe'
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
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti',
        'Fried Rice'
    ],
    'Oyster sauce': [
        'Sizzling Pork Sisig',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Vinegar': [
        'Chicken Adobo'
    ],
    'Shrimp paste': [
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Kare-Kare'
    ],
    'Bagoong': [
        'Kare-Kare'
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
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Fish and Fries',
        'French Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai',
        'Fried Rice',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Cheesy Nachos',
        'Nachos Supreme',
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)',
        'Spaghetti',
        'Kare-Kare',
        'Chicken Buffalo Wings'
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
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Fish and Fries',
        'French Fries',
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Creamy Pesto',
        'Fried Rice',
        'Plain Rice',
        'Tinapa Rice',
        'Tuyo Pesto'
    ],
    'Black pepper': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Fried Chicken',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Fish and Fries',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Creamy Carbonara',
        'Chicken Buffalo Wings'
    ],
    'Peppercorn': [
        'Korean Salt and Pepper (Pork)',
        'Crispy Pork Lechon Kawali',
        'Chicken Adobo',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'
    ],
    'Cornstarch': [
        'Crispy Pork Lechon Kawali',
        'Pork Shanghai',
        'Lumpiang Shanghai',
        'Cheesy Dynamite Lumpia',
        'Chicken Buffalo Wings'
    ],
    'Bay leaves': [
        'Chicken Adobo',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'
    ],
    'Honey': [
        'Buttered Honey Chicken',
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea'
    ],
    'Sugar': [
        'Korean Spicy Bulgogi (Pork)',
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea',
        'Calamansi Juice',
        'Cafe Americano',
        'Cafe Latte',
        'Caramel Macchiato',
        'Milk Tea',
        'Matcha Green Tea',
        'Cookies & Cream Frappe',
        'Strawberry Cream Frappe',
        'Mango Cheesecake Frappe',
        'Fried Rice',
        'Spaghetti',
        'Buttered Shrimp'
    ],
    'Breadcrumbs': [
        'Pork Shanghai',
        'Lumpiang Shanghai',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet',
        'Fish and Fries'
    ],
    'Flour': [
        'Pork Shanghai',
        'Lumpiang Shanghai',
        'Fried Chicken',
        'Budget Fried Chicken',
        'Cream Dory Fish Fillet',
        'Fish and Fries',
        'French Fries',
        'Chicken Buffalo Wings'
    ],
    'Gravy': [
        'Clubhouse Sandwich',
        'Sizzling Fried Chicken'
    ],
    'Sweet tomato sauce': [
        'Spaghetti'
    ],
    'Basil pesto': [
        'Creamy Pesto',
        'Tuyo Pesto'
    ],
    'Herbs': [
        'Tuyo Pesto'
    ],
    'Water': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Sinigang (Pork)',
        'Sinigang (Shrimp)',
        'Fried Rice',
        'Plain Rice',
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea',
        'Calamansi Juice'
    ],
    'Beef broth': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'
    ],
    'Chicken broth': [
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Graham crumbs': [
        'Strawberry Cheesecake Frappe',
        'Mango Cheesecake Frappe'
    ],
    'Marshmallows': [
        'Rocky Road Frappe'
    ],
    'Nuts': [
        'Rocky Road Frappe'
    ],
    'Chocolate sauce': [
        'Choco Fudge Frappe'
    ],
    'Chocolate mousse': [
        'Choco Mousse Frappe'
    ],
    'Hotdog': [
        'Spaghetti'
    ],
    'Ham': [
        'Clubhouse Sandwich'
    ],
    'Buffalo sauce': [
        'Chicken Buffalo Wings'
    ],
    'Peanut butter': [
        'Kare-Kare'
    ],
    'Rice flour': [
        'Kare-Kare'
    ],
    'Olive oil': [
        'Creamy Pesto',
        'Tuyo Pesto'
    ],
    
    // ================ NOODLES, PASTA & RICE ================
    'Rice noodles': [
        'Pancit Bihon'
    ],
    'Bihon noodles': [
        'Pancit Bihon',
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Pancit Canton noodles': [
        'Pancit Canton + Bihon (Mixed)'
    ],
    'Spaghetti pasta': [
        'Spaghetti',
        'Creamy Carbonara',
        'Creamy Pesto',
        'Tuyo Pesto'
    ],
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
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Kare-Kare'
    ],
    
    // ================ BEVERAGE BASES ================
    'Cucumber': [
        'Cucumber Lemonade'
    ],
    'Lemon': [
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Hot Ceylon Tea Lemon'
    ],
    'Blue syrup': [
        'Blue Lemonade'
    ],
    'Black tea': [
        'Red Tea',
        'Milk Tea',
        'Hot Ceylon Tea Black',
        'Hot Ceylon Tea Lemon'
    ],
    'Red tea': [
        'Red Tea'
    ],
    'Peppermint tea': [
        'Hot Ceylon Tea Peppermint'
    ],
    'Coffee beans': [
        'Espresso Hot',
        'Café Americano Hot',
        'Cappuccino Hot',
        'Café Latte Hot',
        'Mocha Latte Hot',
        'Vanilla Latte Hot',
        'Caramel Macchiato Hot',
        'Green Tea Latte Hot',
        'Iced Café Latte',
        'Iced Mocha Latte',
        'Iced Vanilla Latte',
        'Iced Caramel Macchiato',
        'Iced White Chocolate Latte',
        'Iced Dark Chocolate',
        'Coffee Crumble Frappe'
    ],
    'Espresso': [
        'Café Americano Hot',
        'Cappuccino Hot',
        'Café Latte Hot',
        'Mocha Latte Hot',
        'Vanilla Latte Hot',
        'Caramel Macchiato Hot',
        'Iced Café Latte',
        'Iced Mocha Latte',
        'Iced Vanilla Latte',
        'Iced Caramel Macchiato'
    ],
    'Matcha powder': [
        'Green Tea Latte Hot',
        'Green Tea Matcha Hot',
        'Matcha Green Tea Milk Tea',
        'Matcha Green Tea Frappe',
        'Milk Tea Green Tea HC',
        'Milk Tea Green Tea MC',
        'Matcha Green Tea Milk Tea HC',
        'Matcha Green Tea Milk Tea MC'
    ],
    'White chocolate syrup': [
        'White Chocolate Hot',
        'Iced White Chocolate Latte'
    ],
    'Dark chocolate syrup': [
        'Iced Dark Chocolate'
    ],
    'Chocolate syrup': [
        'Mocha Latte Hot',
        'Rocky Road Frappe',
        'Choco Fudge Frappe',
        'Choco Mousse Frappe',
        'Dark Choco Milk Tea'
    ],
    'Caramel syrup': [
        'Caramel Macchiato Hot',
        'Iced Caramel Macchiato',
        'Salted Caramel Frappe',
        'Caramel Milk Tea'
    ],
    'Vanilla syrup': [
        'Vanilla Latte Hot',
        'Iced Vanilla Latte',
        'Caramel Macchiato Hot'
    ],
    'Strawberry syrup': [
        'Strawberry Cream Frappe',
        'Strawberry Cheesecake Frappe',
        'Strawberry & Cream HC',
        'Strawberry & Cream MC'
    ],
    'Mango syrup': [
        'Mango Cheesecake Frappe',
        'Mango cheese cake HC'
    ],
    'Mango puree': [
        'Mango Cheesecake Frappe'
    ],
    'Okinawa syrup': [
        'Okinawa Milk Tea'
    ],
    'Wintermelon syrup': [
        'Wintermelon Milk Tea'
    ],
    'Cookie crumbs': [
        'Cookies & Cream Frappe',
        'Cookies & Cream HC',
        'Cookies & Cream MC',
        'Coffee Crumble Frappe'
    ],
    'Tapioca pearls': [
        'Milk Tea Regular',
        'Caramel Milk Tea',
        'Cookies & Cream Milk Tea',
        'Dark Choco Milk Tea',
        'Okinawa Milk Tea',
        'Wintermelon Milk Tea',
        'Matcha Green Tea Milk Tea',
        'Milk Tea Regular HC',
        'Milk Tea Regular MC',
        'Matcha Green Tea HC',
        'Matcha Green Tea MC',
        'Cookies & Cream HC',
        'Cookies & Cream MC',
        'Strawberry & Cream HC',
        'Strawberry & Cream MC',
        'Mango cheese cake HC'
    ],
    'Steamed milk': [
        'Cafe Latte Hot',
        'Mocha Latte Hot',
        'Vanilla Latte Hot',
        'Caramel Macchiato Hot',
        'Green Tea Latte Hot',
        'White Chocolate Hot',
        'Green Tea Matcha Hot'
    ],
    'Milk foam': [
        'Cappuccino Hot',
        'Caramel Macchiato Hot'
    ],
    'Hot water': [
        'Café Americano Hot',
        'Hot Ceylon Tea Black',
        'Hot Ceylon Tea Lemon',
        'Hot Ceylon Tea Peppermint'
    ],
    'Ice': [
        'Iced Café Latte',
        'Iced Mocha Latte',
        'Iced Vanilla Latte',
        'Iced Caramel Macchiato',
        'Iced White Chocolate Latte',
        'Iced Dark Chocolate',
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea',
        'Calamansi Juice',
        'Milk Tea Regular MC',
        'Matcha Green Tea MC',
        'Cookies & Cream MC',
        'Strawberry & Cream MC',
        'All Frappe drinks'
    ],
    'Carbonated soft drink': [
        'Soda (Mismo) Coke',
        'Soda (Mismo) Sprite',
        'Soda (Mismo) Royal',
        'Soda 1.5L Coke',
        'Soda 1.5L Coke Zero',
        'Soda 1.5L Sprite',
        'Soda 1.5L Royal'
    ],
    'Coke syrup': [
        'Soda (Mismo) Coke',
        'Soda 1.5L Coke'
    ],
    'Coke zero syrup': [
        'Soda 1.5L Coke Zero'
    ],
    'Sprite syrup': [
        'Soda (Mismo) Sprite',
        'Soda 1.5L Sprite'
    ],
    'Royal syrup': [
        'Soda (Mismo) Royal',
        'Soda 1.5L Royal'
    ],
    'Carbonated water': [
        'Soda (Mismo) Coke',
        'Soda (Mismo) Sprite',
        'Soda (Mismo) Royal',
        'Soda 1.5L Coke',
        'Soda 1.5L Coke Zero',
        'Soda 1.5L Sprite',
        'Soda 1.5L Royal'
    ],
    
    // ================ SNACKS & SIDES ================
    'Nacho chips': [
        'Cheesy Nachos',
        'Nachos Supreme'
    ],
    'Tortilla chips': [
        'Cheesy Nachos',
        'Nachos Supreme'
    ],
    'Lumpia wrapper': [
        'Lumpiang Shanghai',
        'Cheesy Dynamite Lumpia',
        'Pork Shanghai'
    ],
    'French fries': [
        'French Fries',
        'Fish and Fries'
    ],
    'Bread': [
        'Clubhouse Sandwich'
    ],
    
    // ================ PACKAGING ================
    'Plastic containers (small)': [
        'All small food items',
        'French Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai (6 pcs)',
        'Plain Rice',
        'Fried Rice'
    ],
    'Plastic containers (medium)': [
        'All medium food items',
        'Rice Bowl Meals',
        'Korean Spicy Bulgogi',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Chicken Adobo',
        'Pork Shanghai',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Budget Meals',
        'Nachos',
        'Fish and Fries'
    ],
    'Plastic containers (large)': [
        'All large food items',
        'Sizzling meals',
        'Party trays (individual serving)',
        'Sinigang (individual serving)',
        'Pakbet',
        'Buttered Shrimp'
    ],  

    'Plastic Cups (12oz)': [
        'All 12oz beverages',
        'Cucumber Lemonade (Glass)',
        'Blue Lemonade (Glass)',
        'Red Tea (Glass)',
        'Calamansi Juice (Glass)',
        'All Hot Coffee drinks',
        'All Iced Coffee drinks',
        'All Milk Tea drinks',
        'All Frappe drinks'
    ],
    'Plastic Cups (16oz)': [
        'All 16oz beverages',
        'Cucumber Lemonade (Pitcher) individual serving',
        'Blue Lemonade (Pitcher) individual serving',
        'All Grande coffee drinks'
    ],
    'Straws (Regular)': [
        'All cold beverages',
        'Cucumber Lemonade',
        'Blue Lemonade',
        'Red Tea',
        'Calamansi Juice',
        'Soda',
        'Iced Coffee drinks'
    ],
    'Straws (Boba)': [
        'All Milk Tea drinks',
        'All Frappe drinks',
        'Matcha Green Tea drinks'
    ],

    'Collins Glass': [
        'Cucumber Lemonade (Glass)',
        'Blue Lemonade (Glass)',
        'Red Tea (Glass)',
        'Calamansi Juice (Glass)',
    ],

    'Plates (Small)': [
        'French Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai (6 pcs)',
        'Plain Rice',
        'Fried Rice'
    ],
    'Plates (Medium)': [
        'Rice Bowl Meals',
        'Korean Spicy Bulgogi',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Chicken Adobo',
        'Pork Shanghai',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Budget Meals',
        'Nachos',
        'Fish and Fries'
    ],
    'Plates (Large)': [
        'Sizzling meals',
        'Party trays (individual serving)',
        'Sinigang (individual serving)',
        'Pakbet',
        'Buttered Shrimp'
    ],
    'Plastic Utensils Set': [
        'All Rice Bowl Meals',
        'All Sizzling meals',
        'All Party Tray items',
        'All Specialties',
        'All Snacks'
    ],
    'Napkins (Pack of 50)': [
        'All food items',
        'All dine-in orders',
        'All takeout orders'
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
    const itemId = elements.itemId ? elements.itemId.value : '';
    const isEdit = itemId && itemId.trim() !== '';
    const itemNameValue = elements.itemName ? elements.itemName.value.trim() : '';
    
    if (!itemNameValue) {
        // No item name entered, enable save button
        if (elements.saveItemBtn) {
            elements.saveItemBtn.disabled = false;
            elements.saveItemBtn.style.opacity = '1';
            elements.saveItemBtn.style.cursor = 'pointer';
        }
        hideDuplicateNotification();
        return;
    }
    
    // Check for duplicates
    let isDuplicate = false;
    
    if (!isEdit) {
        // When adding new, check if any item has same name
        isDuplicate = allInventoryItems.some(item => 
            item.itemName.toLowerCase().trim() === itemNameValue.toLowerCase()
        );
    } else {
        // When editing, check if another item (not current) has same name
        isDuplicate = allInventoryItems.some(item => {
            const sameNameCheck = item.itemName.toLowerCase().trim() === itemNameValue.toLowerCase();
            const differentItemCheck = item._id !== itemId && item.id !== itemId;
            return sameNameCheck && differentItemCheck;
        });
    }
    
    if (isDuplicate) {
        showDuplicateNotification(itemNameValue);
        // DISABLE THE SAVE BUTTON
        if (elements.saveItemBtn) {
            elements.saveItemBtn.disabled = true;
            elements.saveItemBtn.style.opacity = '0.5';
            elements.saveItemBtn.style.cursor = 'not-allowed';
            elements.saveItemBtn.title = '❌ This ingredient already exists. Cannot save.';
        }
    } else {
        hideDuplicateNotification();
        // ENABLE THE SAVE BUTTON
        if (elements.saveItemBtn) {
            elements.saveItemBtn.disabled = false;
            elements.saveItemBtn.style.opacity = '1';
            elements.saveItemBtn.style.cursor = 'pointer';
            elements.saveItemBtn.title = '';
        }
    }
}

function showDuplicateNotification(ingredientName) {
    // Remove any existing duplicate modal
    const existingModal = document.getElementById('duplicateModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'duplicateModal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 40px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideDown 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <h2 style="color: #dc3545; margin: 0 0 15px 0; font-size: 24px;">Duplicate Ingredient</h2>
            
            <p style="color: #666; font-size: 16px; margin: 0 0 30px 0; line-height: 1.6;">
                <strong style="color: #333;">"${ingredientName}"</strong> already exists in your inventory!
            </p>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin-bottom: 30px; text-align: left; color: #856404;">
                <strong>Note:</strong> You cannot add duplicate ingredients. Please choose a different ingredient name.
            </div>
            
            <button onclick="document.getElementById('duplicateModal').remove()" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 12px 40px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">
                Got it!
            </button>
        </div>
    `;
    
    // Add animations to document if not already there
    if (!document.getElementById('duplicateNotificationStyles')) {
        const style = document.createElement('style');
        style.id = 'duplicateNotificationStyles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.1); }
                50% { transform: scale(1); }
                75% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

function hideDuplicateNotification() {
    const modal = document.getElementById('duplicateModal');
    if (modal) {
        modal.remove();
    }
}

// ==================== LOGOUT CONFIRMATION MODAL ====================

function showLogoutConfirmation(onConfirm, onCancel) {
    // Remove any existing logout modal
    const existingModal = document.getElementById('logoutConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'logoutConfirmModal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 40px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideDown 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 60px; margin-bottom: 20px;">👋</div>
            
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px;">Confirm Logout</h2>
            
            <p style="color: #666; font-size: 16px; margin: 0 0 30px 0; line-height: 1.6;">
                Are you sure you want to logout? You will need to login again to access the system.
            </p>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="cancelLogoutBtn" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#5a6268'" onmouseout="this.style.background='#6c757d'">
                    Cancel
                </button>
                <button id="confirmLogoutBtn" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">
                    Logout
                </button>
            </div>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelLogoutBtn');
    cancelBtn.addEventListener('click', () => {
        modalOverlay.remove();
        if (onCancel) onCancel();
    });
    
    // Confirm button
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    confirmBtn.addEventListener('click', () => {
        modalOverlay.remove();
        if (onConfirm) onConfirm();
    });
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
            if (onCancel) onCancel();
        }
    });
    
    // Allow ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modalOverlay.remove();
            document.removeEventListener('keydown', handleEsc);
            if (onCancel) onCancel();
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// ==================== MODAL FUNCTIONS ====================

function openAddModal() {
    if (elements.modalTitle) elements.modalTitle.textContent = 'Add New Raw Ingredient';
    if (elements.itemId) elements.itemId.value = '';
    if (elements.itemForm) elements.itemForm.reset();
    
    // Hide duplicate notification when opening add modal
    hideDuplicateNotification();
    
    // Enable save button by default for new ingredient
    if (elements.saveItemBtn) {
        elements.saveItemBtn.disabled = false;
        elements.saveItemBtn.style.opacity = '1';
        elements.saveItemBtn.style.cursor = 'pointer';
        elements.saveItemBtn.title = '';
    }
    
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
    
    // Enable save button by default for editing
    if (elements.saveItemBtn) {
        elements.saveItemBtn.disabled = false;
        elements.saveItemBtn.style.opacity = '1';
        elements.saveItemBtn.style.cursor = 'pointer';
        elements.saveItemBtn.title = '';
    }
    
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
    if (!itemName) {
        // Clear fields if no name selected
        hideDuplicateNotification();
        if (elements.saveItemBtn) {
            elements.saveItemBtn.disabled = false;
            elements.saveItemBtn.style.opacity = '1';
            elements.saveItemBtn.style.cursor = 'pointer';
        }
        return;
    }
    
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
    
    // Check for duplicate ingredients in real-time and disable/enable button
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
        // Real-time duplicate checking on both change and input events
        elements.itemName.addEventListener('change', updateFromItemName);
        elements.itemName.addEventListener('input', () => {
            // Check duplicates as user types/selects
            checkAndShowDuplicateNotification();
        });
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
window.showLogoutConfirmation = showLogoutConfirmation;

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
    // ==================== RICE BOWL MEALS ====================
    'Korean Spicy Bulgogi (Pork)': ['Pork', 'Garlic', 'Onion', 'Chili', 'Gochujang', 'Sesame oil', 'Soy sauce', 'Cooking oil', 'Salt', 'Black pepper', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Korean Salt and Pepper (Pork)': ['Pork', 'Garlic', 'Onion', 'Chili', 'Gochujang', 'Sesame oil', 'Soy sauce', 'Cooking oil', 'Salt', 'Black pepper', 'Peppercorn', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Crispy Pork Lechon Kawali': ['Pork Belly', 'Garlic', 'Onion', 'Bay leaves', 'Peppercorn', 'Salt', 'Cooking oil', 'Cornstarch', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Cream Dory Fish Fillet': ['Cream Dory', 'Flour', 'Salt', 'Black pepper', 'Butter', 'Garlic', 'Cream', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Buttered Honey Chicken': ['Chicken', 'Butter', 'Honey', 'Garlic', 'Soy sauce', 'Black pepper', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Buttered Spicy Chicken': ['Chicken', 'Butter', 'Chili flakes', 'Garlic', 'Soy sauce', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Chicken Adobo': ['Chicken', 'Garlic', 'Onion', 'Soy sauce', 'Vinegar', 'Bay leaves', 'Peppercorn', 'Black pepper', 'Salt', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Pork Shanghai': ['Ground Pork', 'Carrot', 'Onion', 'Garlic', 'Egg', 'Breadcrumbs', 'Lumpia wrapper', 'Cooking oil', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],

    // ==================== HOT SIZZLERS ====================
    'Sizzling Pork Sisig': ['Pork', 'Onion', 'Chili', 'Calamansi', 'Mayonnaise', 'Soy sauce', 'Egg', 'Cooking oil', 'Salt', 'Black pepper', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Sizzling Liempo': ['Pork Belly', 'Garlic', 'Soy sauce', 'Black pepper', 'Cooking oil', 'Salt', 'Rice', 'Sizzling Plates', 'Napkins', 'Plastic Utensils Set'],
    'Sizzling Porkchop': ['Pork Chop', 'Garlic', 'Soy sauce', 'Black pepper', 'Cooking oil', 'Salt', 'Rice', 'Sizzling Plates', 'Napkins', 'Plastic Utensils Set'],
    'Sizzling Fried Chicken': ['Chicken', 'Flour', 'Garlic', 'Black pepper', 'Gravy', 'Cooking oil', 'Rice', 'Sizzling Plates', 'Napkins', 'Plastic Utensils Set'],

    // ==================== PARTY TRAYS ====================
    'Pancit Bihon': ['Rice noodles', 'Chicken', 'Cabbage', 'Carrot', 'Garlic', 'Onion', 'Soy sauce', 'Oyster sauce', 'Cooking oil', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Pancit Canton': ['Pancit Canton noodles', 'Chicken', 'Cabbage', 'Carrot', 'Garlic', 'Onion', 'Soy sauce', 'Oyster sauce', 'Cooking oil', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Pancit Canton + Bihon (Mixed)': ['Pancit Canton noodles', 'Bihon noodles', 'Chicken', 'Cabbage', 'Carrot', 'Garlic', 'Onion', 'Soy sauce', 'Oyster sauce', 'Chicken broth', 'Cooking oil', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Spaghetti': ['Spaghetti pasta', 'Sweet tomato sauce', 'Ground Pork', 'Hotdog', 'Cheese', 'Garlic', 'Onion', 'Sugar', 'Cooking oil', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Creamy Carbonara': ['Spaghetti pasta', 'Bacon', 'Cream', 'Milk', 'Cheese', 'Egg', 'Garlic', 'Butter', 'Black pepper', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Creamy Pesto': ['Spaghetti pasta', 'Basil pesto', 'Cream', 'Cheese', 'Garlic', 'Pine nuts', 'Olive oil', 'Salt', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Tuyo Pesto': ['Spaghetti pasta', 'Tuyo', 'Basil pesto', 'Garlic', 'Olive oil', 'Chili', 'Salt', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Kare-Kare': ['Oxtail', 'Banana Flower Bud', 'Pechay', 'String Beans', 'Eggplant', 'Ground Peanuts', 'Peanut Butter', 'Shrimp Paste', 'Water', 'Annatto oil', 'Toasted Ground Rice', 'Garlic', 'Onion', 'Salt', 'Black Pepper', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Chicken Buffalo Wings': ['Chicken Wings', 'Flour', 'Cornstarch', 'Buffalo sauce', 'Butter', 'Garlic', 'Cooking oil', 'Salt', 'Black pepper', 'Plates', 'Napkins', 'Plastic Utensils Set'],

    // ==================== DRINKS ====================
    'Cucumber Lemonade (Glass)': ['Cucumber', 'Lemon', 'Sugar', 'Water', 'Ice', 'Plastic Cups', 'Straws'],
    'Cucumber Lemonade (Pitcher)': ['Cucumber', 'Lemon', 'Sugar', 'Water', 'Ice', 'Pitcher'],
    'Blue Lemonade (Glass)': ['Blue syrup', 'Lemon', 'Sugar', 'Water', 'Ice', 'Plastic Cups', 'Straws'],
    'Blue Lemonade (Pitcher)': ['Blue syrup', 'Lemon', 'Sugar', 'Water', 'Ice', 'Pitcher'],
    'Red Tea (Glass)': ['Red tea', 'Sugar', 'Water', 'Ice', 'Plastic Cups', 'Straws'],
    'Red Tea (Pitcher)': ['Red tea', 'Sugar', 'Water', 'Ice', 'Pitcher'],
    'Calamansi Juice (Glass)': ['Calamansi', 'Sugar', 'Water', 'Ice', 'Plastic Cups', 'Straws'],
    'Calamansi Juice (Pitcher)': ['Calamansi', 'Sugar', 'Water', 'Ice', 'Pitcher'],
    'Soda (Mismo) Coke': ['Coke syrup', 'Carbonated water', 'Plastic Bottle'],
    'Soda (Mismo) Sprite': ['Sprite syrup', 'Carbonated water', 'Plastic Bottle'],
    'Soda (Mismo) Royal': ['Royal syrup', 'Carbonated water', 'Plastic Bottle'],
    'Soda 1.5L Coke': ['Coke syrup', 'Carbonated water', 'Plastic Bottle'],
    'Soda 1.5L Coke Zero': ['Coke zero syrup', 'Carbonated water', 'Plastic Bottle'],
    'Soda 1.5L Sprite': ['Sprite syrup', 'Carbonated water', 'Plastic Bottle'],
    'Soda 1.5L Royal': ['Royal syrup', 'Carbonated water', 'Plastic Bottle'],

    // ==================== HOT COFFEE ====================
    'Espresso Hot': ['Coffee beans', 'Water', 'Plastic Cups'],
    'Café Americano Hot': ['Espresso', 'Hot water', 'Plastic Cups'],
    'Cappuccino Hot': ['Espresso', 'Steamed milk', 'Milk foam', 'Plastic Cups'],
    'Café Latte Hot': ['Espresso', 'Steamed milk', 'Plastic Cups'],
    'Mocha Latte Hot': ['Espresso', 'Chocolate syrup', 'Steamed milk', 'Plastic Cups'],
    'Vanilla Latte Hot': ['Espresso', 'Vanilla syrup', 'Steamed milk', 'Plastic Cups'],
    'Caramel Macchiato Hot': ['Espresso', 'Vanilla syrup', 'Caramel syrup', 'Steamed milk', 'Milk foam', 'Plastic Cups'],
    'Green Tea Latte Hot': ['Matcha powder', 'Steamed milk', 'Sugar', 'Plastic Cups'],
    'White Chocolate Hot': ['White chocolate syrup', 'Steamed milk', 'Cream', 'Plastic Cups'],
    'Green Tea Matcha Hot': ['Matcha powder', 'Steamed milk', 'Sugar', 'Plastic Cups'],

    // ==================== HOT CEYLON TEA ====================
    'Hot Ceylon Tea Black': ['Black tea', 'Hot water', 'Sugar', 'Plastic Cups'],
    'Hot Ceylon Tea Lemon': ['Black tea', 'Lemon', 'Hot water', 'Sugar', 'Plastic Cups'],
    'Hot Ceylon Tea Peppermint': ['Peppermint tea', 'Hot water', 'Honey', 'Plastic Cups'],

    // ==================== ICED COFFEE ====================
    'Iced Café Latte': ['Espresso', 'Milk', 'Ice', 'Sugar', 'Plastic Cups', 'Straws'],
    'Iced Mocha Latte': ['Espresso', 'Chocolate syrup', 'Milk', 'Ice', 'Sugar', 'Plastic Cups', 'Straws'],
    'Iced Vanilla Latte': ['Espresso', 'Vanilla syrup', 'Milk', 'Ice', 'Plastic Cups', 'Straws'],
    'Iced Caramel Macchiato': ['Espresso', 'Vanilla syrup', 'Caramel syrup', 'Milk', 'Ice', 'Plastic Cups', 'Straws'],
    'Iced White Chocolate Latte': ['White chocolate syrup', 'Milk', 'Ice', 'Plastic Cups', 'Straws'],
    'Iced Dark Chocolate': ['Dark chocolate syrup', 'Milk', 'Ice', 'Plastic Cups', 'Straws'],

    // ==================== MILK TEA ====================
    'Milk Tea Regular': ['Black tea', 'Milk', 'Sugar', 'Tapioca pearls', 'Ice', 'Plastic Cups', 'Boba straws'],
    'Caramel Milk Tea': ['Black tea', 'Milk', 'Caramel syrup', 'Sugar', 'Tapioca pearls', 'Ice', 'Plastic Cups', 'Boba straws'],
    'Cookies & Cream Milk Tea': ['Black tea', 'Milk', 'Cookie crumbs', 'Sugar', 'Tapioca pearls', 'Ice', 'Plastic Cups', 'Boba straws'],
    'Dark Choco Milk Tea': ['Black tea', 'Milk', 'Chocolate syrup', 'Sugar', 'Tapioca pearls', 'Ice', 'Plastic Cups', 'Boba straws'],
    'Okinawa Milk Tea': ['Black tea', 'Milk', 'Okinawa syrup', 'Sugar', 'Tapioca pearls', 'Ice', 'Plastic Cups', 'Boba straws'],
    'Wintermelon Milk Tea': ['Wintermelon syrup', 'Milk', 'Sugar', 'Tapioca pearls', 'Ice', 'Plastic Cups', 'Boba straws'],
    'Matcha Green Tea Milk Tea': ['Matcha powder', 'Milk', 'Sugar', 'Tapioca pearls', 'Ice', 'Plastic Cups', 'Boba straws'],

    // ==================== FRAPPE - PREMIUM ====================
    'Matcha Green Tea Frappe': ['Matcha powder', 'Milk', 'Ice cream', 'Ice', 'Sugar', 'Whipped cream', 'Plastic Cups', 'Boba straws'],
    'Salted Caramel Frappe': ['Coffee', 'Caramel syrup', 'Milk', 'Ice cream', 'Ice', 'Salt', 'Whipped cream', 'Plastic Cups', 'Boba straws'],
    'Strawberry Cheesecake Frappe': ['Strawberry syrup', 'Cream cheese', 'Milk', 'Ice cream', 'Ice', 'Sugar', 'Whipped cream', 'Graham crumbs', 'Plastic Cups', 'Boba straws'],
    'Mango Cheesecake Frappe': ['Mango puree', 'Cream cheese', 'Milk', 'Ice cream', 'Ice', 'Sugar', 'Whipped cream', 'Graham crumbs', 'Plastic Cups', 'Boba straws'],
    'Strawberry Cream Frappe': ['Strawberry syrup', 'Milk', 'Ice cream', 'Ice', 'Sugar', 'Whipped cream', 'Plastic Cups', 'Boba straws'],
    'Cookies & Cream Frappe': ['Coffee', 'Cookie crumbs', 'Milk', 'Ice cream', 'Ice', 'Sugar', 'Whipped cream', 'Chocolate syrup', 'Plastic Cups', 'Boba straws'],
    'Rocky Road Frappe': ['Chocolate syrup', 'Milk', 'Ice cream', 'Ice', 'Marshmallows', 'Nuts', 'Whipped cream', 'Plastic Cups', 'Boba straws'],

    // ==================== FRAPPE - REGULAR ====================
    'Choco Fudge Frappe': ['Chocolate syrup', 'Milk', 'Ice cream', 'Ice', 'Whipped cream', 'Chocolate sauce', 'Plastic Cups', 'Boba straws'],
    'Choco Mousse Frappe': ['Chocolate syrup', 'Chocolate mousse', 'Milk', 'Ice', 'Whipped cream', 'Plastic Cups', 'Boba straws'],
    'Coffee Crumble Frappe': ['Coffee', 'Milk', 'Ice cream', 'Ice', 'Cookie crumbs', 'Whipped cream', 'Plastic Cups', 'Boba straws'],
    'Vanilla Cream Frappe': ['Vanilla syrup', 'Milk', 'Ice cream', 'Ice', 'Whipped cream', 'Plastic Cups', 'Boba straws'],

    // ==================== SNACKS & APPETIZERS ====================
    'Cheesy Nachos': ['Nacho chips', 'Cheese sauce', 'Cheese', 'Cooking oil', 'Onion', 'Plates', 'Napkins'],
    'Nachos Supreme': ['Nacho chips', 'Cheese', 'Cheese sauce', 'Ground meat', 'Tomato', 'Onion', 'Cooking oil', 'Plates', 'Napkins'],
    'French Fries': ['Potato', 'Cooking oil', 'Salt', 'Flour', 'Plates', 'Napkins'],
    'Clubhouse Sandwich': ['Bread', 'Chicken', 'Ham', 'Egg', 'Lettuce', 'Tomato', 'Mayonnaise', 'Napkins'],
    'Fish and Fries': ['Fish fillet', 'Butter', 'Potato', 'Cooking oil', 'Salt', 'Plates', 'Napkins'],
    'Cheesy Dynamite Lumpia': ['Siling Green', 'Cheese', 'Cheese sauce', 'Lumpia wrapper', 'Cooking oil', 'Cornstarch', 'Plates', 'Napkins'],
    'Lumpiang Shanghai': ['Ground Pork', 'Vegetables', 'Carrot', 'Onion', 'Garlic', 'Lumpia wrapper', 'Cooking oil', 'Breadcrumbs', 'Flour', 'Plates', 'Napkins'],

    // ==================== BUDGET MEALS ====================
    'Fried Chicken': ['Chicken', 'Flour', 'Garlic', 'Black pepper', 'Cooking oil', 'Salt', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Budget Fried Chicken': ['Chicken', 'Cooking oil', 'Salt', 'Breadcrumbs', 'Flour', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Tinapa Rice': ['Tinapa', 'Rice', 'Garlic', 'Egg', 'Cooking oil', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Tuyo Pesto': ['Tuyo', 'Pasta', 'Garlic', 'Cooking oil', 'Herbs', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Fried Rice': ['Rice', 'Garlic', 'Onion', 'Sesame oil', 'Soy sauce', 'Cooking oil', 'Salt', 'Sugar', 'Egg', 'Water', 'Plates', 'Napkins'],
    'Plain Rice': ['Rice', 'Salt', 'Water', 'Plates', 'Napkins'],

    // ==================== FILIPINO SPECIALTIES ====================
    'Sinigang (Pork)': ['Pork', 'Garlic', 'Onion', 'Chili', 'Calamansi', 'Tomato', 'Tamarind mix', 'Shrimp paste', 'Salt', 'Black pepper', 'Bay leaves', 'Water', 'Radish', 'Kangkong', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Sinigang (Shrimp)': ['Shrimp', 'Garlic', 'Onion', 'Chili', 'Calamansi', 'Tomato', 'Tamarind mix', 'Shrimp paste', 'Salt', 'Black pepper', 'Bay leaves', 'Water', 'Kangkong', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Paknet (Pakbet w/ Bagnet)': ['Bagnet', 'Garlic', 'Onion', 'Tomato', 'Cucumber', 'Corn', 'Potato', 'Eggplant', 'Squash', 'Okra', 'Ampalaya', 'Shrimp paste', 'Cooking oil', 'Salt', 'Black pepper', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Buttered Shrimp': ['Shrimp', 'Garlic', 'Calamansi', 'Butter', 'Salt', 'Black pepper', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Special Bulalo (good for 2-3 Persons)': ['Beef Shank', 'Corn', 'Potato', 'Cabbage', 'Carrot', 'Onion', 'Garlic', 'Bay leaves', 'Peppercorn', 'Salt', 'Water', 'Beef broth', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],
    'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)': ['Beef Shank', 'Corn', 'Potato', 'Cabbage', 'Carrot', 'Onion', 'Garlic', 'Bay leaves', 'Peppercorn', 'Salt', 'Water', 'Beef broth', 'Rice', 'Plates', 'Napkins', 'Plastic Utensils Set'],

    // ==================== PACKAGING SUPPLIES ====================
    'Plastic Cups (12oz)': ['Plastic cups pack'],
    'Plastic Cups (16oz)': ['Plastic cups pack'],
    'Straws (Regular)': ['Straws pack'],
    'Straws (Boba)': ['Boba straws pack'],
    'Plates (Small)': ['Food container pack'],
    'Plates (Medium)': ['Food container pack'],
    'Plates (Large)': ['Food container pack'],
    'Plastic Utensils Set': ['Utensils set pack'],
    'Napkins (Pack of 50)': ['Napkins pack']
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