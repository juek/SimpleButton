<?php
defined('is_running') or die('Not an entry point...');

$buttonConfig = array (
  'presetName' => 'Bootstrap3',
  'buttonDefaults' => 'btn-default btn-md btn-inline',
  'buttonClasses' =>  array(
    0 => 
    array (
      'classnames' => 'btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link',
      'label' => 'Color',
    ),
    1 => 
    array (
      'classnames' => 'btn-lg btn-md btn-sm btn-xs',
      'label' => 'Size',
    ),
    2 => 
    array (
      'classnames' => 'btn-inline btn-block',
      'label' => 'Display type',
    ),
  ),
);
