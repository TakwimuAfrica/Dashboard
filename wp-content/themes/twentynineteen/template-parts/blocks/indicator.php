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
        <div class="indicator-header">
            <p class="indicator-title"><?php echo $title; ?></p>
			<span class="indicator-subtitle"><?php echo $subtitle; ?></span>
			<span class="indicator-subtitle"><?php echo $description; ?></span>

        </div>
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
                    $doc_div = "<div class='document-root'>
                                <div class='paginate-button'><button id='prev'><span class='dashicons dashicons-arrow-left-alt2 icon'></span></button></div>
                                <div class='canvas-div'><canvas id='the-canvas' data-src='" . $widget[0]['document_content'] . "' width='100%'></canvas></div>
                                <div class='paginate-button right' ><button id='next'><span class='dashicons dashicons-arrow-right-alt2 icon'></span></button></div></div>";
                    echo $doc_div;
                    break;

                //free_form
                case 'free_form_widget':
                    echo $widget[0]['body'];
                    break;

                case 'embed_widget':
                    $embed = "<iframe src='" . $widget[0]['embed_content'] . "'></iframe>";
                    echo $embed;
                    break;
                default:
                    break;
            }
    		?>
        </div>
	    <div class="indicator-footer">
            <span class="indicator-source"><a href="<?php echo esc_attr($source_link); ?>"><?php echo $source_title; ?></a></span>
        </div>
        <style type="text/css">
            #<?php echo $id; ?> {
                background: <?php echo $background_color; ?>;
                color: <?php echo $text_color; ?>;
            }
			.indicator-title {
				font-weight: bold;
				text-align: center;
			}
            .document-root {
                display: flex;
            }
            .paginate-button {
                align-self: center;
                width: 12%;
            }
            .canvas-div {
                width: 76%;
                display: flex;
                justify-content: center;
            }
            button {
                background: none;
                border: none;
            }
            .icon {
                font-size: 60px;
            }
        </style>
    </div>
