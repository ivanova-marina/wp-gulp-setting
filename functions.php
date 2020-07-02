<?php
/**
 * functions and definitions.
 *
 * @package WordPress
 * @subpackage gulp-test
 */

/**
 * THEME SUPPOT
**/
//add_theme_support('automatic-feed-links');
add_theme_support('menus');
add_theme_support('post-thumbnails');

/**
 * REVISION CONTROLL
**/
function disable_autosave() {
	wp_deregister_script('autosave');
}
add_action('wp_print_scripts','disable_autosave');

/**
 * js, css読み込み
**/
function _themename_assets() {
	wp_enqueue_style( '_themename-stylesheet', get_template_directory_uri() . '/dist/style/main.css', array(), '1.0.0', 'all');
	wp_enqueue_script( '_themename-scripts', get_template_directory_uri() . '/dist/js/main.js', array('jquery'), '1.0.0', 'all', true);
	wp_enqueue_script( '_themename-onemore', get_template_directory_uri() . '/dist/js/onemore.js', array(), '1.0.0', 'all', true);
}
add_action('wp_enqueue_scripts', '_themename_assets');
/**
 * FUNCTION
**/

function no_self_ping(&$links) {
	$home = get_option('home');
	foreach ($links as $l => $link)
		if (0 === strpos($link, $home)) unset($links[$l]);
}
add_action('pre_ping', 'no_self_ping');