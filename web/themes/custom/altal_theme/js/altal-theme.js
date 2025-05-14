/**
 * @file
 * Altal Theme behaviors.
 */
(function (Drupal, $) {

  'use strict';

  Drupal.behaviors.altalTheme = {
    attach: function () {
      $('.mobile-menu-toggle').once('altal-mobile-toggle').on('click', function (e) {
        e.preventDefault();
        console.log('Menu toggle clicked');
        $('.mobile-menu').toggleClass('active');
        var expanded = $(this).attr('aria-expanded') === 'true';
        $(this).attr('aria-expanded', !expanded);
      });
    }
  };

}(Drupal, jQuery));
