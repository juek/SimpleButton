<?php
defined('is_running') or die('Not an entry point...');

$buttonConfig = array (
  'presetName' => 'default',
  'buttonDefaults' => 'sb-gray sb-default sb-solid',
  'buttonClasses' =>  array(
    0 => 
    array (
      'classnames' => 'sb-red sb-yellow sb-green sb-teal sb-cyan sb-blue sb-purple sb-magenta sb-dark sb-gray sb-light',
      'label' => 'Color',
    ),
    1 => 
    array (
      'classnames' => 'sb-small sb-default sb-large',
      'label' => 'Size',
    ),
    2 =>
    array (
      'classnames' => 'sb-solid sb-ghost',
      'label' => 'Basic Style',
    ),
    3 =>
    array (
      'classnames' => 'sb-glossy sb-glossy2',
      'label' => 'Glossy',
    ),
    4 =>
    array (
      'classnames' => 'sb-shadow sb-countersunk',
      'label' => 'Shadow',
    ),
    5 =>
    array (
      'classnames' => 'sb-3d',
      'label' => '3D Convex',
    ),
    6 =>
    array (
      'classnames' => 'sb-emboss',
      'label' => 'Emboss Text',
    ),
  ),
);
