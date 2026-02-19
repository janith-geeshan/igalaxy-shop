-- ============================================================
-- iGalaxy Mobile Shop — Database Schema
-- Import this file in HeidiSQL to set up the database
-- ============================================================

CREATE DATABASE IF NOT EXISTS `db_name`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_name`;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `table_name` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `full_name`  VARCHAR(100) NOT NULL,
  `email`      VARCHAR(150) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,          -- bcrypt hash
  `phone`      VARCHAR(20)  DEFAULT NULL,
  `avatar`     VARCHAR(255) DEFAULT NULL,      -- optional profile picture path
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Optional: seed a demo admin account
-- Password: Admin@123  (bcrypt hash below)
-- ------------------------------------------------------------
INSERT IGNORE INTO `table_name` (`full_name`, `email`, `password`, `phone`)
VALUES (
  'name',
  'name@igalaxy.com',
  '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
  '+94 70 000 0000'
);
