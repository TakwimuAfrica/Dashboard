<?php

/*
*  ACF Admin Field Group Class
*
*  All the logic for editing a field group
*
*  @class 		acf_admin_field_group
*  @package		ACF
*  @subpackage	Admin
*/

if( ! class_exists('hurumap_data_admin') ) :

class hurumap_data_admin {
	
	
	/*
	*  __construct
	*
	*  This function will setup the class functionality
	*
	*  @type	function
	*  @date	5/03/2014
	*  @since	5.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function __construct() {
		
		// actions
		add_action('current_screen',									array($this, 'current_screen'));
		add_action('save_post',											array($this, 'save_post'), 10, 2);
		
		
		// filters
		add_filter('use_block_editor_for_post_type',					array($this, 'use_block_editor_for_post_type'), 10, 2);
	}
	
	function use_block_editor_for_post_type( $use_block_editor, $post_type ) {
		if( $post_type === 'hurumap-visual' ) {
			return false;
		}
		return $use_block_editor;
	}
	
	/*
	*  current_screen
	*
	*  This function is fired when loading the admin page before HTML has been rendered.
	*
	*  @type	action (current_screen)
	*  @date	21/07/2014
	*  @since	5.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function current_screen() {
		
		// validate screen
		if( !is_screen('hurumap-data') ) return;
		
		
		// disable filters to ensure ACF loads raw data from DB
		// acf_disable_filters();
		
		
		// enqueue scripts
		// acf_enqueue_scripts();
		
		
		// actions
		// add_action('acf/input/admin_enqueue_scripts',		array($this, 'admin_enqueue_scripts'));
		// add_action('acf/input/admin_head', 					array($this, 'admin_head'));
		// add_action('acf/input/form_data', 					array($this, 'form_data'));
		// add_action('acf/input/admin_footer', 				array($this, 'admin_footer'));
		// add_action('acf/input/admin_footer_js',				array($this, 'admin_footer_js'));
		
		
		// filters
		// add_filter('acf/input/admin_l10n',					array($this, 'admin_l10n'));
	}
	
	
	/*
	*  admin_enqueue_scripts
	*
	*  This action is run after post query but before any admin script / head actions. 
	*  It is a good place to register all actions.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @date	30/06/2014
	*  @since	5.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function admin_enqueue_scripts() {
		// no autosave
		wp_dequeue_script('autosave');
	}
	
	
	/*
	*  edit_form_after_title
	*
	*  This action will allow ACF to render metaboxes after the title
	*
	*  @type	action
	*  @date	17/08/13
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function edit_form_after_title() {
		
		// globals
		global $post;
		
		
		// render post data
		acf_form_data(array(
			'screen'		=> 'field_group',
			'post_id'		=> $post->ID,
			'delete_fields'	=> 0,
			'validation'	=> 0
		));

	}

	/*
	*  save_post
	*
	*  This function will save all the field group data
	*
	*  @type	function
	*  @date	23/06/12
	*  @since	1.0.0
	*
	*  @param	$post_id (int)
	*  @return	$post_id (int)
	*/
	
	function save_post( $post_id, $post ) {
		
		// do not save if this is an auto save routine
		if( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) {
			return $post_id;
		}
		
		// bail early if not acf-field-group
		if( $post->post_type !== 'hurumap-visual' ) {
			return $post_id;
		}
		
		// only save once! WordPress save's a revision as well.
		if( wp_is_post_revision($post_id) ) {
	    	return $post_id;
        }
        
		// verify nonce
		// if( !acf_verify_nonce('field_group') ) {
		// 	return $post_id;
		// }
        
        // Bail early if request came from an unauthorised user.
		// if( !current_user_can(acf_get_setting('capability')) ) {
		// 	return $post_id;
		// }
		
		
        // disable filters to ensure ACF loads raw data from DB
		// acf_disable_filters();
		
		
        // save fields
        if( !empty($_POST['acf_fields']) ) {
			
			// loop
			foreach( $_POST['acf_fields'] as $field ) {
				
				// vars
				$specific = false;
				$save = acf_extract_var( $field, 'save' );
				
				
				// only saved field if has changed
				if( $save == 'meta' ) {
					$specific = array(
						'menu_order',
						'post_parent',
					);
				}
				
				// set parent
				if( !$field['parent'] ) {
					$field['parent'] = $post_id;
				}
				
				// save field
				acf_update_field( $field, $specific );
				
			}
		}
		
		
		// delete fields
        // if( $_POST['_acf_delete_fields'] ) {
        	
        // 	// clean
	    // 	$ids = explode('|', $_POST['_acf_delete_fields']);
	    // 	$ids = array_map( 'intval', $ids );
	    	
	    	
	    // 	// loop
		// 	foreach( $ids as $id ) {
				
		// 		// bai early if no id
		// 		if( !$id ) continue;
				
				
		// 		// delete
		// 		acf_delete_field( $id );
				
		// 	}
			
        // }
		
		
		// add args
        $_POST['acf_field_group']['ID'] = $post_id;
        $_POST['acf_field_group']['title'] = $_POST['post_title'];
        
        
		// save field group
        acf_update_field_group( $_POST['acf_field_group'] );
		
		
        // return
        return $post_id;
	}
	
}

// initialize
new acf_admin_field_group();

endif;

?>