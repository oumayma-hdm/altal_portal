/**
 * Mobile menu functionality for Altal Layout
 */
(function ($) {
  'use strict';

  // Simple jQuery document ready function
  $(document).ready(function() {
    // console.log('Document ready - simple jQuery approach');
    
    // Mobile menu toggle
    $('.mobile-menu-toggle').click(function(e) {
      e.preventDefault();
     
      $('.mobile-menu').toggleClass('d-none');
      console.log('Menu toggle clicked - simple jQuery');
    });
    
    // Search toggle
    $('.mobile-search-toggle').click(function(e) {
      e.preventDefault();
      $('.mobile-search-form').toggleClass('d-none');
      
      // Hide menu if open
      $('.mobile-menu').addClass('d-none');
    });
    
    // Close when clicking outside
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.mobile-menu, .mobile-menu-toggle').length) {
        $('.mobile-menu').addClass('d-none');
      }
    });
  });

})(jQuery);