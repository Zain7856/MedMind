/**
 * Header Component - Node.js Module
 * Generates header HTML and provides navigation configuration
 * Usage: node header.js
 */

class HeaderComponent {
  constructor(options = {}) {
    this.config = {
      logoIcon: options.logoIcon || '⚕️',
      logoText: options.logoText || 'MedCheck',
      brandUrl: options.brandUrl || '/',
      searchPlaceholder: options.searchPlaceholder || 'Search...',
      ...options
    };

    this.navigationItems = [
      { label: 'Home', href: '/', active: true },
      { label: 'About', href: '/about', active: false },
      { label: 'Diseases', href: '/diseases', active: false },
      { label: 'Doctors', href: '/doctors', active: false },
      { label: 'Contact', href: '/contact', active: false }
    ];
  }

  /**
   * Generate complete header HTML string
   */
  generateHTML() {
    return `<header id="header" class="header">
  <div class="container">
    <div class="header-content flex flex-between">
      <!-- LOGO/BRAND -->
      <div class="header-logo">
        <a href="${this.config.brandUrl}" class="logo-link">
          <span class="logo-icon">${this.config.logoIcon}</span>
          <span class="logo-text">${this.config.logoText}</span>
        </a>
      </div>

      <!-- HAMBURGER MENU (Mobile) -->
      <button id="hamburger-btn" class="hamburger-btn hide-desktop" aria-label="Toggle menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- NAVIGATION MENU -->
      <nav id="nav-menu" class="nav-menu">
        <ul class="nav-list flex flex-col">
          ${this.navigationItems.map(item => `
          <li class="nav-item">
            <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}">${item.label}</a>
          </li>`).join('')}
        </ul>
      </nav>

      <!-- HEADER ACTIONS -->
      <div class="header-actions flex flex-center">
        <!-- SEARCH BAR -->
        <div class="search-wrapper hide-mobile">
          <input 
            type="search" 
            id="search-input" 
            class="search-input" 
            placeholder="${this.config.searchPlaceholder}"
            aria-label="Search"
          >
          <button class="search-btn" aria-label="Search button">🔍</button>
        </div>

        <!-- USER ACCOUNT -->
        <div id="user-account" class="user-account hidden">
          <button id="user-btn" class="user-btn" aria-label="User account">
            <span class="user-icon">👤</span>
            <span class="user-name hide-mobile">Account</span>
          </button>
          
          <!-- USER DROPDOWN MENU -->
          <div id="user-dropdown" class="user-dropdown hidden">
            <a href="/profile" class="dropdown-item">Profile</a>
            <a href="/my-tests" class="dropdown-item">My Tests</a>
            <a href="/bookings" class="dropdown-item">My Bookings</a>
            <hr class="dropdown-divider">
            <button id="logout-btn" class="dropdown-item logout-item">Logout</button>
          </div>
        </div>

        <!-- AUTH BUTTONS (when not logged in) -->
        <div id="auth-buttons" class="auth-buttons flex flex-center">
          <a href="/signin" class="btn btn-ghost">Sign In</a>
          <a href="/signup" class="btn btn-primary">Sign Up</a>
        </div>
      </div>
    </div>
  </div>
</header>`;
  }

  /**
   * Generate header HTML with embedded JavaScript
   */
  generateHTMLWithScript() {
    return `${this.generateHTML()}

<script>
  // Header Client-Side Script
  class HeaderComponent {
    constructor() {
      this.hamburgerBtn = document.getElementById('hamburger-btn');
      this.navMenu = document.getElementById('nav-menu');
      this.userBtn = document.getElementById('user-btn');
      this.userDropdown = document.getElementById('user-dropdown');
      this.logoutBtn = document.getElementById('logout-btn');
      this.authButtons = document.getElementById('auth-buttons');
      this.userAccount = document.getElementById('user-account');
      this.searchInput = document.getElementById('search-input');
      this.searchBtn = document.querySelector('.search-btn');
      this.navLinks = document.querySelectorAll('.nav-link');

      this.init();
    }

    init() {
      this.setupEventListeners();
      this.checkAuthStatus();
      this.updateActiveLink();
    }

    setupEventListeners() {
      if (this.hamburgerBtn) {
        this.hamburgerBtn.addEventListener('click', () => this.toggleMobileMenu());
      }

      if (this.userBtn) {
        this.userBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleUserDropdown();
        });
      }

      document.addEventListener('click', (e) => {
        if (this.userDropdown && !e.target.closest('.user-account')) {
          this.userDropdown.classList.add('hidden');
        }
      });

      if (this.logoutBtn) {
        this.logoutBtn.addEventListener('click', () => this.logout());
      }

      if (this.searchBtn) {
        this.searchBtn.addEventListener('click', () => this.performSearch());
      }

      if (this.searchInput) {
        this.searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.performSearch();
        });
      }

      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
    }

    toggleMobileMenu() {
      this.hamburgerBtn.classList.toggle('active');
      this.navMenu.classList.toggle('active');
    }

    closeMobileMenu() {
      this.hamburgerBtn.classList.remove('active');
      this.navMenu.classList.remove('active');
    }

    toggleUserDropdown() {
      this.userDropdown.classList.toggle('hidden');
    }

    performSearch() {
      const query = this.searchInput.value.trim();
      if (query) {
        window.location.href = '/search?q=' + encodeURIComponent(query);
      }
    }

    checkAuthStatus() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
          this.authButtons.classList.add('hidden');
          this.userAccount.classList.remove('hidden');
          const userNameElement = this.userBtn.querySelector('.user-name');
          if (userNameElement) {
            userNameElement.textContent = user.full_name || user.email.split('@')[0] || 'User';
          }
        } else {
          this.authButtons.classList.remove('hidden');
          this.userAccount.classList.add('hidden');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }

    logout() {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }

    updateActiveLink() {
      const currentPath = window.location.pathname;
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (href === '/' && currentPath === '/')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.headerComponent = new HeaderComponent();
    });
  } else {
    window.headerComponent = new HeaderComponent();
  }
</script>`;
  }

  /**
   * Get header as JSON
   */
  getJSON() {
    return {
      brand: {
        icon: this.config.logoIcon,
        text: this.config.logoText,
        url: this.config.brandUrl
      },
      navigation: this.navigationItems,
      search: {
        placeholder: this.config.searchPlaceholder
      }
    };
  }

  /**
   * Set active navigation item by path
   */
  setActiveNav(path) {
    this.navigationItems.forEach(item => {
      item.active = item.href === path;
    });
  }

  /**
   * Add navigation item
   */
  addNavItem(label, href) {
    this.navigationItems.push({
      label,
      href,
      active: false
    });
  }

  /**
   * Remove navigation item by href
   */
  removeNavItem(href) {
    this.navigationItems = this.navigationItems.filter(item => item.href !== href);
  }

  /**
   * Get all navigation items
   */
  getNavItems() {
    return this.navigationItems;
  }

  /**
   * Update navigation item
   */
  updateNavItem(href, updates) {
    const item = this.navigationItems.find(item => item.href === href);
    if (item) {
      Object.assign(item, updates);
    }
  }

  /**
   * Print header HTML to console
   */
  print() {
    console.log(this.generateHTML());
  }

  /**
   * Write header HTML to file
   */
  toFile(filepath) {
    const fs = require('fs');
    fs.writeFileSync(filepath, this.generateHTML(), 'utf8');
    console.log(`Header HTML written to: ${filepath}`);
  }
}

// Example usage when run as standalone script
if (require.main === module) {
  console.log('='.repeat(60));
  console.log('Header Component - Node.js Module');
  console.log('='.repeat(60));
  console.log('\n');

  // Create instance
  const header = new HeaderComponent({
    logoIcon: '⚕️',
    logoText: 'MedCheck',
    brandUrl: '/'
  });

  // Print navigation structure
  console.log('Navigation Items:');
  console.log(JSON.stringify(header.getNavItems(), null, 2));
  console.log('\n');

  // Print as JSON
  console.log('Header JSON Configuration:');
  console.log(JSON.stringify(header.getJSON(), null, 2));
  console.log('\n');

  // Example: Save to file
  console.log('To save header HTML to a file, use:');
  console.log('  const header = new HeaderComponent();');
  console.log('  header.toFile("./header.html");');
  console.log('\n');

  console.log('='.repeat(60));
}

// Export for use as module in Express/Node.js
module.exports = HeaderComponent;