// ==================== 🔐 SESSION MANAGER ====================
// Manages user session across browser windows and tabs
// Stores role and maintains persistent session state

class SessionManager {
    constructor() {
        this.roleKey = 'userRole';
        this.isLoggedInKey = 'isLoggedIn';
        this.lastActivityKey = 'lastActivity';
        this.init();
    }

    // Initialize session manager
    init() {
        this.listenForStorageChanges();
        this.setupBeforeUnload();
    }

    // Set user role (admin or staff)
    setRole(role) {
        if (['admin', 'staff'].includes(role)) {
            sessionStorage.setItem(this.roleKey, role);
            sessionStorage.setItem(this.isLoggedInKey, 'true');
            sessionStorage.setItem(this.lastActivityKey, new Date().toISOString());
            console.log(`✅ User role set to: ${role}`);
            return true;
        }
        return false;
    }

    // Get current user role
    getRole() {
        return sessionStorage.getItem(this.roleKey);
    }

    // Check if user is logged in
    isLoggedIn() {
        return sessionStorage.getItem(this.isLoggedInKey) === 'true';
    }

    // Clear session (on logout)
    clearSession() {
        sessionStorage.removeItem(this.roleKey);
        sessionStorage.removeItem(this.isLoggedInKey);
        sessionStorage.removeItem(this.lastActivityKey);
        console.log('🔓 Session cleared');
    }

    // Get appropriate dashboard URL based on role
    getDashboardUrl() {
        const role = this.getRole();
        if (role === 'admin') {
            return '/admindashboard/dashboard';
        } else if (role === 'staff') {
            return '/staffdashboard';
        }
        return '/login';
    }

    // Listen for storage changes from other tabs
    listenForStorageChanges() {
        window.addEventListener('storage', (event) => {
            if (event.key === this.roleKey) {
                console.log('🔄 Role changed in another tab: ' + event.newValue);
            }
            if (event.key === this.isLoggedInKey) {
                if (!event.newValue) {
                    console.log('📴 User logged out in another tab');
                }
            }
        });
    }

    // Track last activity for session timeout (optional)
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem(this.lastActivityKey, new Date().toISOString());
        });
    }

    // Update last activity timestamp
    updateActivity() {
        sessionStorage.setItem(this.lastActivityKey, new Date().toISOString());
    }

    // Get last activity time
    getLastActivity() {
        const lastActivity = sessionStorage.getItem(this.lastActivityKey);
        return lastActivity ? new Date(lastActivity) : null;
    }

    // ==================== USER PROFILE DISPLAY ====================
    // Generate user profile HTML with avatar and role
    getUserProfileHTML() {
        const role = this.getRole();
        if (!role) return '';

        // Create avatar with first letter of role
        const avatarLetter = role.charAt(0).toUpperCase();
        const roleBadge = role.charAt(0).toUpperCase() + role.slice(1);

        return `
            <div class="user-profile-container">
                <div class="user-avatar">
                    ${avatarLetter}
                </div>
                <div class="user-info">
                    <span class="user-role">${roleBadge}</span>
                </div>
            </div>
        `;
    }

    // Initialize user profile in navbar
    initializeUserProfile() {
        try {
            const logoutContainer = document.querySelector('.logout-container');
            if (!logoutContainer) {
                console.warn('⚠️ Logout container not found for user profile');
                return;
            }

            const profileHTML = this.getUserProfileHTML();
            if (!profileHTML) {
                console.warn('⚠️ No user role found for profile');
                return;
            }

            // Insert user profile before the logout button
            const profileDiv = document.createElement('div');
            profileDiv.innerHTML = profileHTML;
            
            // Insert profile before the logout button
            const logoutBtn = logoutContainer.querySelector('button');
            if (logoutBtn) {
                logoutBtn.parentNode.insertBefore(profileDiv.firstElementChild, logoutBtn);
            } else {
                logoutContainer.appendChild(profileDiv.firstElementChild);
            }

            console.log('✅ User profile initialized in navbar');
        } catch (error) {
            console.error('❌ Error initializing user profile:', error);
        }
    }

    // ==================== LOGOUT FUNCTION ====================
    // Handle user logout and redirect to login page
    logout() {
        try {
            console.log('🔓 Logging out user...');
            
            // Clear session storage
            this.clearSession();
            
            // Make logout API call to clear server session
            fetch('/logout', {
                method: 'GET',
                credentials: 'include'
            }).then(response => {
                console.log('✅ Logout request sent to server');
                // Redirect to login page
                window.location.href = '/login';
            }).catch(error => {
                console.error('❌ Logout error:', error);
                // Still redirect even if API call fails
                window.location.href = '/login';
            });
        } catch (error) {
            console.error('❌ Error during logout:', error);
            window.location.href = '/login';
        }
    }
}

// Create global instance
const sessionManager = new SessionManager();

console.log('🔐 Session Manager initialized');

// ==================== GLOBAL LOGOUT HANDLER ====================
// Called from onclick="handleLogout()" in navbar buttons
function handleLogout() {
    sessionManager.logout();
}

// Initialize user profile when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    sessionManager.initializeUserProfile();
});
