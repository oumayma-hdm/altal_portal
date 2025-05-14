/**
 * @file
 * Altal portal custom scripts.
 */

// Ensure header visibility on load
document.addEventListener('DOMContentLoaded', function() {
  // Force header visibility
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    siteHeader.style.display = 'block';
    console.log('Header visibility enforced via JS');
  }
  
  // Check if Bootstrap is loaded
  if (typeof bootstrap === 'undefined') {
    console.error('Bootstrap is not loaded. Menu functionality will be limited.');
  } else {
    console.log('Bootstrap is loaded. Version:', bootstrap.Tooltip.VERSION);
  }
  
  // Initialize sticky header right away
  initStickyHeader();
});

// Initialize sticky header behavior
function initStickyHeader() {
  const siteHeader = document.querySelector('.site-header');
  const headerHeight = siteHeader ? siteHeader.offsetHeight : 80;
  
  // Store last scroll position to determine scroll direction
  let lastScrollTop = 0;
  
  // Function to handle scroll
  function handleScroll() {
    if (!siteHeader) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Make header sticky when scrolling down past threshold
    if (scrollTop > 50) {
      siteHeader.classList.add('sticky');
      document.body.classList.add('has-sticky-header');
    } else {
      siteHeader.classList.remove('sticky');
      document.body.classList.remove('has-sticky-header');
    }
    
    // Store current scroll position
    lastScrollTop = scrollTop;
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Handle resize events to recalculate header height
  window.addEventListener('resize', function() {
    if (siteHeader && document.body.classList.contains('has-sticky-header')) {
      document.body.style.paddingTop = siteHeader.offsetHeight + 'px';
    }
  });
  
  // Initial check in case page loads scrolled down
  handleScroll();
}

// Global function to toggle mobile menu
window.toggleMobileMenu = function(event) {
  if (event) {
    event.preventDefault();
  }
  
  // Get the mobile menu element
  var mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenu) {
    // Check if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
      try {
        // Try to use Bootstrap's API
        var offcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
        if (!offcanvas) {
          offcanvas = new bootstrap.Offcanvas(mobileMenu);
        }
        offcanvas.toggle();
        console.log('Bootstrap offcanvas toggled');
      } catch (e) {
        console.log('Bootstrap error:', e);
        // Fallback to manual toggle
        manualToggleMobileMenu(mobileMenu);
      }
    } else {
      // Bootstrap not available, use manual toggle
      manualToggleMobileMenu(mobileMenu);
    }
  } else {
    console.error('Mobile menu element not found!');
  }
};

// Manual toggle function as fallback
function manualToggleMobileMenu(menuElement) {
  // Check if menu is visible
  var isVisible = menuElement.classList.contains('show');
  
  if (isVisible) {
    // Hide menu
    menuElement.classList.remove('show');
    menuElement.style.visibility = 'hidden';
    document.body.classList.remove('offcanvas-open');
    
    // Remove overlay
    var overlay = document.querySelector('.offcanvas-backdrop');
    if (overlay) {
      overlay.remove();
    }
  } else {
    // Show menu
    menuElement.classList.add('show');
    menuElement.style.visibility = 'visible';
    menuElement.style.transform = 'translateX(0)';
    document.body.classList.add('offcanvas-open');
    
    // Add overlay
    var overlay = document.createElement('div');
    overlay.className = 'offcanvas-backdrop fade show';
    document.body.appendChild(overlay);
    
    // Add click handler to close when clicking overlay
    overlay.addEventListener('click', function() {
      manualToggleMobileMenu(menuElement);
    });
  }
}

