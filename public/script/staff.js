let currentOrder = [];
let orderType = null;
let tableNumber = null;
let currentCategory = 'all';
let selectedPaymentMethod = null;
let paymentAmount = 0;
let productCatalog = [];
let staffInventory = [];
let pendingStockRequests = [];
let outOfStockItems = [];
let currentUser = null;

// Track active stock requests with their status
let activeStockRequests = new Map(); // key: productName, value: { timestamp, quantity, status }

// Flag to prevent multiple submissions
let isSubmittingStockRequest = false;

// ==================== 🔴 ADMIN NOTIFICATION TRACKING ====================
let outOfStockNotifications = new Set();

// ==================== 🔴 EVENT SOURCE FOR REAL-TIME UPDATES ====================
let stockEventSource = null;

// ==================== 🔴 MAXIMUM STOCK LIMIT ====================
const MAX_STOCK_PER_ITEM = 100;

// ==================== 🍽️ SERVINGWARE INVENTORY ====================
let servingwareInventory = {
    'plate': { name: 'Plate', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'tray': { name: 'Party Tray', current: 100, max: 100, unit: 'piece', minThreshold: 15 },
    'glass': { name: 'Glass', current: 100, max: 100, unit: 'piece', minThreshold: 25 },
    'sizzling plate': { name: 'Sizzling Plate', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'cup': { name: 'Coffee Cup', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'bowl': { name: 'Rice Bowl', current: 100, max: 100, unit: 'piece', minThreshold: 30 },
    'pitcher': { name: 'Pitcher', current: 50, max: 50, unit: 'piece', minThreshold: 10 },
    'bottle': { name: 'Bottle', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'serving': { name: 'Serving Plate', current: 80, max: 80, unit: 'piece', minThreshold: 15 },
    'sandwich': { name: 'Sandwich Plate', current: 50, max: 50, unit: 'piece', minThreshold: 10 },
    'meal': { name: 'Meal Tray', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'pot': { name: 'Cooking Pot', current: 30, max: 30, unit: 'piece', minThreshold: 5 }
};

// ==================== 🥩 INGREDIENT INVENTORY ====================
let ingredientInventory = {
    'pork': { name: 'Pork', current: 50, max: 500, unit: 'kg', minThreshold: 20 },
    'chicken': { name: 'Chicken', current: 40, max: 300, unit: 'kg', minThreshold: 15 },
    'beef': { name: 'Beef', current: 30, max: 200, unit: 'kg', minThreshold: 10 },
    'shrimp': { name: 'Shrimp', current: 20, max: 100, unit: 'kg', minThreshold: 8 },
    'fish': { name: 'Cream Dory', current: 25, max: 150, unit: 'kg', minThreshold: 10 },
    'pork_belly': { name: 'Pork Belly', current: 30, max: 100, unit: 'kg', minThreshold: 10 },
    'pork_chop': { name: 'Pork Chop', current: 25, max: 80, unit: 'kg', minThreshold: 8 },
    'onion': { name: 'Onion', current: 15, max: 50, unit: 'kg', minThreshold: 5 },
    'garlic': { name: 'Garlic', current: 10, max: 30, unit: 'kg', minThreshold: 3 },
    'cabbage': { name: 'Cabbage', current: 12, max: 40, unit: 'kg', minThreshold: 5 },
    'carrot': { name: 'Carrot', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'bell_pepper': { name: 'Bell Pepper', current: 8, max: 20, unit: 'kg', minThreshold: 3 },
    'calamansi': { name: 'Calamansi', current: 8, max: 20, unit: 'kg', minThreshold: 5 },
    'tomato': { name: 'Tomato', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'potato': { name: 'Potato', current: 25, max: 100, unit: 'kg', minThreshold: 10 },
    'cucumber': { name: 'Cucumber', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'eggplant': { name: 'Eggplant', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'green_beans': { name: 'Green Beans', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'rice': { name: 'Rice', current: 80, max: 200, unit: 'kg', minThreshold: 30 }
};

// ==================== 🍽️ PRODUCT INGREDIENT MAPPING ====================
const productIngredientMap = {
    // ==================== RICE BOWL MEALS ====================
    'Korean Spicy Bulgogi (Pork)': {
        ingredients: { 
            'pork': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02, 
            'gochujang': 0.03,
            'sesame_oil': 0.01,
            'soy_sauce': 0.03, 
            'cooking_oil': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01,
            'chili': 0.01
        },
        servingware: 'plate'
    },
    'Korean Salt and Pepper (Pork)': {
        ingredients: { 
            'pork': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02, 
            'gochujang': 0.03,
            'sesame_oil': 0.01,
            'soy_sauce': 0.03, 
            'cooking_oil': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01,
            'peppercorn': 0.01
        },
        servingware: 'plate'
    },
    'Crispy Pork Lechon Kawali': {
        ingredients: { 
            'pork_belly': 0.25, 
            'garlic': 0.02, 
            'onion': 0.03,
            'salt': 0.01,
            'cooking_oil': 0.1,
            'cornstarch': 0.02
        },
        servingware: 'plate'
    },
    'Cream Dory Fish Fillet': {
        ingredients: { 
            'cream_dory': 0.2,
            'breadcrumbs': 0.05,
            'flour': 0.05,
            'egg': 0.05,
            'cooking_oil': 0.1,
            'salt': 0.01,
            'black_pepper': 0.01,
            'lemon': 0.02
        },
        servingware: 'plate'
    },
    'Buttered Honey Chicken': {
        ingredients: { 
            'chicken': 0.25,
            'butter': 0.08,
            'honey': 0.1,
            'garlic': 0.02,
            'cooking_oil': 0.05,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Buttered Spicy Chicken': {
        ingredients: { 
            'chicken': 0.25,
            'butter': 0.08,
            'chili': 0.05,
            'garlic': 0.03,
            'cooking_oil': 0.05,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },
    'Chicken Adobo': {
        ingredients: { 
            'chicken': 0.25,
            'soy_sauce': 0.1,
            'vinegar': 0.08,
            'garlic': 0.05,
            'onion': 0.05,
            'bay_leaves': 0.01,
            'black_pepper': 0.01,
            'cooking_oil': 0.03
        },
        servingware: 'plate'
    },
    'Pork Shanghai': {
        ingredients: { 
            'pork': 0.2,
            'lumpia_wrapper': 0.1,
            'carrots': 0.08,
            'onion': 0.05,
            'garlic': 0.03,
            'cooking_oil': 0.15,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },

    // ==================== HOT SIZZLERS ====================
    'Sizzling Pork Sisig': {
        ingredients: { 
            'pork': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02,
            'chili': 0.02,
            'calamansi': 0.02,
            'egg': 0.05,
            'mayonnaise': 0.03,
            'soy_sauce': 0.02,
            'oyster_sauce': 0.02,
            'cooking_oil': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'sizzling_plate'
    },
    'Sizzling Liempo': {
        ingredients: { 
            'pork_belly': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'cooking_oil': 0.02,
            'salt': 0.01
        },
        servingware: 'sizzling_plate'
    },
    'Sizzling Porkchop': {
        ingredients: { 
            'pork': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'cooking_oil': 0.02,
            'salt': 0.01
        },
        servingware: 'sizzling_plate'
    },
    'Sizzling Fried Chicken': {
        ingredients: { 
            'chicken': 0.3,
            'flour': 0.08,
            'breadcrumbs': 0.08,
            'egg': 0.05,
            'cooking_oil': 0.15,
            'gravy': 0.1,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'sizzling_plate'
    },

    // ==================== PARTY TRAY ====================
    'Pansit Bihon': {
        ingredients: { 
            'rice_noodles': 0.8,
            'onion': 0.1, 
            'garlic': 0.05,
            'carrots': 0.15,
            'soy_sauce': 0.08,
            'oyster_sauce': 0.08,
            'cooking_oil': 0.1,
            'chicken': 0.2,
            'cabbage': 0.15
        },
        servingware: 'tray'
    },
    'Pancit Canton': {
        ingredients: { 
            'pancit_canton': 0.8,
            'onion': 0.1, 
            'garlic': 0.05,
            'carrots': 0.15,
            'soy_sauce': 0.08,
            'oyster_sauce': 0.08,
            'cooking_oil': 0.1,
            'chicken': 0.2,
            'cabbage': 0.15
        },
        servingware: 'tray'
    },
    'Spaghetti': {
        ingredients: { 
            'spaghetti_pasta': 0.8,
            'onion': 0.1, 
            'garlic': 0.05,
            'tomato_sauce': 0.3,
            'ground_pork': 0.25,
            'hotdog': 0.15,
            'cheese': 0.1,
            'sugar': 0.05,
            'cooking_oil': 0.08,
            'Tray': 0.05
        },
        servingware: 'tray'
    },
    'Creamy Carbonara': {
        ingredients: { 
            'spaghetti_pasta': 0.8,
            'bacon': 0.2,
            'cream': 0.3,
            'milk': 0.2,
            'cheese': 0.15,
            'egg': 0.1,
            'garlic': 0.03,
            'butter': 0.05,
            'black_pepper': 0.01
        },
        servingware: 'tray'
    },
    'Creamy Pesto': {
        ingredients: { 
            'spaghetti_pasta': 0.8,
            'basil_pesto': 0.15,
            'cream': 0.25,
            'cheese': 0.15,
            'garlic': 0.03,
            'pine_nuts': 0.05,
            'olive_oil': 0.08,
            'salt': 0.01
        },
        servingware: 'tray'
    },
    'Tuyo Pesto': {
        ingredients: { 
            'spaghetti_pasta': 0.8,
            'tuyo': 0.15,
            'basil_pesto': 0.15,
            'garlic': 0.05,
            'olive_oil': 0.08,
            'chili': 0.02,
            'salt': 0.01
        },
        servingware: 'tray'
    },
    'Kare-Kare': {
        ingredients: { 
            'oxtail': 0.4,
            'banana_flower_bud': 0.15,
            'pechay': 0.15,
            'string_beans': 0.1,
            'chinese_eggplant': 0.1,
            'ground_peanuts': 0.1,
            'peanut_butter': 0.1,
            'shrimp_paste': 0.02,
            'water': 0.5,
            'annatto_seeds': 0.005,
            'toasted_ground_rice': 0.05,
            'garlic': 0.03,
            'onion': 0.08,
            'salt': 0.01,
            'black_pepper': 0.005
        },
        servingware: 'pot'
    },
    'Chicken Buffalo Wings': {
        ingredients: { 
            'chicken_wings': 0.8,
            'flour': 0.15,
            'cornstarch': 0.1,
            'buffalo_sauce': 0.2,
            'butter': 0.1,
            'garlic': 0.03,
            'cooking_oil': 0.2,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },
    'Lumpia Shanghai': {
        ingredients: { 
            'lumpia_wrapper': 0.3,
            'pork': 0.4,
            'carrots': 0.15,
            'onion': 0.1,
            'garlic': 0.05,
            'breadcrumbs': 0.1,
            'egg': 0.05,
            'cooking_oil': 0.2,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },

    // ==================== DRINKS (GLASS) ====================
    'Cucumber Lemonade (Glass)': {
        ingredients: { 
            'cucumber': 0.08,
            'lemon': 0.05,
            'sugar': 0.03,
            'water': 0.25,
            'ice': 0.15
        },
        servingware: 'glass'
    },
    'Blue Lemonade (Glass)': {
        ingredients: { 
            'blue_syrup': 0.05,
            'lemon': 0.05,
            'sugar': 0.03,
            'water': 0.25,
            'ice': 0.15
        },
        servingware: 'glass'
    },
    'Red Tea (Glass)': {
        ingredients: { 
            'red_tea': 0.02,
            'sugar': 0.03,
            'water': 0.25,
            'ice': 0.15
        },
        servingware: 'glass'
    },
    'Calamansi Juice (Glass)': {
        ingredients: { 
            'calamansi': 0.1,
            'sugar': 0.04,
            'water': 0.2,
            'ice': 0.15
        },
        servingware: 'glass'
    },

    // ==================== DRINKS (PITCHER) ====================
    'Cucumber Lemonade (Pitcher)': {
        ingredients: { 
            'cucumber': 0.25,
            'lemon': 0.15,
            'sugar': 0.1,
            'water': 0.8,
            'ice': 0.3
        },
        servingware: 'pitcher'
    },
    'Blue Lemonade (Pitcher)': {
        ingredients: { 
            'blue_syrup': 0.15,
            'lemon': 0.15,
            'sugar': 0.1,
            'water': 0.8,
            'ice': 0.3
        },
        servingware: 'pitcher'
    },
    'Red Tea (Pitcher)': {
        ingredients: { 
            'red_tea': 0.06,
            'sugar': 0.1,
            'water': 0.8,
            'ice': 0.3
        },
        servingware: 'pitcher'
    },
    'Calamansi Juice (Pitcher)': {
        ingredients: { 
            'calamansi': 0.3,
            'sugar': 0.12,
            'water': 0.7,
            'ice': 0.3
        },
        servingware: 'pitcher'
    },

    // ==================== SODA ====================
    'Soda (Mismo) Coke': {
        ingredients: { 
            'coke_syrup': 0.05,
            'carbonated_water': 0.3
        },
        servingware: 'bottle'
    },
    'Soda (Mismo) Sprite': {
        ingredients: { 
            'sprite_syrup': 0.05,
            'carbonated_water': 0.3
        },
        servingware: 'bottle'
    },
    'Soda (Mismo) Royal': {
        ingredients: { 
            'royal_syrup': 0.05,
            'carbonated_water': 0.3
        },
        servingware: 'bottle'
    },
    'Soda 1.5L Coke': {
        ingredients: { 
            'coke_syrup': 0.2,
            'carbonated_water': 1.3
        },
        servingware: 'bottle'
    },
    'Soda 1.5L Coke Zero': {
        ingredients: { 
            'coke_zero_syrup': 0.2,
            'carbonated_water': 1.3
        },
        servingware: 'bottle'
    },
    'Soda 1.5L Sprite': {
        ingredients: { 
            'sprite_syrup': 0.2,
            'carbonated_water': 1.3
        },
        servingware: 'bottle'
    },
    'Soda 1.5L Royal': {
        ingredients: { 
            'royal_syrup': 0.2,
            'carbonated_water': 1.3
        },
        servingware: 'bottle'
    },

    // ==================== HOT COFFEE ====================
    'Espresso Hot': {
        ingredients: { 
            'coffee_beans': 0.02,
            'water': 0.03
        },
        servingware: 'cup'
    },
    'Café Americano Hot': {
        ingredients: { 
            'espresso': 0.05,
            'hot_water': 0.2
        },
        servingware: 'cup'
    },
    'Cappuccino Hot': {
        ingredients: { 
            'espresso': 0.05,
            'steamed_milk': 0.15,
            'milk_foam': 0.1
        },
        servingware: 'cup'
    },
    'Café Latte Hot': {
        ingredients: { 
            'espresso': 0.05,
            'steamed_milk': 0.25
        },
        servingware: 'cup'
    },
    'Mocha Latte Hot': {
        ingredients: { 
            'espresso': 0.05,
            'chocolate_syrup': 0.03,
            'steamed_milk': 0.22
        },
        servingware: 'cup'
    },
    'Vanilla Latte Hot': {
        ingredients: { 
            'espresso': 0.05,
            'vanilla_syrup': 0.03,
            'steamed_milk': 0.22
        },
        servingware: 'cup'
    },
    'Caramel Macchiato Hot': {
        ingredients: { 
            'espresso': 0.05,
            'vanilla_syrup': 0.02,
            'caramel_syrup': 0.03,
            'steamed_milk': 0.2,
            'milk_foam': 0.05
        },
        servingware: 'cup'
    },
    'Green Tea Latte Hot': {
        ingredients: { 
            'matcha_powder': 0.02,
            'steamed_milk': 0.25,
            'sugar': 0.02
        },
        servingware: 'cup'
    },

    // ==================== NON-COFFEE HOT ====================
    'White Chocolate Hot': {
        ingredients: { 
            'white_chocolate_syrup': 0.05,
            'steamed_milk': 0.25,
            'cream': 0.02
        },
        servingware: 'cup'
    },
    'Green Tea Matcha Hot': {
        ingredients: { 
            'matcha_powder': 0.03,
            'steamed_milk': 0.25,
            'sugar': 0.02
        },
        servingware: 'cup'
    },

    // ==================== HOT CEYLON TEA ====================
    'Hot Ceylon Tea Black': {
        ingredients: { 
            'black_tea': 0.02,
            'hot_water': 0.25,
            'sugar': 0.02
        },
        servingware: 'cup'
    },
    'Hot Ceylon Tea Lemon': {
        ingredients: { 
            'black_tea': 0.02,
            'lemon': 0.03,
            'hot_water': 0.25,
            'sugar': 0.02
        },
        servingware: 'cup'
    },
    'Hot Ceylon Tea Peppermint': {
        ingredients: { 
            'peppermint_tea': 0.02,
            'hot_water': 0.25,
            'honey': 0.02
        },
        servingware: 'cup'
    },

    // ==================== OVER-ICE COFFEE ====================
    'Iced Café Latte': {
        ingredients: { 
            'espresso': 0.05,
            'milk': 0.2,
            'ice': 0.15,
            'sugar': 0.02
        },
        servingware: 'cup'
    },
    'Iced Mocha Latte': {
        ingredients: { 
            'espresso': 0.05,
            'chocolate_syrup': 0.03,
            'milk': 0.18,
            'ice': 0.15,
            'sugar': 0.02
        },
        servingware: 'cup'
    },
    'Iced Vanilla Latte': {
        ingredients: { 
            'espresso': 0.05,
            'vanilla_syrup': 0.03,
            'milk': 0.18,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Iced Caramel Macchiato': {
        ingredients: { 
            'espresso': 0.05,
            'vanilla_syrup': 0.02,
            'caramel_syrup': 0.03,
            'milk': 0.18,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Iced White Chocolate Latte': {
        ingredients: { 
            'white_chocolate_syrup': 0.04,
            'milk': 0.2,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Iced Dark Chocolate': {
        ingredients: { 
            'dark_chocolate_syrup': 0.05,
            'milk': 0.2,
            'ice': 0.15
        },
        servingware: 'cup'
    },

    // ==================== MILK TEA ====================
    'Milk Tea Regular': {
        ingredients: { 
            'black_tea': 0.03,
            'milk': 0.15,
            'sugar': 0.03,
            'tapioca_pearls': 0.08,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Caramel Milk Tea': {
        ingredients: { 
            'black_tea': 0.03,
            'milk': 0.15,
            'caramel_syrup': 0.04,
            'sugar': 0.02,
            'tapioca_pearls': 0.08,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Cookies & Cream Milk Tea': {
        ingredients: { 
            'black_tea': 0.03,
            'milk': 0.15,
            'cookie_crumbs': 0.05,
            'sugar': 0.02,
            'tapioca_pearls': 0.08,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Dark Choco Milk Tea': {
        ingredients: { 
            'black_tea': 0.03,
            'milk': 0.15,
            'chocolate_syrup': 0.05,
            'sugar': 0.02,
            'tapioca_pearls': 0.08,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Okinawa Milk Tea': {
        ingredients: { 
            'black_tea': 0.03,
            'milk': 0.15,
            'okinawa_syrup': 0.04,
            'sugar': 0.02,
            'tapioca_pearls': 0.08,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Wintermelon Milk Tea': {
        ingredients: { 
            'wintermelon_syrup': 0.04,
            'milk': 0.15,
            'sugar': 0.02,
            'tapioca_pearls': 0.08,
            'ice': 0.15
        },
        servingware: 'cup'
    },
    'Matcha Green Tea Milk Tea': {
        ingredients: { 
            'matcha_powder': 0.02,
            'milk': 0.15,
            'sugar': 0.03,
            'tapioca_pearls': 0.08,
            'ice': 0.15
        },
        servingware: 'cup'
    },

    // ==================== FRAPPE - PREMIUM ====================
    'Matcha Green Tea Frappe': {
        ingredients: { 
            'matcha_powder': 0.02,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'sugar': 0.03,
            'whipped_cream': 0.05
        },
        servingware: 'cup'
    },
    'Salted Caramel Frappe': {
        ingredients: { 
            'coffee': 0.05,
            'caramel_syrup': 0.05,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'salt': 0.005,
            'whipped_cream': 0.05
        },
        servingware: 'cup'
    },
    'Strawberry Cheesecake Frappe': {
        ingredients: { 
            'strawberry_syrup': 0.05,
            'cream_cheese': 0.03,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'sugar': 0.02,
            'whipped_cream': 0.05,
            'graham_crumbs': 0.02
        },
        servingware: 'cup'
    },
    'Mango Cheesecake Frappe': {
        ingredients: { 
            'mango_puree': 0.06,
            'cream_cheese': 0.03,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'sugar': 0.02,
            'whipped_cream': 0.05,
            'graham_crumbs': 0.02
        },
        servingware: 'cup'
    },
    'Strawberry Cream Frappe': {
        ingredients: { 
            'strawberry_syrup': 0.05,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'sugar': 0.02,
            'whipped_cream': 0.05
        },
        servingware: 'cup'
    },
    'Cookies & Cream Frappe': {
        ingredients: { 
            'coffee': 0.05,
            'cookie_crumbs': 0.05,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'sugar': 0.02,
            'whipped_cream': 0.05,
            'chocolate_syrup': 0.02
        },
        servingware: 'cup'
    },
    'Rocky Road Frappe': {
        ingredients: { 
            'chocolate_syrup': 0.05,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'marshmallows': 0.03,
            'nuts': 0.02,
            'whipped_cream': 0.05
        },
        servingware: 'cup'
    },

    // ==================== FRAPPE - REGULAR ====================
    'Choco Fudge Frappe': {
        ingredients: { 
            'chocolate_syrup': 0.06,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'whipped_cream': 0.05,
            'chocolate_sauce': 0.03
        },
        servingware: 'cup'
    },
    'Choco Mousse Frappe': {
        ingredients: { 
            'chocolate_syrup': 0.05,
            'chocolate_mousse': 0.08,
            'milk': 0.15,
            'ice': 0.2,
            'whipped_cream': 0.05
        },
        servingware: 'cup'
    },
    'Coffee Crumble Frappe': {
        ingredients: { 
            'coffee': 0.06,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'cookie_crumbs': 0.04,
            'whipped_cream': 0.05
        },
        servingware: 'cup'
    },
    'Vanilla Cream Frappe': {
        ingredients: { 
            'vanilla_syrup': 0.05,
            'milk': 0.15,
            'ice_cream': 0.1,
            'ice': 0.2,
            'whipped_cream': 0.05
        },
        servingware: 'cup'
    },

    // ==================== ADDITIONAL MENU ITEMS ====================
    'Sinigang (Pork)': {
        ingredients: { 
            'pork': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'tomato': 0.05,
            'calamansi': 0.02,
            'chili': 0.01,
            'shrimp_paste': 0.02,
            'tamarind_mix': 0.03,
            'salt': 0.01,
            'black_pepper': 0.01,
            'bay_leaves': 0.01,
            'water': 0.3
        },
        servingware: 'bowl'
    },
    'Sinigang (Shrimp)': {
        ingredients: { 
            'shrimp': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02,
            'tomato': 0.05,
            'calamansi': 0.02,
            'chili': 0.01,
            'shrimp_paste': 0.02,
            'tamarind_mix': 0.03,
            'salt': 0.01,
            'black_pepper': 0.01,
            'bay_leaves': 0.01,
            'water': 0.3
        },
        servingware: 'bowl'
    },
    'Buttered Shrimp': {
        ingredients: { 
            'shrimp': 0.2, 
            'butter': 0.03,
            'calamansi': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },
    'Special Bulalo': {
        ingredients: { 
            'beef': 0.3,
            'corn': 0.1,
            'potato': 0.1,
            'carrots': 0.1,
            'onion': 0.05,
            'garlic': 0.02,
            'bay_leaves': 0.01,
            'salt': 0.01,
            'water': 0.3,
            'chicken_broth': 0.2
        },
        servingware: 'pot'
    },
    'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)': {
        ingredients: { 
            'beef': 0.6,
            'corn': 0.2,
            'potato': 0.2,
            'carrots': 0.2,
            'onion': 0.1,
            'garlic': 0.04,
            'bay_leaves': 0.02,
            'salt': 0.02,
            'water': 0.6,
            'chicken_broth': 0.4
        },
        servingware: 'pot'
    },
    'Paknet (Pakbet w/ Bagnet)': {
        ingredients: { 
            'bagnet': 0.15,
            'onion': 0.05, 
            'garlic': 0.02,
            'tomato': 0.05,
            'cucumber': 0.05,
            'corn': 0.05,
            'potato': 0.05,
            'carrots': 0.05,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },
    'Tinapa Rice': {
        ingredients: { 
            'rice': 0.2,
            'tinapa': 0.05
        },
        servingware: 'plate'
    },
    'Tuyo Pesto': {
        ingredients: { 
            'rice': 0.2,
            'tuyo': 0.03,
            'shrimp_paste': 0.02
        },
        servingware: 'plate'
    },
    'Fried Rice': {
        ingredients: { 
            'rice': 0.2,
            'onion': 0.02, 
            'garlic': 0.02,
            'egg': 0.05,
            'soy_sauce': 0.01,
            'sesame_oil': 0.01,
            'sugar': 0.01,
            'salt': 0.01,
            'water': 0.02,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Plain Rice': {
        ingredients: { 
            'rice': 0.2,
            'salt': 0.01,
            'water': 0.02
        },
        servingware: 'cup'
    },
    'Cheesy Nachos': {
        ingredients: { 
            'nacho_chips': 0.15,
            'onion': 0.02,
            'cheese_sauce': 0.05,
            'cheese': 0.03,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Nachos Supreme': {
        ingredients: { 
            'nacho_chips': 0.15,
            'onion': 0.02,
            'cheese_sauce': 0.05,
            'cheese': 0.03,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'French Fries': {
        ingredients: { 
            'french_fries': 0.2,
            'flour': 0.02,
            'cooking_oil': 0.08,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Cheesy Dynamite Lumpia': {
        ingredients: { 
            'lumpia_wrapper': 0.1,
            'cheese': 0.05,
            'cheese_sauce': 0.03,
            'cornstarch': 0.02,
            'cooking_oil': 0.05
        },
        servingware: 'plate'
    },
    'Clubhouse Sandwich': {
        ingredients: { 
            'chicken': 0.1, 
            'bread': 0.1,
            'mayonnaise': 0.02,
            'gravy': 0.03
        },
        servingware: 'plate'
    },
    'Fish and Fries': {
        ingredients: { 
            'cream_dory': 0.15, 
            'french_fries': 0.15,
            'breadcrumbs': 0.02,
            'flour': 0.02,
            'cooking_oil': 0.08,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Fried Chicken': {
        ingredients: { 
            'chicken': 0.25, 
            'breadcrumbs': 0.03,
            'flour': 0.03,
            'cooking_oil': 0.1,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Budget Fried Chicken': {
        ingredients: { 
            'chicken': 0.15, 
            'breadcrumbs': 0.02,
            'flour': 0.02,
            'cooking_oil': 0.08,
            'salt': 0.01
        },
        servingware: 'plate'
    }
};

// ==================== 🏷️ CATEGORY DISPLAY NAMES ====================
const categoryDisplayNames = {
    'Rice Bowl Meals': 'Rice Bowl Meals',
    'Hot Sizzlers': 'Hot Sizzlers',
    'Party Tray': 'Party Tray',
    'Drinks': 'Drinks',
    'Coffee': 'Coffee',
    'Milk Tea': 'Milk Tea',
    'Frappe': 'Frappe',
    'Snacks & Appetizer': 'Snacks & Appetizer',
    'Budget Meals Served with Rice': 'Budget Meals Served with Rice',
    'Specialties': 'Specialties'
};

// ==================== 🖼️ PRODUCT IMAGE MAPPING ====================
const productImageMap = {
    'Korean Spicy Bulgogi (Pork)': 'rice/korean_spicy_bulgogi.png',
    'Korean Salt and Pepper (Pork)': 'rice/korean_salt_pepper_pork.png',
    'Crispy Pork Lechon Kawali': 'rice/lechon_kawali.png',
    'Pork Shanghai': 'rice/pork_shanghai.png',
    'Sinigang (Pork)': 'specialties/sinigang_pork.png',
    'Sizzling Pork Sisig': 'sizzling/pork_sisig.png',
    'Sizzling Liempo': 'sizzling/liempo.png',
    'Sizzling Porkchop': 'sizzling/porkchop.png',
    'Buttered Honey Chicken': 'rice/buttered_honey_chicken.png',
    'Buttered Spicy Chicken': 'rice/buttered_spicy_chicken.png',
    'Chicken Adobo': 'rice/chicken_adobo.png',
    'Fried Chicken': 'sizzling/fried_chicken.png',
    'Sizzling Fried Chicken': 'sizzling/fried_chicken.png',
    'Budget Fried Chicken': 'budget/fried_chicken_Meal.png',
    'Clubhouse Sandwich': 'snacks/club_house_sandwich.png',
    'Cream Dory Fish Fillet': 'rice/cream_dory.png',
    'Fish and Fries': 'snacks/fish_fries.png',
    'Sinigang (Shrimp)': 'specialties/sinigang_shrimp.png',
    'Buttered Shrimp': 'specialties/buttered_shrimp.png',
    'Special Bulalo': 'specialties/bulalo.png',
    'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)': 'specialties/bulalo.png',
    'Paknet (Pakbet w/ Bagnet)': 'specialties/paknet.png',
    'Pancit Bihon (S)': 'party/pancit_bihon_large.png',
    'Pancit Bihon (M)': 'party/pancit_bihon_large.png',
    'Pancit Bihon (L)': 'party/pancit_bihon_large.png',
    'Pancit Canton (S)': 'party/pancit_canton_large.png',
    'Pancit Canton (M)': 'party/pancit_canton_large.png',
    'Pancit Canton (L)': 'party/pancit_canton_large.png',
    'Spaghetti (S)': 'party/spaghetti_large.png',
    'Spaghetti (M)': 'party/spaghetti_large.png',
    'Spaghetti (L)': 'party/spaghetti_large.png',
    'Tinapa Rice': 'budget/Tinapa_fried_rice.png',
    'Tuyo Pesto': 'budget/Tuyo_pesto.png',
    'Fried Rice': 'budget/fried_rice.png',
    'Plain Rice': 'budget/plain_rice.png',
    'Cheesy Nachos': 'snacks/cheesy_nachos.png',
    'Nachos Supreme': 'snacks/nachos_supreme.png',
    'French Fries': 'snacks/french_fries.png',
    'Cheesy Dynamite Lumpia': 'snacks/Cheesy_dynamite.png',
    'Lumpiang Shanghai': 'snacks/lumpiang_shanghai.png',
    'Cucumber Lemonade (Glass)': 'drinks/cucumber_lemonade.png',
    'Cucumber Lemonade (Pitcher)': 'drinks/cucumber_lemonade.png',
    'Blue Lemonade (Glass)': 'drinks/blue_lemonade.png',
    'Blue Lemonade (Pitcher)': 'drinks/blue_lemonade.png',
    'Red Tea (Glass)': 'drinks/red_tea.png',
    'Soda (Mismo)': 'drinks/soda_mismo.png',
    'Soda 1.5L': 'drinks/soda_mismo.png',
    'Cafe Americano Tall': 'coffee/cafe_americano_grande.png',
    'Cafe Americano Grande': 'coffee/cafe_americano_grande.png',
    'Cafe Latte Tall': 'coffee/cafe_latte_grande.png',
    'Cafe Latte Grande': 'coffee/cafe_latte_grande.png',
    'Caramel Macchiato Tall': 'coffee/caramel_macchiato_grande.png',
    'Caramel Macchiato Grande': 'coffee/caramel_macchiato_grande.png',
    'Milk Tea Regular HC': 'milktea/Milktea_regular.png',
    'Milk Tea Regular MC': 'milktea/Milktea_regular.png',
    'Matcha Green Tea HC': 'milktea/Matcha_greentea_HC.png',
    'Matcha Green Tea MC': 'milktea/Matcha_greentea_HC.png',
    'Cookies & Cream HC': 'frappe/Cookies_&Cream_HC.png',
    'Cookies & Cream MC': 'frappe/Cookies_&Cream_HC.png',
    'Strawberry & Cream HC': 'frappe/Strawberry_Cream_frappe_HC.png',
    'Mango cheese cake HC': 'frappe/Mango_cheesecake_HC.png'
};

const BACKEND_URL = window.location.origin;

// ==================== 📸 GET PRODUCT IMAGE ====================
function getProductImage(productName) {
    return productImageMap[productName] || 'default_food.jpg';
}

// ==================== 🎯 TOAST NOTIFICATION ====================
function showToast(message, type = 'success', duration = 3000) {
    const existingToast = document.getElementById('activeToast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.id = 'activeToast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ff9800' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        z-index: 99999;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideInRight 0.3s ease-in-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
    
    return toast;
}

// ==================== 👤 GET CURRENT USER ====================
async function getCurrentUser() {
    try {
        const response = await fetch('/api/user/me', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            console.log('👤 Current user:', currentUser);
            return currentUser;
        }
    } catch (error) {
        console.error('Error getting current user:', error);
    }
    return null;
}

// ==================== LOGOUT HANDLER ====================
function handleLogout() {
    console.log('🚪 Logging out staff user...');
    
    // Show logout confirmation modal
    showLogoutConfirmation(() => {
        // On confirm
        try {
            currentOrder = [];
            pendingStockRequests = [];
            currentUser = null;
            
            const itemsToClear = [
                'pendingStockRequests',
                'localStockRequests',
                'servingwareInventory',
                'stockRequestTimestamps',
                'offlineMode',
                'lastSyncTime'
            ];
            
            itemsToClear.forEach(item => {
                localStorage.removeItem(item);
            });
            
            showToast('Logging out... Please wait', 'info', 2000);
            
            setTimeout(() => {
                fetch('/api/auth/logout', {  // Fixed endpoint
                    method: 'POST',  // Changed from GET to POST
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(() => {
                    window.location.href = '/login?logout=true';
                })
                .catch(() => {
                    window.location.href = '/login?logout=true';
                });
            }, 500);
            
        } catch (error) {
            console.error('❌ Error during logout:', error);
            window.location.href = '/login?logout=true';
        }
    }, () => {
        // On cancel
        console.log('🔙 Logout cancelled');
    });
}

// Logout confirmation modal function
function showLogoutConfirmation(onConfirm, onCancel) {
    // Check if modal already exists
    if (document.getElementById('logoutModal')) {
        return;
    }

    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'logoutModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    // Add animation styles if they don't exist
    if (!document.getElementById('logoutModalStyles')) {
        const style = document.createElement('style');
        style.id = 'logoutModalStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        text-align: center;
    `;

    modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">Confirm Logout</h3>
            <p style="color: #666; margin: 0; font-size: 16px;">Are you sure you want to logout?</p>
        </div>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="cancelLogoutBtn" style="
                padding: 12px 30px;
                background: #f0f0f0;
                color: #666;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.2s ease;
                flex: 1;
                max-width: 130px;
            " onmouseover="this.style.background='#e4e4e4'" 
               onmouseout="this.style.background='#f0f0f0'">
                Cancel
            </button>
            <button id="confirmLogoutBtn" style="
                padding: 12px 30px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.2s ease;
                flex: 1;
                max-width: 130px;
            " onmouseover="this.style.background='#c82333'" 
               onmouseout="this.style.background='#dc3545'">
                Logout
            </button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Handle cancel button
    const cancelBtn = document.getElementById('cancelLogoutBtn');
    const confirmBtn = document.getElementById('confirmLogoutBtn');

    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (onCancel) onCancel();
    });

    confirmBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (onConfirm) onConfirm();
    });

    // Handle clicking outside the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            if (onCancel) onCancel();
        }
    });

    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', handleEscape);
            if (document.getElementById('logoutModal')) {
                document.body.removeChild(modal);
                if (onCancel) onCancel();
            }
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ==================== 📋 LOAD ALL MENU ITEMS FROM MONGODB ====================
async function loadAllMenuItems() {
    // console.log('📋 Loading menu items from MongoDB...');
    
    try {
        const response = await fetch('/api/menu', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data)) {
            productCatalog = [];
            outOfStockItems = [];
            
            result.data.forEach(item => {
                const currentStock = parseInt(item.currentStock) || 0;
                
                const product = {
                    name: item.name || item.itemName || 'Unknown',
                    price: item.price || 0,
                    category: item.category || 'Uncategorized',
                    image: getProductImage(item.name || item.itemName || ''),
                    stock: currentStock,
                    unit: item.unit || 'piece',
                    _id: item._id || `temp_${Date.now()}_${Math.random()}`,
                    maxStock: item.maxStock || MAX_STOCK_PER_ITEM,
                    status: currentStock > 0 ? 'in_stock' : 'out_of_stock'
                };
                
                productCatalog.push(product);
                // console.log(`📦 Loaded product: ${product.name} (ID: ${product._id}) - Stock: ${currentStock}`);
                
                if (currentStock <= 0) {
                    outOfStockItems.push(product.name);
                }
            });
            // console.log(`✅ Loaded ${productCatalog.length} products from MongoDB`);
            renderMenu();
            return true;
        }
        
        showToast('❌ Invalid database response', 'error', 3000);
        // console.error('❌ Invalid response from MongoDB:', result);
        return false;
        
    } catch (error) {
        showToast(`❌ Database error: ${error.message}`, 'error', 3000);
        // console.error('❌ Error loading menu from MongoDB:', error);
        return false;
    }
}

// ==================== 🎯 RENDER MENU ====================
function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    container.innerHTML = '';

    const items = currentCategory === 'all'
        ? productCatalog
        : productCatalog.filter(p => p.category === currentCategory);

    if (items.length === 0) {
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                text-align: center;
                min-height: 300px;
                color: #666;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
                <h3 style="margin: 10px 0; font-size: 20px; color: #333;">No Products Found</h3>
                <p style="margin: 10px 0; font-size: 14px; color: #999;">
                    No items available in this category at the moment.
                </p>
                <p style="margin: 10px 0; font-size: 13px; color: #bbb;">
                    Please try another category or check back later.
                </p>
            </div>
        `;
        return;
    }

    items.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// ==================== 🎯 PRODUCT CARD ====================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'compact-product-card';
    
    card.dataset.productName = product.name;
    card.dataset.productId = product._id;
    card.dataset.stock = product.stock || 0;
    
    card.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (product.stock > 0) {
            addItemToOrder(product.name, product.price, product);
        } else {
            showToast(`${product.name} is out of stock`, 'error', 2000);
        }
    };
    
    const stockStatus = product.stock > 0 
        ? `✅ In Stock: ${product.stock}`
        : `🚫 OUT OF STOCK`;
    
    const stockColor = product.stock > 0 ? '#28a745' : '#dc3545';
    
    const hasPendingRequest = activeStockRequests.has(product.name);
    const pendingIndicator = hasPendingRequest ? '<span style="color: #ff9800; font-size: 12px; display: block;">⏳ Request Pending (Waiting for Admin)</span>' : '';
    
    // Construct proper image path based on category
    const categoryFolderMap = {
        'Coffee': 'coffee',
        'Milk Tea': 'milktea',
        'Frappe': 'frappe',
        'Drinks': 'drinks',
        'Rice': 'rice',
        'Sizzling': 'sizzling',
        'Snacks': 'snacks',
        'Party': 'party',
        'Budget': 'budget',
        'Specialties': 'specialties'
    };
    
    const categoryFolder = categoryFolderMap[product.category] || 'images';
    let imagePath = `/images/${product.image}`;
    
    // If product.image doesn't already include the category path, construct it
    if (product.image && !product.image.includes('/')) {
        imagePath = `/images/${categoryFolder}/${product.image}`;
    }
    
    card.innerHTML = `
        <img src="${imagePath}" 
             onerror="this.onerror=null; this.src='/images/default_food.png';" 
             alt="${product.name}"
             style="opacity: ${product.stock > 0 ? '1' : '0.7'}; width: 100%; height: 100%; object-fit: cover;" />
        <div class="compact-product-name">${product.name}</div>
        <div class="compact-product-category">${product.category}</div>
        <div class="compact-product-price">₱${product.price}</div>
        <div class="compact-product-stock" style="color: ${stockColor}; font-weight: bold;">
            ${stockStatus}
            ${pendingIndicator}
        </div>
    `;
    
    return card;
}

// ==================== 🔴 ADD ITEM TO ORDER ====================
// ==================== UPDATE STOCK IN MONGODB ====================
async function updateStockInMongoDB(productId, newStock) {
    try {
        // console.log(`🔄 Sending stock update: Product ${productId}, New Stock: ${newStock}`);
        
        const response = await fetch(`/api/menu/${productId}/stock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ currentStock: newStock })
        });

        if (!response.ok) {
            // console.error(`❌ Failed to update stock for product ${productId}: ${response.status}`);
            const errorData = await response.json();
            // console.error('Error details:', errorData);
            showToast(`⚠️ Stock update failed`, 'warning', 2000);
            return false;
        }

        const result = await response.json();
        // console.log(`✅ Stock PERSISTED in MongoDB for ${productId}: ${newStock} units`);
        // console.log('Server Response:', result);
        return true;
    } catch (error) {
        // console.error(`❌ Error updating stock in MongoDB:`, error);
        showToast(`⚠️ Error updating stock`, 'warning', 2000);
        return false;
    }
}

function addItemToOrder(name, price, product = null) {
    if (!product) {
        product = productCatalog.find(p => p.name === name);
    }
    
    if (!product || product.stock <= 0) {
        showToast(`${name} is out of stock`, 'error', 2000);
        return;
    }
    
    const existingItem = currentOrder.find(item => item.name === name);
    
    // Update stock locally
    product.stock--;
    
    // Update stock in MongoDB asynchronously
    updateStockInMongoDB(product._id, product.stock);
    
    if (existingItem) {
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        currentOrder.push({
            id: product._id,
            itemName: product.itemName || product.name,
            name: product.name || product.itemName,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
            unit: product.unit,
            _id: product._id,
            image: product.image || 'default_food.jpg',
            vatable: product.vatable !== undefined ? product.vatable : true,
            size: 'Regular'
        });
    }
    
    if (product.stock === 0) {
        product.status = 'out_of_stock';
        if (!outOfStockItems.includes(product.name)) {
            outOfStockItems.push(product.name);
        }
    }
    
    renderOrder();
    renderMenu();
    updatePayButtonState();
    updateChange();
}

// ==================== 🧾 ORDER FUNCTIONS ====================
function renderOrder() {
    const list = document.getElementById('productlist');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('totals');

    if (!list) return;

    list.innerHTML = '';
    let subtotal = 0;

    currentOrder.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        list.innerHTML += `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #eee;">
                <span>${item.name} x${item.quantity}</span>
                <span>₱${itemTotal.toFixed(2)}</span>
                <button onclick="removeItemFromOrder(${index})" style="background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; padding: 2px 8px;">✕</button>
            </li>`;
    });

    if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${subtotal.toFixed(2)}`;
}

function removeItemFromOrder(index) {
    const item = currentOrder[index];
    const product = productCatalog.find(p => p.name === item.name);
    
    if (product) {
        product.stock += item.quantity;
        
        // Update stock in MongoDB asynchronously
        updateStockInMongoDB(product._id, product.stock);
        
        if (product.stock > 0) {
            product.status = 'in_stock';
            outOfStockItems = outOfStockItems.filter(name => name !== product.name);
            
            // If stock becomes available, remove from active requests if exists
            if (activeStockRequests.has(product.name)) {
                activeStockRequests.delete(product.name);
            }
        }
    }
    
    currentOrder.splice(index, 1);
    renderOrder();
    renderMenu();
    updatePayButtonState();
    updateChange();
}

function clearCurrentOrder() {
    if (currentOrder.length === 0) return;
    
    if (!confirm('Clear current order? This will return items to inventory.')) return;
    
    currentOrder.forEach(item => {
        const product = productCatalog.find(p => p.name === item.name);
        if (product) {
            product.stock += item.quantity;
            
            // Update stock in MongoDB asynchronously
            updateStockInMongoDB(product._id, product.stock);
            
            if (product.stock > 0) {
                product.status = 'in_stock';
                outOfStockItems = outOfStockItems.filter(name => name !== product.name);
                
                // If stock becomes available, remove from active requests if exists
                if (activeStockRequests.has(product.name)) {
                    activeStockRequests.delete(product.name);
                }
            }
        }
    });
    
    currentOrder = [];
    renderOrder();
    renderMenu();
    updatePayButtonState();
    updateChange();
}

// ==================== 💰 PAYMENT CONFIRMATION ====================
function showOrderConfirmation() {
    if (!currentOrder || currentOrder.length === 0) {
        alert("No items in order");
        return;
    }
    
    if (!orderType || orderType === "None") {
        alert("Please select order type (Dine In or Takeout)");
        return;
    }
    
    if (orderType === "Dine In" && !tableNumber) {
        alert("Please enter table number");
        return;
    }
    
    if (!selectedPaymentMethod) {
        alert("Please select payment method");
        return;
    }
    
    // Show the payment confirmation modal
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'block';
    }
}

// ==================== 💰 ORDER TYPE FUNCTIONS ====================
function setDineIn() {
    orderType = "Dine In";
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = orderType;
    
    // Enable table number input for dine in
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.disabled = false;
        tableInput.style.backgroundColor = 'white';
        tableInput.style.opacity = '1';
        tableInput.style.pointerEvents = 'auto';
        tableInput.placeholder = 'Enter table number';
    }
    
    updatePayButtonState();
}

function setTakeout() {
    orderType = "Takeout";
    tableNumber = null;
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = orderType;
    
    // Disable and clear table number input for takeout
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.disabled = true;
        tableInput.value = '';
        tableInput.style.backgroundColor = '#f0f0f0';
        tableInput.style.opacity = '0.7';
        tableInput.style.pointerEvents = 'none';
        tableInput.placeholder = 'Table number not required';
    }
    
    updatePayButtonState();
}

function setTableNumber() {
    const input = document.getElementById('tableNumber');
    tableNumber = input.value.trim();
    if (tableNumber) {
    }
    updatePayButtonState();
}

// ==================== 💰 PAYMENT FUNCTIONS ====================
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    const display = document.getElementById("paymentMethodDisplay");
    if (display) {
        display.textContent = method === 'cash' ? 'Cash' : 'GCash';
    }
    
    // Highlight selected button
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        if (method === 'cash' && btn.id === 'cash-btn') {
            btn.style.background = '#007bff';
        } else if (method === 'gcash' && btn.id === 'gcash-btn') {
            btn.style.background = '#007bff';
        } else {
            btn.style.background = '#6c757d';
        }
    });
    
    // Handle payment input based on method
    const paymentInput = document.getElementById('inputPayment');
    
    if (paymentInput) {
        if (method === 'cash') {
            // Enable payment input for cash
            paymentInput.disabled = false;
            paymentInput.style.backgroundColor = 'white';
            paymentInput.style.opacity = '1';
            paymentInput.style.pointerEvents = 'auto';
            paymentInput.placeholder = 'Enter payment amount';
            paymentInput.value = '';
            paymentAmount = 0;
        } else {
            // Disable payment input for GCash
            paymentInput.disabled = true;
            paymentInput.style.backgroundColor = '#f0f0f0';
            paymentInput.style.opacity = '0.7';
            paymentInput.style.pointerEvents = 'none';
            paymentInput.placeholder = 'GCash payment (click Pay)';
            paymentInput.value = '';
            paymentAmount = 0;
        }
    }
    
    updatePayButtonState();
    updateChange();
}

function updatePaymentAmount() {
    const paymentInput = document.getElementById('inputPayment');
    if (!paymentInput) return;
    
    // Only update from input if method is cash
    if (selectedPaymentMethod === 'cash') {
        paymentAmount = parseFloat(paymentInput.value) || 0;
    }
    updateChange();
    updatePayButtonState();
}

function updateChange() {
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const changeEl = document.getElementById('changeAmount');
    
    if (!changeEl) return;
    
    if (selectedPaymentMethod === 'gcash') {
        changeEl.textContent = '0.00';
        changeEl.style.color = '#17a2b8';
    } else if (selectedPaymentMethod === 'cash') {
        if (paymentAmount >= total) {
            const change = paymentAmount - total;
            changeEl.textContent = change.toFixed(2);
            changeEl.style.color = '#28a745';
        } else {
            changeEl.textContent = '0.00';
            changeEl.style.color = '#dc3545';
        }
    } else {
        changeEl.textContent = '0.00';
        changeEl.style.color = '#666';
    }
}

// ==================== 💰 UPDATE PAY BUTTON STATE ====================
function updatePayButtonState() {
    const payButton = document.getElementById('payment-btn');
    if (!payButton) return;
    
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasItems = currentOrder.length > 0;
    const hasOrderType = orderType && orderType !== "None";
    const hasPaymentMethod = selectedPaymentMethod;
    
    // For GCash: always valid for payment (no amount needed)
    // For Cash: need payment amount >= total
    let canPay = false;
    
    if (selectedPaymentMethod === 'gcash') {
        canPay = true; // GCash can always pay immediately
    } else if (selectedPaymentMethod === 'cash') {
        canPay = paymentAmount >= total && paymentAmount > 0; // Cash needs sufficient amount
    }
    
    // Special case: Dine In requires table number
    let tableValid = true;
    if (orderType === "Dine In") {
        const tableInput = document.getElementById('tableNumber');
        tableNumber = tableInput ? tableInput.value : null;
        tableValid = tableNumber && tableNumber.trim() !== '';
    }
    
    // Enable pay button only if all conditions are met
    payButton.disabled = !(hasItems && hasOrderType && hasPaymentMethod && canPay && tableValid);
    
    // Visual feedback
    payButton.style.opacity = payButton.disabled ? '0.5' : '1';
    payButton.style.backgroundColor = payButton.disabled ? '#6c757d' : '#28a745';
    payButton.style.cursor = payButton.disabled ? 'not-allowed' : 'pointer';
    payButton.style.pointerEvents = payButton.disabled ? 'none' : 'auto';
}

// ==================== 💰 PROCESS PAYMENT ====================
// ==================== CUSTOM PAYMENT CONFIRMATION MODAL ====================
function showPaymentConfirmation(paymentDetails) {
    return new Promise((resolve) => {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif;
        `;
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Confirm Payment';
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #333;
            text-align: center;
            font-size: 20px;
        `;
        
        // Create details container
        const details = document.createElement('div');
        details.style.cssText = `
            background: #f5f5f5;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            line-height: 1.8;
        `;
        
        let detailsHTML = `
            <div style="font-size: 14px; color: #555;">
                <strong style="color: #333; display: block; margin-bottom: 10px;">Order: ${paymentDetails.orderType}</strong>
        `;
        
        if (paymentDetails.orderType === 'Dine In') {
            detailsHTML += `<div style="margin-bottom: 8px;"><span style="color: #666;">Table #${paymentDetails.tableNumber}</span></div>`;
        }
        
        detailsHTML += `
                <div style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Total:</span>
                        <strong style="color: #2196f3;">₱${paymentDetails.total.toFixed(2)}</strong>
                    </div>
        `;
        
        if (paymentDetails.method === 'cash') {
            detailsHTML += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Payment:</span>
                        <strong>₱${paymentDetails.amountPaid.toFixed(2)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; background: #e8f5e9; padding: 8px; border-radius: 4px; margin-top: 8px;">
                        <span>Change:</span>
                        <strong style="color: #28a745;">₱${paymentDetails.change.toFixed(2)}</strong>
                    </div>
            `;
        }
        
        detailsHTML += `
                </div>
            </div>
        `;
        
        details.innerHTML = detailsHTML;
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: space-between;
        `;
        
        // Confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '✓ Confirm';
        confirmBtn.style.cssText = `
            flex: 1;
            padding: 12px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        `;
        confirmBtn.onmouseover = () => confirmBtn.style.background = '#218838';
        confirmBtn.onmouseout = () => confirmBtn.style.background = '#28a745';
        confirmBtn.onclick = () => {
            overlay.remove();
            resolve(true);
        };
        
        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕ Cancel';
        cancelBtn.style.cssText = `
            flex: 1;
            padding: 12px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        `;
        cancelBtn.onmouseover = () => cancelBtn.style.background = '#c82333';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#dc3545';
        cancelBtn.onclick = () => {
            overlay.remove();
            resolve(false);
        };
        
        // Assemble modal
        buttonsContainer.appendChild(confirmBtn);
        buttonsContainer.appendChild(cancelBtn);
        
        modal.appendChild(title);
        modal.appendChild(details);
        modal.appendChild(buttonsContainer);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Focus on confirm button
        confirmBtn.focus();
    });
}

async function Payment() {
    console.log('💳 === PAYMENT PROCESS STARTED ===');
    console.log('Current order items:', currentOrder.length);
    console.log('Order type:', orderType);
    console.log('Payment method:', selectedPaymentMethod);
    console.log('Payment amount:', paymentAmount);
    
    if (!currentOrder.length) {
        alert("Please add items to order");
        return;
    }
    
    if (!orderType || orderType === "None") {
        alert("Please select order type (Dine In or Takeout)");
        return;
    }
    
    if (orderType === "Dine In") {
        const tableInput = document.getElementById('tableNumber');
        tableNumber = tableInput ? tableInput.value : null;
        if (!tableNumber || tableNumber.trim() === '') {
            alert("Please enter table number for Dine In orders");
            return;
        }
    }
    
    if (!selectedPaymentMethod) {
        alert("Please select payment method (Cash or GCash)");
        return;
    }
    
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // For Cash, validate payment amount
    if (selectedPaymentMethod === 'cash' && paymentAmount < total) {
        alert(`Insufficient payment. Please enter at least ₱${total.toFixed(2)}`);
        return;
    }
    
    const change = selectedPaymentMethod === 'cash' ? paymentAmount - total : 0;
    
    // Show custom payment confirmation modal
    const paymentConfirmed = await showPaymentConfirmation({
        orderType: orderType,
        tableNumber: tableNumber,
        total: total,
        method: selectedPaymentMethod,
        amountPaid: selectedPaymentMethod === 'cash' ? paymentAmount : total,
        change: change
    });
    
    if (!paymentConfirmed) {
        return;
    }
    
    try {
        // 1️⃣ SAVE ORDER TO DATABASE
        console.log('🔄 Validating payment data...');
        console.log('Payment method selected:', selectedPaymentMethod);
        console.log('Payment amount entered:', paymentAmount);
        console.log('Order total:', total);
        
        // ✅ Map GCash to 'online' for valid enum value
        const paymentMethod = selectedPaymentMethod === 'gcash' ? 'online' : selectedPaymentMethod;
        
        const orderPayload = {
            items: currentOrder.map(item => ({
                id: item.id,
                itemName: item.itemName,
                name: item.itemName,
                price: item.price,
                quantity: item.quantity,
                size: item.size || 'Regular',
                image: item.image || 'default_food.jpg',
                vatable: item.vatable !== undefined ? item.vatable : true
            })),
            total: total,
            type: orderType,
            tableNumber: orderType === 'Dine In' ? tableNumber : null,
            payment: {
                method: paymentMethod,
                amountPaid: selectedPaymentMethod === 'cash' ? paymentAmount : total
            },
            notes: ''
        };
        
        console.log('💾 Prepared order payload:', orderPayload);
        console.log('📦 Sending to /api/orders endpoint...');
        
        const saveResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(orderPayload)
        });
        
        console.log('📨 Response received:', {
            status: saveResponse.status,
            statusText: saveResponse.statusText,
            ok: saveResponse.ok,
            headers: {
                'content-type': saveResponse.headers.get('content-type')
            }
        });
        
        if (!saveResponse.ok) {
            let errorMessage = 'Failed to save order';
            try {
                const errorData = await saveResponse.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `Server error: ${saveResponse.status} ${saveResponse.statusText}`;
            }
            console.error('❌ Order save failed:', errorMessage);
            throw new Error(errorMessage);
        }
        
        const savedOrder = await saveResponse.json();
        console.log('✅ Order saved successfully:', savedOrder);
        
        // Show success message
        showToast('✅ Order saved! Preparing receipt...', 'success', 2000);
        
        // 2️⃣ Generate and print receipt
        const receiptNumber = `RCP-${Date.now().toString().slice(-8)}`;
        const gcashRef = selectedPaymentMethod === 'gcash' ? `GCASH-${Date.now().toString().slice(-8)}` : '';
        
        // Create receipt HTML
        const receiptHTML = generateReceiptHTML(receiptNumber, total, change, gcashRef);
        console.log('📄 Receipt HTML generated, length:', receiptHTML.length);
        
        // Print receipt
        console.log('🖨️ Initiating print...');
        printReceipt(receiptHTML);
        
        // 3️⃣ Clear order completely after a short delay to ensure print dialog appears
        setTimeout(() => {
            clearOrderAfterPayment();
            showToast('✅ Order completed! Ready for new order.', 'success', 3000);
        }, 500);
               
    } catch (error) {
        console.error('❌ === PAYMENT ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Log more details for debugging
        if (error instanceof TypeError) {
            console.error('🔴 This is likely a network error (CORS, server down, etc.)');
        }
        if (error instanceof SyntaxError) {
            console.error('🔴 Response parsing error - invalid JSON from server');
        }
        
        // Show user-friendly error message
        let userMessage = error.message;
        if (error.message.includes('NetworkError') || error instanceof TypeError) {
            userMessage = 'Network error: Server is not responding. Please check if server is running.';
        } else if (error.message.includes('Failed to fetch')) {
            userMessage = 'Connection error: Cannot reach server. Please check your internet connection.';
        } else if (error.message.includes('Insufficient payment')) {
            userMessage = 'Insufficient payment amount. Please enter correct amount.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            userMessage = 'Session expired. Please login again.';
        } else if (error.message.includes('No items in order')) {
            userMessage = 'Order has no items. Please add items to the order.';
        }
        
        console.error('Final error message to user:', userMessage);
        showToast(`❌ ${userMessage}`, 'error', 4000);
    }
}

// ==================== 🧹 CLEAR ORDER AFTER PAYMENT ====================
function clearOrderAfterPayment() {
    // Clear current order
    currentOrder = [];
    paymentAmount = 0;
    
    // Reset payment input
    const paymentInput = document.getElementById('inputPayment');
    if (paymentInput) {
        paymentInput.value = '';
        paymentInput.disabled = true;
        paymentInput.style.backgroundColor = '#f0f0f0';
        paymentInput.style.opacity = '0.7';
        paymentInput.style.pointerEvents = 'none';
        paymentInput.placeholder = 'Select Cash first';
    }
    
    // Reset table number input
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.value = '';
        tableInput.disabled = true;
        tableInput.style.backgroundColor = '#f0f0f0';
        tableInput.style.opacity = '0.7';
        tableInput.style.pointerEvents = 'none';
        tableInput.placeholder = 'Select Dine In first';
    }
    
    // Reset payment method
    selectedPaymentMethod = null;
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.style.background = '#6c757d';
    });
    
    // Reset displays
    const paymentMethodDisplay = document.getElementById("paymentMethodDisplay");
    if (paymentMethodDisplay) paymentMethodDisplay.textContent = "None";
    
    const orderTypeDisplay = document.getElementById("orderTypeDisplay");
    if (orderTypeDisplay) orderTypeDisplay.textContent = "None";
    
    const changeEl = document.getElementById('changeAmount');
    if (changeEl) {
        changeEl.textContent = '0.00';
        changeEl.style.color = '#666';
    }
    
    // Reset order type
    orderType = null;
    tableNumber = null;
    
    // Update UI
    renderOrder();
    updatePayButtonState();
}

// ==================== 🧾 GENERATE RECEIPT HTML ====================
function generateReceiptHTML(receiptNumber, total, change, gcashRef = '') {
    const timestamp = new Date();
    const dateStr = timestamp.toLocaleDateString('en-US', { 
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    const timeStr = timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    let itemsHTML = '';
    let subtotal = 0;
    
    currentOrder.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const itemName = item.itemName || item.name;
        
        // Split item name for better formatting
        const nameParts = itemName.split(' ');
        let formattedName = itemName;
        
        itemsHTML += `
            <div class="receipt-item">
                <span class="item-name">${itemName}</span>
                <span class="item-price">PHP ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    // VAT Computation (12%) - VAT INCLUSIVE
    const totalDue = subtotal;
    const vatAmount = totalDue * (0.12 / 1.12);
    const vatableSales = totalDue - vatAmount;
    
    const amountPaid = selectedPaymentMethod === 'cash' ? paymentAmount : totalDue;
    
    const changeDisplay = selectedPaymentMethod === 'cash' ? `
        <div class="payment-row">
            <span>CASH</span>
            <span>PHP ${amountPaid.toFixed(2)}</span>
        </div>
        <div class="payment-row">
            <span>CHANGE</span>
            <span>PHP ${change.toFixed(2)}</span>
        </div>
    ` : selectedPaymentMethod === 'gcash' ? `
        <div class="payment-row">
            <span>GCASH</span>
            <span>PHP ${totalDue.toFixed(2)}</span>
        </div>
        <div class="payment-row">
            <span>REF NO.</span>
            <span>${gcashRef || 'N/A'}</span>
        </div>
    ` : '';
    
    const tableInfo = orderType === 'Dine In' ? `
        <div class="info-row">Order Type: Dine In (Table: ${tableNumber})</div>
    ` : `
        <div class="info-row">Order Type: Takeout</div>
    `;
    
    // Generate transaction number
    const transNumber = `TRX-${Math.floor(Math.random() * 100000000)}`;
    const receiptDateTime = `${timestamp.getFullYear()}${(timestamp.getMonth()+1).toString().padStart(2,'0')}${timestamp.getDate().toString().padStart(2,'0')}-${timeStr.replace(':','')}-00000`;
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Receipt ${receiptNumber}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Courier New', monospace;
                    background: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                }
                
                .receipt-container {
                    width: 80mm;
                    max-width: 80mm;
                    background: white;
                    padding: 10px;
                    margin: 0 auto;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    font-size: 12px;
                    line-height: 1.4;
                }
                
                /* HEADER - Center aligned */
                .header {
                    text-align: center;
                    margin-bottom: 10px;
                }
                
                .restaurant-name {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 2px;
                }
                
                .header div {
                    margin: 1px 0;
                }
                
                /* Divider */
                .divider {
                    border-top: 1px dashed #000;
                    margin: 8px 0;
                }
                
                /* Info Section - Justified */
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 2px 0;
                }
                
                /* Items Section - Justified */
                .items-header {
                    text-align: left;
                    margin: 5px 0 2px 0;
                }
                
                .receipt-item {
                    display: flex;
                    justify-content: space-between;
                    margin: 4px 0;
                    text-align: justify;
                }
                
                .item-name {
                    text-align: left;
                    flex: 2;
                    white-space: pre-wrap;
                }
                
                .item-price {
                    text-align: right;
                    flex: 1;
                }
                
                /* Totals Section - Justified */
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 2px 0;
                }
                
                .summary-row.total {
                    font-weight: bold;
                    margin-top: 5px;
                }
                
                /* Payment Section - Justified */
                .payment-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 2px 0;
                }
                
                /* VAT Section - Justified */
                .vat-header {
                    text-align: left;
                    margin: 5px 0 2px 0;
                }
                
                .vat-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 2px 0;
                }
                
                /* Footer - Center aligned */
                .footer {
                    text-align: center;
                    margin-top: 10px;
                }
                
                .thank-you {
                    font-weight: bold;
                    margin: 5px 0;
                }
                
                .footer-small {
                    font-size: 10px;
                }
                
                /* Ensure proper spacing */
                .section-title {
                    text-align: left;
                    margin: 5px 0 2px 0;
                }
                
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    
                    body {
                        padding: 0;
                        background: white;
                    }
                    
                    .receipt-container {
                        box-shadow: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <!-- HEADER - CENTERED -->
                <div class="header">
                    <div class="restaurant-name">GRAY COUNTRYSIDE CAFE</div>
                    <div>JD Building, Crossing, Norzagaray,</div>
                    <div>Bulacan, Philippines, 3013</div>
                    <div>TIN: 000-000-000-000</div>
                    <div>POS: POS001 | MIN#: 1769767525781</div>
                </div>
                
                <div class="divider"></div>
                
                <!-- RECEIPT INFO - JUSTIFIED -->
                <div class="info-row">
                    <span>RECEIPT</span>
                </div>
                <div class="info-row">
                    <span>Trans#: ${transNumber}</span>
                </div>
                <div class="info-row">
                    <span>Cashier: CASHIER001</span>
                </div>
                <div class="info-row">
                    <span>Date: ${dateStr} ${timeStr} #02</span>
                </div>
                
                <div class="divider"></div>
                
                <!-- ORDER TYPE - JUSTIFIED -->
                ${tableInfo}
                
                <div class="divider"></div>
                
                <!-- ITEMS HEADER -->
                <div class="items-header">Items:</div>
                
                <!-- ORDER ITEMS - JUSTIFIED -->
                <div>
                    ${itemsHTML}
                </div>
                
                <div class="divider"></div>
                
                <!-- TOTALS - JUSTIFIED -->
                <div class="summary-row">
                    <span>SUB-TOTAL</span>
                    <span>PHP ${totalDue.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>TOTAL DUE</span>
                    <span>PHP ${totalDue.toFixed(2)}</span>
                </div>
                
                <div class="divider"></div>
                
                <!-- PAYMENT - JUSTIFIED -->
                <div class="section-title">Payment:</div>
                ${changeDisplay}
                
                <div class="divider"></div>
                
                <!-- VAT BREAKDOWN - JUSTIFIED -->
                <div class="vat-header">VAT Breakdown:</div>
                <div class="vat-row">
                    <span>VATable Sales</span>
                    <span>${vatableSales.toFixed(2)}</span>
                </div>
                <div class="vat-row">
                    <span>VAT Amount (12%)</span>
                    <span>${vatAmount.toFixed(2)}</span>
                </div>
                <div class="vat-row">
                    <span>Zero-Rated Sales</span>
                    <span>0.00</span>
                </div>
                <div class="vat-row">
                    <span>VAT Exempt Sales</span>
                    <span>0.00</span>
                </div>
                
                <div class="divider"></div>
                
                <!-- FOOTER - CENTERED -->
                <div class="footer">
                    <div class="thank-you">THANK YOU. PLEASE COME AGAIN.</div>
                    <div class="footer-small">${receiptDateTime}</div>
                </div>
            </div>
        </body>
        </html>
    `;
}

// ==================== 🖨️ PRINT RECEIPT ====================
function printReceipt(receiptHTML) {
    try {
        console.log('🖨️ Preparing receipt for printing...');
        
        // Create a new window with specific features
        const printWindow = window.open('', 'receipt_' + Date.now(), 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
        
        if (!printWindow || printWindow.closed) {
            console.error('❌ Print window blocked by browser');
            showToast('Print window blocked. Please allow popups in browser settings.', 'error', 3000);
            return;
        }
        
        console.log('✅ Print window opened successfully');
        
        // Write content to the new window
        printWindow.document.open();
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        
        // Function to handle print
        const triggerPrint = () => {
            console.log('�️ Triggering print dialog...');
            try {
                printWindow.focus();
                printWindow.print();
                console.log('✅ Print dialog opened');
            } catch (err) {
                console.error('❌ Print trigger error:', err);
            }
        };
        
        // Try to print once document is ready
        let printAttempts = 0;
        const maxAttempts = 5;
        
        const printInterval = setInterval(() => {
            printAttempts++;
            
            // Check if window is still open and content is loaded
            if (printWindow && !printWindow.closed && printWindow.document.readyState === 'complete') {
                clearInterval(printInterval);
                console.log('📄 Document ready, printing now...');
                setTimeout(triggerPrint, 300);
            } else if (printAttempts >= maxAttempts) {
                clearInterval(printInterval);
                console.log('⏱️ Max attempts reached, printing anyway...');
                setTimeout(triggerPrint, 300);
            }
        }, 200);
        
        // Ensure print is triggered even if readyState check fails
        setTimeout(() => {
            if (printWindow && !printWindow.closed) {
                clearInterval(printInterval);
                triggerPrint();
            }
        }, 1500);
        
        // Close window after print (handle browser print dialog close)
        if (printWindow.onbeforeunload === undefined) {
            printWindow.onbeforeunload = () => {
                console.log('✅ Print window closing');
            };
        }
        
        console.log('✅ Print receipt setup completed');
        
    } catch (error) {
        console.error('❌ Print receipt error:', error);
        showToast(`Print error: ${error.message}`, 'error', 3000);
    }
}

// ==================== 📦 STOCK REQUEST FUNCTIONS ====================
// Check if product has pending request
function hasPendingRequest(productName) {
    return activeStockRequests.has(productName);
}

function requestStock(productId) {
    // console.log('🛒 Requesting stock for ID:', productId);
    
    // Get the product name from the page (from the table row)
    // The productId is a numeric ID, we need to find the actual product name
    const stocksData = [
        // Rice Bowl Meals
        { id: 1, name: "Korean Spicy Bulgogi (Pork)" },
        { id: 2, name: "Korean Salt and Pepper (Pork)" },
        { id: 3, name: "Crispy Pork Lechon Kawali" },
        { id: 4, name: "Cream Dory Fish Fillet" },
        { id: 5, name: "Buttered Honey Chicken" },
        { id: 6, name: "Buttered Spicy Chicken" },
        { id: 7, name: "Chicken Adobo" },
        { id: 8, name: "Pork Shanghai" },
        
        // Hot Sizzlers
        { id: 9, name: "Sizzling Pork Sisig" },
        { id: 10, name: "Sizzling Liempo" },
        { id: 11, name: "Sizzling Porkchop" },
        { id: 12, name: "Sizzling Fried Chicken" },
        
        // Party Trays
        { id: 13, name: "Pansit Bihon (S)" },
        { id: 14, name: "Pansit Bihon (M)" },
        { id: 15, name: "Pansit Bihon (L)" },
        { id: 16, name: "Spaghetti (S)" },
        { id: 17, name: "Spaghetti (M)" },
        { id: 18, name: "Spaghetti (L)" },
        { id: 19, name: "Creamy Carbonara" },
        { id: 20, name: "Lumpia Shanghai" },
        { id: 21, name: "Chicken Buffalo Wings" },
        
        // Budget Meals
        { id: 22, name: "Budget Fried Chicken" },
        { id: 23, name: "Tinapa Rice" },
        { id: 24, name: "Tuyo Pesto" },
        { id: 25, name: "Fried Rice" },
        { id: 26, name: "Plain Rice" },
        
        // Snacks & Appetizers
        { id: 27, name: "Cheesy Nachos" },
        { id: 28, name: "Nachos Supreme" },
        { id: 29, name: "French Fries" },
        { id: 30, name: "Cheesy Dynamite Lumpia" },
        { id: 31, name: "Clubhouse Sandwich" },
        { id: 32, name: "Fish and Fries" },
        
        // Drinks
        { id: 33, name: "Cucumber Lemonade (Glass)" },
        { id: 34, name: "Cucumber Lemonade (Pitcher)" },
        { id: 35, name: "Blue Lemonade (Glass)" },
        { id: 36, name: "Blue Lemonade (Pitcher)" },
        { id: 37, name: "Red Tea (Glass)" },
        { id: 38, name: "Calamansi Juice (Glass)" },
        { id: 39, name: "Calamansi Juice (Pitcher)" },
        { id: 40, name: "Soda (Mismo)" },
        { id: 41, name: "Soda 1.5L Coke" },
        { id: 42, name: "Soda 1.5L Sprite" },
        { id: 43, name: "Soda 1.5L Royal" },
        
        // Coffee
        { id: 44, name: "Cafe Americano" },
        { id: 45, name: "Cafe Americano Tall" },
        { id: 46, name: "Cafe Americano Grande" },
        { id: 47, name: "Cafe Latte" },
        { id: 48, name: "Cafe Latte Tall" },
        { id: 49, name: "Cafe Latte Grande" },
        { id: 50, name: "Caramel Macchiato" },
        { id: 51, name: "Caramel Macchiato Tall" },
        { id: 52, name: "Caramel Macchiato Grande" },
        { id: 53, name: "Espresso Hot" },
        { id: 54, name: "Cappuccino Hot" },
        { id: 55, name: "Mocha Latte Hot" },
        
        // Milk Tea
        { id: 56, name: "Milk Tea Regular HC" },
        { id: 57, name: "Milk Tea Regular MC" },
        { id: 58, name: "Caramel Milk Tea" },
        { id: 59, name: "Cookies & Cream Milk Tea" },
        { id: 60, name: "Dark Choco Milk Tea" },
        { id: 61, name: "Okinawa Milk Tea" },
        { id: 62, name: "Wintermelon Milk Tea" },
        { id: 63, name: "Matcha Green Tea HC" },
        { id: 64, name: "Matcha Green Tea MC" },
        
        // Frappe
        { id: 65, name: "Matcha Green Tea Frappe" },
        { id: 66, name: "Salted Caramel Frappe" },
        { id: 67, name: "Strawberry Cheesecake Frappe" },
        { id: 68, name: "Mango Cheesecake Frappe" },
        { id: 69, name: "Strawberry Cream Frappe" },
        { id: 70, name: "Cookies & Cream Frappe" },
        { id: 71, name: "Rocky Road Frappe" },
        { id: 72, name: "Choco Fudge Frappe" },
        { id: 73, name: "Choco Mousse Frappe" },
        { id: 74, name: "Coffee Crumble Frappe" },
        { id: 75, name: "Vanilla Cream Frappe" },
        
        // Specialties
        { id: 76, name: "Special Bulalo" },
        { id: 77, name: "Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)" },
        { id: 78, name: "Paknet (Pakbet w/ Bagnet)" },
        { id: 79, name: "Sinigang (Pork)" },
        { id: 80, name: "Sinigang (Shrimp)" },
        { id: 81, name: "Buttered Shrimp" },
        { id: 82, name: "Kare-Kare" }
    ];
    
    // Find product name by ID
    const stockItem = stocksData.find(item => item.id === productId);
    const productName = stockItem ? stockItem.name : null;
    
    if (!productName) {
        // console.error('❌ Product not found with ID:', productId);
        showToast('❌ Product not found', 'error', 3000);
        return;
    }
    
    // Check if there's already a pending request for this product
    if (hasPendingRequest(productName)) {
        showToast(`⏳ Request already pending for ${productName}. Please wait for admin to process.`, 'warning', 3000);
        return;
    }
    
    // console.log('✅ Found product:', productName);
    
    // Show custom modal for quantity input
    showStockRequestModal(productName);
}

// ==================== CUSTOM STOCK REQUEST MODAL ====================
function showStockRequestModal(productName) {
    // Remove any existing modal
    const existingModal = document.getElementById('stockRequestModal');
    if (existingModal) existingModal.remove();
    
    // Create modal HTML
    const modalHTML = `
        <div id="stockRequestModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                border-radius: 12px;
                padding: 30px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                position: relative;
            ">
                <!-- Close Button -->
                <button onclick="closeStockRequestModal()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                " onmouseover="this.style.color='#333'" onmouseout="this.style.color='#999'">
                    ✕
                </button>
                
                <h2 style="margin: 0 0 20px; color: #333; font-size: 20px;">📦 Stock Request</h2>
                
                <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
                    Enter quantity to request for:
                </p>
                
                <div style="
                    background: #f5f5f5;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-weight: bold;
                    color: #0b5e8a;
                    text-align: center;
                ">
                    ${productName}
                </div>
                
                <input type="number" id="quantityInput" placeholder="Enter quantity" value="10" 
                    style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #ddd;
                        border-radius: 8px;
                        font-size: 16px;
                        box-sizing: border-box;
                        margin-bottom: 20px;
                    "
                    min="1" 
                    max="1000"
                />
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="closeStockRequestModal()" style="
                        flex: 1;
                        background: #f0f0f0;
                        color: #666;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">
                        Cancel
                    </button>
                    
                    <button onclick="submitStockRequestWithConfirm('${productName}')" style="
                        flex: 1;
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                        ✓ Submit
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insert modal into DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Focus on input and select default value
    setTimeout(() => {
        const input = document.getElementById('quantityInput');
        input.focus();
        input.select();
    }, 100);
    
    // Auto-submit on Enter key or when user finishes input
    const input = document.getElementById('quantityInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitStockRequestWithConfirm(productName);
        }
    });
    
    // Auto-submit after user stops typing (auto-confirm behavior)
    let autoSubmitTimeout;
    input.addEventListener('input', () => {
        clearTimeout(autoSubmitTimeout);
        autoSubmitTimeout = setTimeout(() => {
            // Auto-submit only if value is valid
            const quantity = input.value.trim();
            const quantityNum = parseInt(quantity);
            if (!isNaN(quantityNum) && quantityNum > 0 && quantityNum <= 1000) {
                submitStockRequestWithConfirm(productName);
            }
        }, 1500); // Auto-submit after 1.5 seconds of no typing
    });
}

function closeStockRequestModal() {
    const modal = document.getElementById('stockRequestModal');
    if (modal) modal.remove();
}

// ==================== AUTO-SUBMIT STOCK REQUEST ====================
function submitStockRequestWithConfirm(productName) {
    const input = document.getElementById('quantityInput');
    const quantity = input ? input.value.trim() : '';
    
    if (!quantity) {
        showToast('❌ Please enter a quantity', 'error', 2000);
        return;
    }
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
        showToast('❌ Please enter a valid quantity', 'error', 2000);
        return;
    }
    
    // Close the input modal and auto-submit
    closeStockRequestModal();
    
    // Directly submit without confirmation
    submitStockRequest(productName, quantityNum);
}

function submitStockRequest(productName, quantityNum) {
    
    // Double-check if request is still not pending (in case of rapid clicks)
    if (hasPendingRequest(productName)) {
        closeStockRequestModal();
        showToast(`⏳ Request already pending for ${productName}. Please wait for admin to process.`, 'warning', 3000);
        return;
    }
    
    closeStockRequestModal();
    
    // Save to MongoDB via API
    fetch('/api/stock-requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: productName,
            requestedQuantity: quantityNum,
            requestedBy: 'Staff',
            status: 'pending'
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Add to active stock requests
            activeStockRequests.set(productName, {
                timestamp: Date.now(),
                quantity: quantityNum,
                status: 'pending'
            });
            
            // console.log('✅ Stock request saved to MongoDB:', data);
            if (data.updated) {
                showToast(`🔄 Updated request: ${quantityNum} units`, 'success', 3000);
            } else {
                showToast(`✅ Stock request sent to admin!`, 'success', 3000);
            }
            
            // Increment request count for badge
            const count = (parseInt(localStorage.getItem('stockRequestCount')) || 0) + 1;
            localStorage.setItem('stockRequestCount', count);
            updateStockRequestNotification();
            
            // Update UI to show pending indicator
            renderMenu();
        } else {
            throw new Error(data.message || 'Failed to save request');
        }
    })
    .catch(err => {
        // console.error('❌ Error saving stock request:', err);
        showToast(`❌ Request failed: ${err.message}`, 'error', 3000);
    });
    
    if (!pendingStockRequests.includes(productName)) {
        pendingStockRequests.push(productName);
    }
}

// Function to check for fulfilled stock requests (called when stock is updated)
function checkFulfilledStockRequests(productName) {
    const product = productCatalog.find(p => p.name === productName);
    if (product && product.stock > 0 && activeStockRequests.has(productName)) {
        // Stock has been replenished by admin, remove from pending requests
        activeStockRequests.delete(productName);
        pendingStockRequests = pendingStockRequests.filter(name => name !== productName);
        renderMenu();
        showToast(`✅ Stock received for ${productName}!`, 'success', 3000);
    }
}

// ==================== � NOTIFICATION BADGE UPDATE ====================
function updateStockRequestNotification() {
    try {
        // Update badge in menu.js if it exists
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            const newCount = currentCount + 1;
            badge.textContent = newCount > 99 ? '99+' : newCount;
            badge.style.display = 'inline-flex';
            badge.style.animation = 'pulse 0.5s ease-in-out';
            
            // console.log('📢 Stock request notification badge updated!');
        }
        
        // Also save to localStorage to notify menu.js if on different page/window
        const stockRequestCount = (parseInt(localStorage.getItem('stockRequestCount')) || 0) + 1;
        localStorage.setItem('stockRequestCount', stockRequestCount);
        localStorage.setItem('lastStockRequest', new Date().toISOString());
        
        console.log('� Stock request saved to localStorage. Count:', stockRequestCount);
        
    } catch (error) {
        // console.log('Badge update error:', error.message);
    }
}

// ==================== �📋 CATEGORY FUNCTIONS ====================
function filterCategory(category) {
    currentCategory = category;
    
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    renderMenu();
}

function searchFood(searchTerm) {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    if (!searchTerm.trim()) {
        renderMenu();
        return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = productCatalog.filter(product => {
        if (currentCategory !== 'all' && product.category !== currentCategory) return false;
        return product.name.toLowerCase().includes(term);
    });
    
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                text-align: center;
                min-height: 300px;
                color: #666;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <h3 style="margin: 10px 0;">No Results Found</h3>
                <p style="margin: 10px 0;">No products match your search for "<strong>${term}</strong>"</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// ==================== 💾 STORAGE FUNCTIONS ====================
function saveInventoryToStorage() {
    localStorage.setItem('servingwareInventory', JSON.stringify(servingwareInventory));
    localStorage.setItem('ingredientInventory', JSON.stringify(ingredientInventory));
}

function loadInventoryFromStorage() {
    const saved = localStorage.getItem('servingwareInventory');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach(key => {
                if (servingwareInventory[key]) {
                    servingwareInventory[key].current = parsed[key].current;
                }
            });
        } catch (e) {}
    }
}

// Load active stock requests from localStorage
function loadActiveStockRequests() {
    const saved = localStorage.getItem('activeStockRequests');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            activeStockRequests = new Map(parsed);
        } catch (e) {}
    }
}

// ==================== SYNC PENDING REQUESTS WITH SERVER ====================
// Refresh pending requests from MongoDB to sync with admin actions
async function syncPendingRequests() {
    try {
        console.log('🔄 Syncing pending requests with server...');
        const response = await fetch('/api/stock-requests/pending');
        
        if (response.ok) {
            const result = await response.json();
            const pendingRequests = result.data || result || [];
            
            // Get list of product names in pending requests from server
            const serverPendingNames = new Set(
                pendingRequests.map(req => req.productName || req.product_name || '')
            );
            
            console.log('📋 Server pending requests:', serverPendingNames);
            
            // Remove any requests from activeStockRequests that are NOT on the server anymore
            // (meaning they were confirmed/rejected by admin)
            for (const [productName] of activeStockRequests) {
                if (!serverPendingNames.has(productName)) {
                    console.log(`✅ Clearing completed request for: ${productName}`);
                    activeStockRequests.delete(productName);
                }
            }
            
            // Save updated requests
            saveActiveStockRequests();
            
        } else {
            console.error('Failed to sync pending requests:', response.status);
        }
    } catch (error) {
        console.error('Error syncing pending requests:', error);
    }
}

// Call sync function periodically to clear completed requests
setInterval(syncPendingRequests, 10000); // Check every 10 seconds

// Save active stock requests to localStorage
function saveActiveStockRequests() {
    try {
        const toSave = Array.from(activeStockRequests.entries());
        localStorage.setItem('activeStockRequests', JSON.stringify(toSave));
    } catch (e) {}
}

// ==================== 🚀 INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async function() {
    // console.log('🚀 Initializing POS System...');
    
    loadInventoryFromStorage();
    loadActiveStockRequests();
    await getCurrentUser();
    
    // console.log('📋 Loading menu items from MongoDB...');
    const menuLoaded = await loadAllMenuItems();
    
    if (!menuLoaded) {
        alert('Cannot connect to database. Please check your connection.');
    }
    
    // Setup event listeners
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchFood(e.target.value));
    }
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        if (btn.id !== 'stockManagementBtn') {
            btn.addEventListener('click', () => {
                filterCategory(btn.dataset.category);
            });
        }
    });
    
    // Order type buttons
    const dineInBtn = document.querySelector('.dineinandtakeout-btn:nth-child(1)');
    const takeoutBtn = document.querySelector('.dineinandtakeout-btn:nth-child(2)');
    
    if (dineInBtn) dineInBtn.addEventListener('click', setDineIn);
    if (takeoutBtn) takeoutBtn.addEventListener('click', setTakeout);
    
    // Table number input
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.addEventListener('input', setTableNumber);
        // Initially disabled
        tableInput.disabled = true;
        tableInput.style.backgroundColor = '#f0f0f0';
        tableInput.style.opacity = '0.7';
        tableInput.style.pointerEvents = 'none';
        tableInput.placeholder = 'Select Dine In first';
    }
    
    // Payment method buttons
    const cashBtn = document.getElementById('cash-btn');
    const gcashBtn = document.getElementById('gcash-btn');
    
    if (cashBtn) cashBtn.addEventListener('click', () => selectPaymentMethod('cash'));
    if (gcashBtn) gcashBtn.addEventListener('click', () => selectPaymentMethod('gcash'));
    
    // Payment amount input
    const paymentInput = document.getElementById('inputPayment');
    if (paymentInput) {
        paymentInput.addEventListener('input', updatePaymentAmount);
        // Initially disabled
        paymentInput.disabled = true;
        paymentInput.style.backgroundColor = '#f0f0f0';
        paymentInput.style.opacity = '0.7';
        paymentInput.style.pointerEvents = 'none';
        paymentInput.placeholder = 'Select Cash first';
    }
    
    // Pay button
    const payButton = document.getElementById('payment-btn');
    if (payButton) {
        payButton.addEventListener('click', Payment);
    }
    
    renderMenu();
    updatePayButtonState();
    
    // Check for stock updates periodically
    setInterval(() => {
        // Check if any pending requests should be cleared (e.g., stock has been added)
        productCatalog.forEach(product => {
            if (product.stock > 0 && activeStockRequests.has(product.name)) {
                activeStockRequests.delete(product.name);
                pendingStockRequests = pendingStockRequests.filter(name => name !== product.name);
                saveActiveStockRequests();
                renderMenu();
            }
        });
    }, 5000);
    
    // console.log('✅ POS System initialized');
});

setInterval(saveInventoryToStorage, 30000);
setInterval(saveActiveStockRequests, 10000);

// ==================== 🎯 EXPORT GLOBAL FUNCTIONS ====================
window.requestStock = requestStock;
window.showStockRequestModal = showStockRequestModal;
window.closeStockRequestModal = closeStockRequestModal;
window.submitStockRequest = submitStockRequest;
window.setDineIn = setDineIn;
window.setTakeout = setTakeout;
window.selectPaymentMethod = selectPaymentMethod;
window.Payment = Payment;
window.clearCurrentOrder = clearCurrentOrder;
window.removeItemFromOrder = removeItemFromOrder;
window.filterCategory = filterCategory;
window.searchFood = searchFood;
window.handleLogout = handleLogout;
window.productCatalog = productCatalog;
window.pendingStockRequests = pendingStockRequests;
window.checkFulfilledStockRequests = checkFulfilledStockRequests;