<?php
/**
 * ########################################################################
 * PHP class for Typesetter CMS plugin Simple Button
 * Author: J. Krausz
 * Date: 2019-10-22
 * Version 1.1
 * ########################################################################
 */

defined('is_running') or die('Not an entry point...');

class SimpleButton{

  static $buttonConfig;

  /**
   * Typesetter action hook
   */
  static function GetHead(){
    global $page, $addonRelativeCode;
    self::LoadConfig();
    $page->css_user[] = $addonRelativeCode . '/SimpleButton.css';
    if( empty(self::$buttonConfig['presetName']) || self::$buttonConfig['presetName'] == 'default' ){
      $page->css_user[] = $addonRelativeCode . '/SimpleButton_default.css';
    }
    common::LoadComponents('fontawesome');
  }



  /**
   * Typesetter filter hook
   */
  static function SectionTypes($section_types){
    $section_types['simple_button'] = array();
    $section_types['simple_button']['label'] = 'Simple Button';
    return $section_types;
  }



  /**
   * Typesetter filter hook
   */
  static function NewSections($links){
    global $addonRelativeCode;
    /* add section icon */
    foreach( $links as $key => $section_type_arr ){
      if( $section_type_arr[0] == 'simple_button' ){
        $links[$key] = array(
          'simple_button', 
          $addonRelativeCode . '/icons/ui-icon.png'
        );
        break;
      }
    }
    return $links;
  }



  /**
   * Typesetter filter hook
   */
  static function DefaultContent($default_content, $type){
    if( $type != 'simple_button' ) {
      return $default_content;
    }
    self::LoadConfig();
    $defaultClasses = isset(self::$buttonConfig['buttonDefaults']) 
      ? ' ' . self::$buttonConfig['buttonDefaults'] 
      : '';
    $newSection = array();
    $newSection['content']  = '<div class="sb-wrapper sb-center sb-middle">';
    $newSection['content'] .=   '<a target="_self" class="btn' . htmlspecialchars($defaultClasses) . '" href="#">';
    $newSection['content'] .=     '<span class="sb-buttontext">Button Text</span>';
    $newSection['content'] .=   '</a>';
    $newSection['content'] .= '</div>';
    // $newSection['attributes'] = array( 'style' => 'padding-top:0.5em; padding-bottom:0.5em;' );
    return $newSection;
  }



  /**
   * Typesetter filter hook
   */
  static function SaveSection($return, $section, $type){
    global $page;
    if( $type != 'simple_button' ){
      return $return;
    }
    $content =& $_POST['gpcontent'];
    $page->file_sections[$section]['content'] = $content;
    return true;
  }



  /**
   * Typesetter filter hook
   */
  static function InlineEdit_Scripts($scripts, $type){
    global $page, $addonFolderName, $addonRelativeCode, $addonPathCode, $addonPathData, $config;
    if( $type !== 'simple_button' ) {
      return $scripts;
    }

    self::LoadConfig();

    // autocomplete
    includeFile('tool/editing.php');
    echo gp_edit::AutoCompleteValues(true);

    // FontAwesome class names for iconpicker
    $scripts[] = $addonRelativeCode . '/FontAwesomeClassNames.js';

    $addonBasePath = (strpos($addonRelativeCode,'addons/') !== false)
      ? '/addons/' . $addonFolderName 
      : '/data/_addoncode/' . $addonFolderName;
    echo 'var SimpleButton = {';
    echo    'base : "' . $addonBasePath . '", ';
    echo    'config : ' . json_encode(self::$buttonConfig['buttonClasses']);
    echo '};';

    $scripts[] = '/include/js/inline_edit/inline_editing.js';
    $scripts[] = $addonRelativeCode . '/SimpleButton_edit.js'; 

    return $scripts;
  }


  /**
   * Custom method LoadConfig
   */
  static function LoadConfig(){
    global $addonPathCode, $addonPathData;
    if( file_exists($addonPathData . '/buttonConfig.php') ){
      include($addonPathData . '/buttonConfig.php');
    }else{
      include($addonPathCode . "/presets/default.php");
    }
    self::$buttonConfig = $buttonConfig;
  }

}
