<?php

function is_screen( $id = '' ) {
	
	// bail early if not defined
	if( !function_exists('get_current_screen') ) {
		return false;
	}
	
	// vars
	$current_screen = get_current_screen();
	
	// no screen
	if( !$current_screen ) {
		return false;
	
	// array
	} elseif( is_array($id) ) {
		return in_array($current_screen->id, $id);
	
	// string
	} else {
		return ($id === $current_screen->id);
	}
}
