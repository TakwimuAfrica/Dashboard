<?php

/**
 * Indicator Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

 //Create id attribute allowing for custom "anchor" value.
 $id = 'indicator-' . $block['id'];
 if( !empty($block['anchor']) ) {
     $id = $block['anchor'];
 }

 // Create class attribute allowing for custom "className" and "align" values.
 $className = 'indicator-widget';
 if( !empty($block['className']) ) {
     $className .= ' ' . $block['className'];
 }
 if( !empty($block['align']) ) {
     $className .= ' align' . $block['align'];
 }

 // Load values and assing defaults.
 $title = get_field('indicator_title') ?: null;
 $subtitle = get_field('indicator_subtitle') ?: null;
 $description = get_field('indicator_description') ?: '';
 $source_title = get_field('indicator_source_title') ?: null;
 $source_link = get_field('indicator_source_link') ?: null;
 $widget = get_field('indicator_widget') ?: null;
 $background_color = get_field('indicator_background_color');

 $layout = $widget[0]['acf_fc_layout']
 ?>
	<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
        <blockquote class="indicator-blockquote">
            <p class="indicator-title"><?php echo $title; ?></p>
			<span class="indicator-subtitle"><?php echo $subtitle; ?></span>
			<span class="indicator-subtitle"><?php echo $description; ?></span>

        </blockquote>
        <div class="indicator-div">
            <?php switch ( $layout ) {

                //echo for raw html
                case 'raw_html_widget':
                    echo $widget[0]['raw_html'];
                    break;
                //use wp get attachment for image
                case 'image_widget':
                    echo wp_get_attachment_image( $widget[0]['image_content'], 'full' );
                    break;

                //use document viewer
                case 'document_widget':
                    break;
            }
    		?>
        </div>
		<blockquote class="indicator-blockquote">
            <span class="indicator-source"><a href="<?php echo esc_attr($source_link); ?>"><?php echo $source_title; ?></a></span>
        </blockquote>
        <style type="text/css">
            #<?php echo $id; ?> {
                background: <?php echo $background_color; ?>;
                color: <?php echo $text_color; ?>;
            }
			.indicator-title {
				font-weight: bold;
				align-content: center;
			}
        </style>
    </div>