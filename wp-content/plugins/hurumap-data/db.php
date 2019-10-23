<?php

function activate_hurumap_data()
{
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
                `id`        varchar(45) NOT NULL ,
                `title`      varchar(255) NOT NULL ,
                `subtitle`   varchar(255),
                `file`       int NOT NULL ,
                `description`   varchar(255),
                `source_title` varchar(255),
                `source_link` varchar(255),
                `published` tinyint NOT NULL DEFAULT 0,
                `created_at` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
                `updated_at` datetime NOT NULL DEFAULT NOW(),
                PRIMARY KEY (`id`)
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

    return $success;
}

function deactivate_hurumap_data()
{
    update_site_option('hurumap_data_db_version', 0);
}
