<?php

declare(strict_types=1);

/**
 * @file
 * Theme settings form for Altal Theme theme.
 */

use Drupal\Core\Form\FormState;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function altal_theme_form_system_theme_settings_alter(array &$form, FormState $form_state): void {

  $form['altal_theme'] = [
    '#type' => 'details',
    '#title' => t('Altal Theme'),
    '#open' => TRUE,
  ];

  $form['altal_theme']['example'] = [
    '#type' => 'textfield',
    '#title' => t('Example'),
    '#default_value' => theme_get_setting('example'),
  ];

}
