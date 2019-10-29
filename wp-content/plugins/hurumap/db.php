<?php

function migrate() {
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();
    $version         = (int) get_site_option('hurumap_data_db_version');

    if ($version < 1) {
        $sql = "CREATE TABLE `{$wpdb->base_prefix}chart_sections`(
            `id`         varchar(45) NOT NULL,
            `name`       varchar(255) NOT NULL ,
            `description` varchar(255) NOT NULL ,
            `published` tinyint NOT NULL DEFAULT 0,
            `created_at` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
            `updated_at` datetime NOT NULL DEFAULT NOW(),
            PRIMARY KEY (`id`)
        ) $charset_collate;";

        $sql .= "CREATE TABLE `{$wpdb->base_prefix}flourish_charts`(
            `id`         varchar(45) NOT NULL ,
            `section`    varchar(45) NULL ,
            `title`      varchar(255) NOT NULL ,
            `subtitle`   varchar(255) NOT NULL ,
            `file`       json NOT NULL ,
            `published` tinyint NOT NULL DEFAULT 0,
            `created_at` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
            `updated_at` datetime NOT NULL DEFAULT NOW(),
            PRIMARY KEY (`id`),
            KEY `fkIdx_22` (`section`),
            CONSTRAINT `FK_22` FOREIGN KEY `fkIdx_22` (`section`) REFERENCES `{$wpdb->base_prefix}chart_sections` (`id`)
        ) $charset_collate;";

        $sql .= "CREATE TABLE `{$wpdb->base_prefix}hurumap_charts`(
                `id`         varchar(45) NOT NULL ,
                `section`    varchar(45) NULL ,
                `title`      varchar(255) NOT NULL ,
                `subtitle`   varchar(255) NOT NULL ,
                `visual`     json NOT NULL ,
                `stat`       json NULL ,
                `published` tinyint NOT NULL DEFAULT 0,
                `created_at` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
                `updated_at` datetime NOT NULL DEFAULT NOW(),

                PRIMARY KEY (`id`),
                KEY `fkIdx_19` (`section`),
                CONSTRAINT `FK_19` FOREIGN KEY `fkIdx_19` (`section`) REFERENCES `{$wpdb->base_prefix}chart_sections` (`id`)
                ) $charset_collate;";
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
        $success = empty($wpdb->last_error);

        update_site_option('hurumap_data_db_version', 1);
    }

    if ($version < 2) {
        $wpdb->query("DROP TABLE IF EXISTS `{$wpdb->base_prefix}flourish_charts`");

        $sql = "CREATE TABLE `{$wpdb->base_prefix}flourish_charts`(
            `id`        varchar(45) NOT NULL ,
            `title`      varchar(255) NOT NULL ,
            `country`   varchar(255) NOT NULL ,
            `media_id`       int NOT NULL ,
            `published` tinyint NOT NULL DEFAULT 0,
            `created_at` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
            `updated_at` datetime NOT NULL DEFAULT NOW(),

            PRIMARY KEY (`id`)
            ) $charset_collate;";
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
        $success = empty($wpdb->last_error);

        update_site_option('hurumap_data_db_version', 2);

    }

    return $success;
}

function activate_hurumap_data()
{
    return migrate();
}

function deactivate_hurumap_data()
{
    update_site_option('hurumap_data_db_version', 0);
}

/**
 * Run migration if the plugin is active
 */
include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
if (is_plugin_active( 'hurumap/index.php' )) { 
    migrate();
}
