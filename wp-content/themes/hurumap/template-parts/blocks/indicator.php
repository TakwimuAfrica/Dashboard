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
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'indicator-widget';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
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

$this_widget = $widget[0];

$layout = $this_widget['acf_fc_layout']
?>
<div>
    <div id="<?php echo esc_attr($id); ?>" data-title="<?php echo $title; ?>" data-description="<?php echo $description; ?>" data-source-title="<?php echo $source_title; ?>" data-source-link="<?php echo $source_link; ?>" data-src="<?php echo esc_attr(array_values($this_widget)[1]); ?>" data-layout="<?php echo $layout; ?>" class="<?php echo esc_attr($className); ?>">

        <div class="indicator-header">
            <p class="indicator-title"><?php echo $title; ?></p>
            <span class="indicator-subtitle"><?php echo $subtitle; ?></span>
        </div>
        <div class="indicator-div">
            <?php switch ($layout) {

                    //echo for raw html
                case 'raw_html_widget':
                    echo $this_widget['raw_html'];
                    break;
                    //use wp get attachment for image
                case 'image_widget':
                    echo wp_get_attachment_image($this_widget['image_content'], 'full');
                    break;

                    //use document viewer
                case 'document_widget':
                    $doc_div = "<div class='document-root'>
                                    <div class='paginate-button'><button id='prev'><span class='dashicons dashicons-arrow-left-alt2 icon'></span></button></div>
                                    <div class='canvas-div'><canvas id='the-canvas' data-src='" . $this_widget['document_content'] . "' width='100%'></canvas></div>
                                    <div class='paginate-button right' ><button id='next'><span class='dashicons dashicons-arrow-right-alt2 icon'></span></button></div></div>";
                    echo $doc_div;
                    break;

                    //free_form
                case 'free_form_widget':
                    echo $widget[0]['body'];
                    break;

                case 'embed_widget':
                    $embed = "<iframe src='" . $this_widget['embed_content'] . "'></iframe>";
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
            <?php echo "#" . $id; ?> {
                background: <?php echo $background_color; ?>;
                color: <?php echo $text_color; ?>;
            }

            .indicator-widget {
                padding: 1.25rem;
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
                font-size: 3.75rem;
            }

            .indicator-decription {
                display: flex;
                align-items: center;
                padding: 0 5%;
                margin-top: 1.25rem;
            }

            .indicator-description-text {
                margin-left: 1.25rem;
            }
        </style>
    </div>

    <?php if ($description) { ?>
        <div class="indicator-decription">
            <svg class="MuiSvgIcon-root MuiSvgIcon-colorPrimary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M7 14l5-5 5 5z"></path></svg>
            <span class="indicator-description-text"><?php echo $description; ?></span>
        </div>
    <?php } ?>
</div>
