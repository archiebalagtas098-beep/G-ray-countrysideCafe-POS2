import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  // Personal Information
  fullName: {
    type: String,
    default: ''
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true
  },
  phone: String,

  // Business Settings
  businessName: {
    type: String,
    default: "G'RAY COUNTRYSIDE CAFÉ"
  },
  businessAddress: String,
  businessCity: String,
  businessPhone: String,
  vatRegNo: String,
  permitNo: String,
  receiptHeader: String,

  // Display Preferences
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  language: {
    type: String,
    enum: ['en', 'tl', 'es'],
    default: 'en'
  },
  dateFormat: {
    type: String,
    default: 'MM/DD/YYYY'
  },
  timeFormat: {
    type: String,
    enum: ['12h', '24h'],
    default: '12h'
  },
  currency: {
    type: String,
    default: 'PHP'
  },

  // Notification Settings
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: false
    },
    lowStockAlerts: {
      type: Boolean,
      default: true
    },
    orderNotifications: {
      type: Boolean,
      default: true
    },
    systemAlerts: {
      type: Boolean,
      default: true
    }
  },

  // Security Settings
  twoFactorAuth: {
    type: Boolean,
    default: false
  },
  lastPasswordChange: Date,
  passwordExpiryDays: {
    type: Number,
    default: 90
  },
  sessionTimeout: {
    type: Number,
    default: 30, // minutes
    min: 15,
    max: 480
  },

  // Operational Settings
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  timezone: {
    type: String,
    default: 'Asia/Manila'
  },

  // Financial Settings
  taxRate: {
    type: Number,
    default: 0.12, // 12%
    min: 0,
    max: 1
  },
  discountPolicy: {
    allowManualDiscounts: {
      type: Boolean,
      default: true
    },
    maxDiscountPercentage: {
      type: Number,
      default: 50
    }
  },

  // Inventory Settings
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  autoReorderEnabled: {
    type: Boolean,
    default: false
  },

  // Receipt & Printing Settings
  receiptSettings: {
    includeCompanyLogo: {
      type: Boolean,
      default: true
    },
    includeQRCode: {
      type: Boolean,
      default: false
    },
    paperWidth: {
      type: String,
      enum: ['58mm', '80mm'],
      default: '80mm'
    },
    printFooterMessage: String
  },

  // API & Integration Settings
  apiSettings: {
    apiKey: {
      type: String,
      default: null
    },
    enableExternalIntegrations: {
      type: Boolean,
      default: false
    }
  },

  // Backup Settings
  autoBackup: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    lastBackup: Date
  },

  // Status & Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'settings'
});

// Index for efficient queries
settingsSchema.index({ userId: 1 });
settingsSchema.index({ isActive: 1 });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
