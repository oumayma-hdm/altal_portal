<?php

namespace Drupal\altal_layout\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\system\Entity\Menu;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\file\Entity\File;
use Drupal\Core\Url;

/**
 * Provides the Altal Header block.
 *
 * @Block(
 *   id = "altal_header_block",
 *   admin_label = @Translation("Altal Header"),
 *   category = @Translation("Altal Layout")
 * )
 */
class HeaderBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'menu_name' => 'main',
      'header_logo' => '',
      'header_logo_path' => '',
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();

    // Get all available menus for dropdown options
    $menus = Menu::loadMultiple();
    $menu_options = [];
    foreach ($menus as $menu_name => $menu) {
      $menu_options[$menu_name] = $menu->label();
    }

    $form['menu_name'] = [
      '#type' => 'select',
      '#title' => $this->t('Menu to display'),
      '#description' => $this->t('Select which menu to display in the header navigation.'),
      '#options' => $menu_options,
      '#default_value' => $config['menu_name'],
      '#required' => TRUE,
    ];
    
    // Add a logo upload field
    $form['header_logo'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Header Logo'),
      '#description' => $this->t('Upload a logo for the header. If not provided, the default logo will be used.'),
      '#upload_location' => 'public://header_logos/',
      '#upload_validators' => [
        'file_validate_extensions' => ['png jpg jpeg svg gif'],
        'file_validate_image_resolution' => ['3840x2160', '32x32'],
      ],
      '#default_value' => !empty($config['header_logo']) ? [$config['header_logo']] : NULL,
      '#required' => FALSE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['menu_name'] = $form_state->getValue('menu_name');
    
    // Handle the logo upload
    $logo = $form_state->getValue('header_logo');
    $this->configuration['header_logo'] = $logo[0] ?? '';
    
    // Save the file as permanent if it's not already
    if (!empty($this->configuration['header_logo'])) {
      $file = File::load($this->configuration['header_logo']);
      if ($file) {
        $file->setPermanent();
        $file->save();
        $file_url = $file->createFileUrl(FALSE);
        $this->configuration['header_logo_path'] = $file_url;
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();
    $menu_name = $config['menu_name'];
    
    // Get the menu tree
    $menu_tree = \Drupal::menuTree();
    $parameters = new MenuTreeParameters();
    $parameters->setMinDepth(1);
    $parameters->onlyEnabledLinks();
    
    $tree = $menu_tree->load($menu_name, $parameters);
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menu_tree->transform($tree, $manipulators);
    $menu = $menu_tree->build($tree);
    
    // Prepare the logo URL
    $header_logo = NULL;
    if (!empty($config['header_logo'])) {
      $file = File::load($config['header_logo']);
      if ($file) {
        $header_logo = $file->createFileUrl(FALSE);
      }
    }
    
    return [
      '#theme' => 'altal_header',
      '#menu_name' => $menu_name,
      '#header_menu' => $menu,
      '#header_logo' => $header_logo,
      '#cache' => ['max-age' => 0], // disable caching while developing
    ];
  }

}