(function ($, Drupal, once) {
  'use strict';

  Drupal.behaviors.altalTheme = {
    attach: function (context, settings) {
      once('altalTheme', 'html', context).forEach(function () {
        // Initialize all Bootstrap components
        if (typeof bootstrap !== 'undefined') {
          var offcanvasElements = [].slice.call(document.querySelectorAll('.offcanvas'));
          offcanvasElements.forEach(function (offcanvasEl) {
            new bootstrap.Offcanvas(offcanvasEl);
          });
        }

        // Initialize sticky header - use the global function
        if (typeof initStickyHeader === 'function') {
          initStickyHeader();
        }

        // Add active class to current nav item
        var path = window.location.pathname;
        $('.navbar-nav .nav-link, .mobile-navigation .nav-link').each(function() {
          var href = $(this).attr('href');
          if (href === path || href === path.replace(/\/$/, '')) {
            $(this).addClass('is-active');
          }
        });

        // Only initialize features if the required libraries are available
        
        // Initialize select elements
        if ($.fn.selectpicker) {
          $('.selectpicker', context).selectpicker();
        }
        
        if ($.fn.multiselect) {
          $('.multiselect', context).multiselect();
        }

        // Initialize Masonry layouts if available
        if ($.fn.masonry) {
          $('.masonry-grid', context).masonry({
            itemSelector: '.masonry-item',
            columnWidth: '.masonry-sizer',
            percentPosition: true
          });
        }

        // Removed Slick and Swiper initialization since libraries are missing
        
        // Removed WOW.js initialization since library is missing
        
        // Initialize waypoints if available
        if ($.fn.waypoint) {
          $('.waypoint').waypoint(function() {
            // Your waypoint code here
          });
        }
      });
    }
  };

  Drupal.behaviors.altalHeader = {
    attach: function (context, settings) {
      // Close search box when clicking outside
      $(document, context).once('searchClickOutside').on('click', function(e) {
        if (!$(e.target).closest('#searchBox, .search-toggle').length) {
          $('#searchBox').collapse('hide');
        }
      });
      
      // Mobile menu toggle functionality
      $('.menu-toggle, .menu-toggle-btn', context).once('mobileMenuToggle').on('click', function() {
        $(this).toggleClass('active');
        
        // For accessibility
        var expanded = $(this).attr('aria-expanded') === 'true' || false;
        $(this).attr('aria-expanded', !expanded);
      });
      
      // Close mobile menu when clicking on a menu item (if it's a link to another page)
      $('.mobile-menu .nav-link, .mobile-menu a', context).once('mobileMenuItemClick').on('click', function() {
        // Only close if it's a direct link, not a dropdown toggle
        if (!$(this).hasClass('dropdown-toggle')) {
          try {
            var offcanvasElement = document.getElementById('mobileMenu');
            if (offcanvasElement && typeof bootstrap !== 'undefined') {
              var offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
              if (offcanvasInstance) {
                offcanvasInstance.hide();
              } else {
                // Use Bootstrap's offcanvas method or fallback to manual toggling
                try {
                  // Try Bootstrap's method first
                  if ($(offcanvasElement).offcanvas) {
                    $(offcanvasElement).offcanvas('hide');
                  } else {
                    // Manual fallback
                    offcanvasElement.classList.remove('show');
                    document.body.classList.remove('offcanvas-open');
                    var backdrop = document.querySelector('.offcanvas-backdrop');
                    if (backdrop) backdrop.remove();
                  }
                } catch(e) {
                  console.log('Error with offcanvas fallback:', e);
                }
              }
            }
            // Also reset the toggle button state
            $('.menu-toggle, .menu-toggle-btn').removeClass('active');
          } catch(e) {
            console.log('Error closing mobile menu:', e);
          }
        }
      });
      
      // Initialize Bootstrap 5 components
      if (typeof bootstrap !== 'undefined') {
        // Initialize all dropdowns
        var dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElements.forEach(function(dropdownEl) {
          try {
            new bootstrap.Dropdown(dropdownEl);
          } catch(e) {
            console.log('Error initializing dropdown:', e);
          }
        });
        
        // Initialize tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
          return new bootstrap.Popover(popoverTriggerEl);
        });
      }
    }
  };

  // Direct initialization for mobile menu
  $(document).ready(function() {
    // Initialize the mobile menu offcanvas directly
    var mobileMenuEl = document.getElementById('mobileMenu');
    if (mobileMenuEl && typeof bootstrap !== 'undefined') {
      try {
        var offcanvas = new bootstrap.Offcanvas(mobileMenuEl, {
          backdrop: true
        });
        
        // Add click event to the menu toggle buttons
        $('.menu-toggle-btn').on('click', function(e) {
          e.preventDefault();
          offcanvas.show();
          
          // Add visible active state to the button
          $(this).addClass('active');
        });
        
        // Reset button state when offcanvas is hidden
        $(mobileMenuEl).on('hidden.bs.offcanvas', function () {
          $('.menu-toggle-btn').removeClass('active');
        });
        
        // Make sure menu items in the navbar-nav structure work correctly
        $('.mobile-menu .navbar-nav .nav-link').on('click', function() {
          // Only close if it's a direct link, not a dropdown toggle
          if (!$(this).hasClass('dropdown-toggle')) {
            offcanvas.hide();
          }
        });
        
        // Fix any styling issues with Drupal-generated menus
        $('.navbar-nav.nav-level-0').each(function() {
          // Ensure proper list styles
          $(this).find('.nav-item').css('margin-bottom', '4px');
          
          // Fix active links
          $(this).find('.nav-link.is-active').addClass('active');
        });
        
        // Force button visibility on small screens
        if (window.innerWidth < 768) {
          $('.menu-toggle-btn').css('display', 'flex');
        }
      } catch(e) {
        console.log('Error initializing mobile menu:', e);
      }
    }
  });

  // Global function to toggle mobile menu was moved to global scope

  Drupal.behaviors.mobileDrupalMenu = {
    attach: function (context, settings) {
      once('mobileDrupalMenu', 'html', context).forEach(function () {
        // Initialize Bootstrap components
        if (typeof bootstrap !== 'undefined') {
          // Initialize all offcanvas elements
          document.querySelectorAll('.offcanvas').forEach(function (offcanvasEl) {
            new bootstrap.Offcanvas(offcanvasEl);
          });
          
          // Initialize all dropdowns
          document.querySelectorAll('.dropdown-toggle').forEach(function (dropdownEl) {
            new bootstrap.Dropdown(dropdownEl);
          });
        }
        
        // Add click handlers for mobile menu dropdowns
        $('.mobile-navigation .nav-item.dropdown > a').once('mobileDropdown').on('click', function(e) {
          if (window.innerWidth < 992) {
            e.preventDefault();
            var $this = $(this);
            var $parent = $this.parent();
            var $dropdown = $this.next('.dropdown-menu');
            
            // Toggle this dropdown
            if ($dropdown.is(':visible')) {
              $dropdown.slideUp(200);
              $parent.removeClass('show');
              $this.attr('aria-expanded', 'false');
            } else {
              $dropdown.slideDown(200);
              $parent.addClass('show');
              $this.attr('aria-expanded', 'true');
            }
          }
        });
        
        // Add active class to current page in menu
        var currentPath = window.location.pathname;
        $('.mobile-navigation .nav-link, .main-navigation .nav-link').each(function() {
          var href = $(this).attr('href');
          if (href === currentPath || (href !== '/' && currentPath.indexOf(href) === 0)) {
            $(this).addClass('is-active');
            
            // If in dropdown, also add active to parent
            var $parent = $(this).closest('.dropdown');
            if ($parent.length) {
              $parent.find('> .nav-link').addClass('is-active');
            }
          }
        });
        
        // Properly size offcanvas on small screens
        var sizeMobileMenu = function() {
          var mobileMenu = document.getElementById('mobileMenu');
          if (mobileMenu) {
            if (window.innerWidth < 576) {
              mobileMenu.style.width = (window.innerWidth * 0.8) + 'px';
            } else {
              mobileMenu.style.width = '300px';
            }
          }
        };
        
        // Initial sizing and window resize handling
        sizeMobileMenu();
        window.addEventListener('resize', sizeMobileMenu);
      });
    }
  };

})(jQuery, Drupal, once);