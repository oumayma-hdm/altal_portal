<?php

namespace Drupal\altal_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a footer block.
 *
 * @Block(
 *   id = "altal_footer_block1",
 *   admin_label = @Translation("Altal Footer Block"),
 *   category = @Translation("Altal Layout")
 * )
 */
class FooterBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'footer_logo' => '',
      'footer_text' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['footer_logo'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Footer Logo URL'),
      '#default_value' => $this->configuration['footer_logo'],
      '#description' => $this->t('Enter the URL of the footer logo.'),
    ];

    $form['footer_text'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Footer Text'),
      '#default_value' => $this->configuration['footer_text'],
      '#description' => $this->t('Enter the footer text.'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['footer_logo'] = $form_state->getValue('footer_logo');
    $this->configuration['footer_text'] = $form_state->getValue('footer_text');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'altal_footer_block',
      '#footer_logo' => $this->configuration['footer_logo'],
      '#footer_text' => $this->configuration['footer_text'],
      '#cache' => [
        'max-age' => 0,
      ],
      '#label_display' => 'hidden',
    ];
  }

}
