<?php
defined('is_running') or die('Not an entry point...');

$buttonConfig = array(
  'presetName' => 'Bootstrap4',
  'buttonDefaults' => 'btn-primary btn-md btn-inline',
  'buttonClasses' =>  array(
    0 => 
    array (
      'classnames' => 'btn-primary btn-secondary btn-dark btn-light btn-success btn-info btn-warning btn-danger btn-link',
      'label' => 'Color',
    ),
    1 => 
    array (
      'classnames' => 'btn-sm btn-md btn-lg',
      'label' => 'Size',
    ),
    2 => 
    array (
      'classnames' => 'btn-inline btn-block',
      'label' => 'Display type',
    ),
  ),
);
