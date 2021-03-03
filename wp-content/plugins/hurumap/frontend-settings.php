<?php

class FrontEnd {
	private $front_end__options;

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'front_end__add_plugin_page' ) );
		add_action( 'admin_init', array( $this, 'front_end__page_init' ) );
	}

	public function front_end__add_plugin_page() {
		add_options_page(
			'Front End', // page_title
			'Front End', // menu_title
			'manage_options', // capability
			'front-end', // menu_slug
			array( $this, 'front_end__create_admin_page' ) // function
		);
	}

	public function front_end__create_admin_page() {
		$this->front_end__options = get_option( 'front_end__option_name' ); ?>

		<div class="wrap">
			<?php settings_errors(); ?>

			<form method="post" action="options.php">
				<?php
					settings_fields( 'front_end__option_group' );
					do_settings_sections( 'front-end-admin' );
					submit_button();
				?>
			</form>
		</div>
	<?php }

	public function front_end__page_init() {
		register_setting(
			'front_end__option_group', // option_group
			'front_end__option_name', // option_name
			array( $this, 'front_end__sanitize' ) // sanitize_callback
		);

		add_settings_section(
			'front_end__setting_section', // id
			'Settings', // title
			array( $this, 'front_end__section_info' ), // callback
			'front-end-admin' // page
		);

		add_settings_field(
			'base_url_0', // id
			'Base Url', // title
			array( $this, 'base_url_0_callback' ), // callback
			'front-end-admin', // page
			'front_end__setting_section' // section
		);
	}

	public function front_end__sanitize($input) {
		$sanitary_values = array();
		if ( isset( $input['base_url_0'] ) ) {
			$sanitary_values['base_url_0'] = sanitize_text_field( $input['base_url_0'] );
		}

		return $sanitary_values;
	}

	public function front_end__section_info() {
		
	}

	public function base_url_0_callback() {
		printf(
			'<input class="regular-text" type="text" name="front_end__option_name[base_url_0]" id="base_url_0" value="%s">',
			isset( $this->front_end__options['base_url_0'] ) ? esc_attr( $this->front_end__options['base_url_0']) : ''
		);
	}

}
if ( is_admin() )
	$front_end_ = new FrontEnd();

/* 
 * Retrieve this value with:
 * $front_end__options = get_option( 'front_end__option_name' ); // Array of All Options
 * $base_url_0 = $front_end__options['base_url_0']; // Base Url
 */
