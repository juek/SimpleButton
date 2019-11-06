<?php
/**
 * ########################################################################
 * PHP class for Typesetter CMS plugin Simple Button
 * Admin Page
 * Author: J. Krausz
 * Date: 2019-10-22
 * Version 1.1
 * ########################################################################
 */

defined('is_running') or die('Not an entry point...');

class Admin_SimpleButton{

  var $admin_link;
  var $buttonConfig;


  public function __construct(){
    global $addonPathData, $addonRelativeCode, $page;

    $this->admin_link = common::GetUrl('Admin_SimpleButton'); 

    \gp\tool\Plugins::css('Admin_SimpleButton.css', false);
    \gp\tool\Plugins::js('Admin_SimpleButton.js', false);

    if( isset($_POST['save']) ){
      msg($this->SaveData()); 
    }

    $this->LoadData();

    $this->ShowData();
  }



  private function ShowData(){
    global $dataDir, $langmessage, $addonPathCode, $addonRelativeCode, $config, $page;
    $cfgArr = $this->buttonConfig;

    echo '<h2 class="hqmargin">Simple Button &raquo; Button Setup</h2><br/>';

    echo '<form id="buttonConfig_form" action="' . $this->admin_link . '" method="post">';

    echo '<table id="gpE_SB_classItems" class="bordered" style="width:100%;">';
    echo '<tr><th>Label</th><th>className(s)</th></tr>';
    echo '<tr id="gpE_SB_newClassItem">';
    echo '<td><input placeholder="label in the editor" ';
    echo 'class="gpinput" size="22" type="text" name="newClassLabel" value="" /></td>';
    echo '<td><input placeholder="className(s)" class="gpinput" size="58" type="text" name="newClassName" value="" /> ';
    echo '<a class="gpbutton gpE_SB_addClassItem" href="javascript:;" title="Add Item"><i class="fa fa-fw fa-plus"></i></a></td>';
    echo '</tr>';
    if( is_array($this->buttonConfig) && !empty($this->buttonConfig['buttonClasses']) ){
      $classRows = '';
      foreach( $this->buttonConfig['buttonClasses'] as $key => $classArray ){
        $classRows .= '<tr class="gpE_SB_classItem">';
        $classRows .= '<td><input size="22" class="gpinput" type="text" '
          . 'name="buttonConfig[buttonClasses][' . $key . '][label]" '
          . 'value="' . $classArray['label'] . '"/>';
        $classRows .= '<td><input size="58" class="gpinput" type="text" '
          . 'name="buttonConfig[buttonClasses][' . $key . '][classnames]" '
          . 'value="' . $classArray['classnames'] . '"/> ';
        $classRows .= '<a class="gpbutton gpE_SB_removeClassItem" href="javascript:;" '
          . 'title="Remove Item"><i class="fa fa-fw fa-trash"></i></a></td>';
        $classRows .= '</tr>';
      }
      echo $classRows;
    }
    echo '</table>';

    echo '<br/>';

    // BUTTON DEFAULTS
    echo '<table id="gpE_SB_classItems" class="bordered" style="width:100%;">';
    echo '<tr><th>Default className(s) for new buttons</th></tr>';
    echo '<tr id="gpE_SB_newClassItem">';
    echo '<td><input placeholder="default className(s) for new buttons" class="gpinput" size="100" ';
    echo 'type="text" name="buttonConfig[buttonDefaults]" value="' . $this->buttonConfig['buttonDefaults'] . '" /></td>';
    echo '</tr>';
    echo '</table>';

    echo '<input type="hidden" name="save" value="true"/>';
    echo '<br/>';
    // SAVE / CANCEL BUTTONS
    echo '<input id="gpE_SB_saveButton" type="button" name="save" value="' . $langmessage['save'] . '" class="gpsubmit" /> ';
    echo '<input type="button" onClick="location.href=\'' . $this->admin_link . '\'" ';
    echo 'name="cmd" value="' . $langmessage['cancel'] . '" class="gpcancel" />';
    echo '</form>';
    // FORM end

    echo '<div style="margin-top:2em; border:1px solid #ccc; background:#fafafa; border-radius:3px; padding:12px;">';
    echo '<p><strong>The Buttons&rsquo; CSS classNames you set here will be selectable in the section&rsquo;s inline editor.</strong></p>';
    echo '<ul style="padding-left:1.1em;">';
    echo '<li style="list-style-type:disc;">Single classNames (like <em>myButton</em>) will show as checkboxes.</li>';
    echo '<li style="list-style-type:disc;">Multiple, space separated classNames (like <em>buttonLarge buttonDefault buttonSmall</em> will show as dropdown list.</li>';
    echo '<li style="list-style-type:disc;">Labels are optional but recommended. Keep them short but clear.</li>';
    echo '<li style="list-style-type:disc;">Unless you only need a className as jQuery selector, it must have a corresponding ';
    echo 'CSS rule defined in the theme stylesheet or layout editor to take effect.</li>';
    echo '<li style="list-style-type:disc;">Default classNames(s) will be applied to newly generated Simple Buttons. Separate multiple classNames with spaces.</li>';
    echo '<li style="list-style-type:disc;">The list is drag&amp;drop sortable and will appear in this order in the inline editor.</li>';
    echo '</ul><hr/>';

    echo '<p>';

    echo '<a href="' . $this->admin_link . '?load_preset=bootstrap3" title="Note: This preset will only work with Bootstrap 3 based themes!" class="gpcancel">';
    echo 'Load the Bootstrap<strong>3</strong> Preset</a> ';

    echo '<a href="' . $this->admin_link . '?load_preset=bootstrap4" title="Note: This preset will only work with Bootstrap 4 based themes!" class="gpcancel">';
    echo 'Load the Bootstrap<strong>4</strong> Preset</a> ';

    echo '<a href="' . $this->admin_link . '?load_preset=default" class="gpcancel">Load the Default Preset</a>';
    echo '</p>';
    echo '</div>';
  }



  private function LoadData(){
    global $addonPathCode, $addonPathData, $langmessage;

    if( isset($_REQUEST['load_preset']) ){
      if( $_REQUEST['load_preset'] == "default" ){
        include($addonPathCode."/presets/default.php");
        $this->buttonConfig = $buttonConfig;
        msg('Default preset loaded. Click the [' . $langmessage['save'] . '] button to keep it.');
        return;
      }
      if( $_REQUEST['load_preset'] == "bootstrap3" ){
        include($addonPathCode."/presets/bootstrap3.php");
        $this->buttonConfig = $buttonConfig;
        msg('Bootstrap 3 preset loaded. Click the [' . $langmessage['save'] . '] button to keep it.');
        return;
      }
      if( $_REQUEST['load_preset'] == "bootstrap4" ){
        include($addonPathCode."/presets/bootstrap4.php");
        $this->buttonConfig = $buttonConfig;
        msg('Bootstrap 4 preset loaded. Click the [' . $langmessage['save'] . '] button to keep it.');
        return;
      }
    }

    if( file_exists($addonPathData . '/buttonConfig.php') ){
      include($addonPathData . '/buttonConfig.php');
    }else{
      include($addonPathCode . '/presets/default.php');
    }
    $this->buttonConfig = $buttonConfig;
  }



  private function SaveData(){
    global $langmessage, $addonPathData;
    if( !isset($_POST['buttonConfig']) ){
      return $langmessage['OOPS'] . ' - No config to be saved!';
    }
    $saveArray = $_POST['buttonConfig'];
    $this->buttonConfig['buttonDefaults'] = $saveArray['buttonDefaults'];
    $newKeyIndex = 0;
    foreach ($saveArray['buttonClasses'] as $key => $classArray) {
      $this->buttonConfig['buttonClasses'][$newKeyIndex] = array(
        'classnames'  => htmlspecialchars(trim($classArray['classnames'])),
        'label' => htmlspecialchars(trim($classArray['label']))
      );
      $newKeyIndex++;
    }
    if( \gp\tool\Files::SaveData($addonPathData . '/buttonConfig.php', 'buttonConfig', $this->buttonConfig) ){
      return  $langmessage['SAVED'];
    }else{
      return  $langmessage['OOPS'];
    }
  }

}
