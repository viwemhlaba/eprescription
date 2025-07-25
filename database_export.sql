-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: GRP-04-16
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `active_ingredient_medication`
--

DROP TABLE IF EXISTS `active_ingredient_medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `active_ingredient_medication` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `medication_id` bigint(20) unsigned NOT NULL,
  `active_ingredient_id` bigint(20) unsigned NOT NULL,
  `strength` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `active_ingredient_medication_medication_id_foreign` (`medication_id`),
  KEY `active_ingredient_medication_active_ingredient_id_foreign` (`active_ingredient_id`),
  CONSTRAINT `active_ingredient_medication_active_ingredient_id_foreign` FOREIGN KEY (`active_ingredient_id`) REFERENCES `active_ingredients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `active_ingredient_medication_medication_id_foreign` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_ingredient_medication`
--

LOCK TABLES `active_ingredient_medication` WRITE;
/*!40000 ALTER TABLE `active_ingredient_medication` DISABLE KEYS */;
/*!40000 ALTER TABLE `active_ingredient_medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `active_ingredient_user`
--

DROP TABLE IF EXISTS `active_ingredient_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `active_ingredient_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `active_ingredient_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `active_ingredient_user_user_id_foreign` (`user_id`),
  KEY `active_ingredient_user_active_ingredient_id_foreign` (`active_ingredient_id`),
  CONSTRAINT `active_ingredient_user_active_ingredient_id_foreign` FOREIGN KEY (`active_ingredient_id`) REFERENCES `active_ingredients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `active_ingredient_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_ingredient_user`
--

LOCK TABLES `active_ingredient_user` WRITE;
/*!40000 ALTER TABLE `active_ingredient_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `active_ingredient_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `active_ingredients`
--

DROP TABLE IF EXISTS `active_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `active_ingredients` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_ingredients`
--

LOCK TABLES `active_ingredients` WRITE;
/*!40000 ALTER TABLE `active_ingredients` DISABLE KEYS */;
INSERT INTO `active_ingredients` VALUES (1,'voluptates','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(2,'exercitationem','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(3,'deserunt','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(4,'dolorem','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(5,'pariatur','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(6,'qui','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(7,'ut','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(8,'maiores','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(9,'aut','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(10,'aliquam','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(11,'facere','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(12,'praesentium','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(13,'labore','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(14,'consequatur','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(15,'eligendi','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(16,'excepturi','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(17,'rerum','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(18,'expedita','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(19,'vel','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(20,'non','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(21,'et','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(22,'occaecati','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(23,'in','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(24,'ipsum','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(25,'id','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(26,'numquam','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(27,'libero','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(28,'laborum','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(29,'earum','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(30,'assumenda','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(31,'unde','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(32,'eius','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(33,'commodi','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(34,'tempore','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(35,'accusantium','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(36,'iste','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(37,'velit','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(38,'sed','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(39,'omnis','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(40,'reiciendis','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(41,'voluptas','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(42,'quia','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(43,'sit','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(44,'quaerat','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(45,'culpa','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(46,'quos','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(47,'a','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(48,'iure','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(49,'quis','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(50,'debitis','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL);
/*!40000 ALTER TABLE `active_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allergies`
--

DROP TABLE IF EXISTS `allergies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `allergies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `allergies_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allergies`
--

LOCK TABLES `allergies` WRITE;
/*!40000 ALTER TABLE `allergies` DISABLE KEYS */;
/*!40000 ALTER TABLE `allergies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allergy_user`
--

DROP TABLE IF EXISTS `allergy_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `allergy_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `allergy_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `allergy_user_allergy_id_foreign` (`allergy_id`),
  KEY `allergy_user_user_id_foreign` (`user_id`),
  CONSTRAINT `allergy_user_allergy_id_foreign` FOREIGN KEY (`allergy_id`) REFERENCES `allergies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `allergy_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allergy_user`
--

LOCK TABLES `allergy_user` WRITE;
/*!40000 ALTER TABLE `allergy_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `allergy_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_allergies`
--

DROP TABLE IF EXISTS `customer_allergies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_allergies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `active_ingredient_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_allergies_user_id_active_ingredient_id_unique` (`user_id`,`active_ingredient_id`),
  KEY `customer_allergies_active_ingredient_id_foreign` (`active_ingredient_id`),
  CONSTRAINT `customer_allergies_active_ingredient_id_foreign` FOREIGN KEY (`active_ingredient_id`) REFERENCES `active_ingredients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `customer_allergies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_allergies`
--

LOCK TABLES `customer_allergies` WRITE;
/*!40000 ALTER TABLE `customer_allergies` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_allergies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `id_number` varchar(255) NOT NULL,
  `cellphone_number` varchar(255) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `house_number` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_id_number_unique` (`id_number`),
  KEY `customers_user_id_foreign` (`user_id`),
  CONSTRAINT `customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,4,'6350565725','1-352-365-8887','None','Eastern Cape','Medhurstberg','Olson Mills','10339','30937-0745','2025-07-23 13:28:57','2025-07-23 13:28:57'),(2,5,'4760540615','319-920-3823','None','Limpopo','McLaughlinstad','Pete Lights','95921','67661','2025-07-23 13:28:57','2025-07-23 13:28:57'),(3,6,'8702070916','(858) 513-0026','None','Mpumalanga','Lake Kailyn','Vilma Plaza','73572','93542','2025-07-23 13:28:57','2025-07-23 13:28:57'),(4,7,'2255474065','(734) 623-0202','None','Eastern Cape','Okunevaborough','Coleman Parkway','165','25953-4749','2025-07-23 13:28:57','2025-07-23 13:28:57'),(5,8,'2722109900','(847) 365-4148','None','KwaZulu-Natal','New Kailee','Schimmel Light','990','86765','2025-07-23 13:28:57','2025-07-23 13:28:57'),(6,9,'5958162715','605.364.8995','Peanuts','Northern Cape','West Garry','Dion Rapid','84588','99080-9384','2025-07-23 13:28:57','2025-07-23 13:28:57'),(7,10,'5359645715','+1-360-434-4434','Peanuts','Limpopo','Brittanymouth','Jean Bypass','204','42144','2025-07-23 13:28:57','2025-07-23 13:28:57'),(8,11,'0945112400','1-207-862-0324','Pollen','Western Cape','West Magali','O\'Hara Path','3953','31530-4181','2025-07-23 13:28:57','2025-07-23 13:28:57'),(9,12,'8974503483','+1-856-681-5660','None','Eastern Cape','Herminioside','Schumm Cove','258','96626-9796','2025-07-23 13:28:57','2025-07-23 13:28:57'),(10,13,'9488691496','1-351-258-6511','Pollen','Gauteng','East Eltonberg','Ward Plaza','5257','57822-9049','2025-07-23 13:28:57','2025-07-23 13:28:57');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispensed_items`
--

DROP TABLE IF EXISTS `dispensed_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispensed_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint(20) unsigned NOT NULL,
  `prescription_item_id` bigint(20) unsigned NOT NULL,
  `medication_id` bigint(20) unsigned NOT NULL,
  `pharmacist_id` bigint(20) unsigned NOT NULL,
  `quantity_dispensed` int(11) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `dispensed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dispensed_items_prescription_id_foreign` (`prescription_id`),
  KEY `dispensed_items_prescription_item_id_foreign` (`prescription_item_id`),
  KEY `dispensed_items_medication_id_foreign` (`medication_id`),
  KEY `dispensed_items_pharmacist_id_foreign` (`pharmacist_id`),
  CONSTRAINT `dispensed_items_medication_id_foreign` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dispensed_items_pharmacist_id_foreign` FOREIGN KEY (`pharmacist_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dispensed_items_prescription_id_foreign` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dispensed_items_prescription_item_id_foreign` FOREIGN KEY (`prescription_item_id`) REFERENCES `prescription_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispensed_items`
--

LOCK TABLES `dispensed_items` WRITE;
/*!40000 ALTER TABLE `dispensed_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `dispensed_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `practice_number` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doctors_email_unique` (`email`),
  UNIQUE KEY `doctors_phone_unique` (`phone`),
  UNIQUE KEY `doctors_practice_number_unique` (`practice_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'Lori','Senger','hstreich@example.net','+1-430-927-6332','PR-21921','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(2,'Markus','Cartwright','dkunde@example.net','757.912.5127','PR-13089','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(3,'Jacynthe','Schinner','zmaggio@example.org','773.764.7378','PR-64164','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(4,'Aurelio','Schamberger','laury.rowe@example.com','+1.734.724.8815','PR-82535','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(5,'Michele','Prohaska','lueilwitz.joshuah@example.com','+18328550430','PR-24984','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(6,'Bailey','Bailey','vinnie.hermann@example.com','1-908-941-8260','PR-39012','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(7,'Toni','Cummings','britchie@example.net','+14755919285','PR-24292','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(8,'Camille','Lebsack','adrain60@example.org','+1 (651) 604-7216','PR-51773','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(9,'Reba','Baumbach','annamae73@example.org','1-563-886-4650','PR-02703','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(10,'Jennyfer','Swaniawski','gleason.kaylie@example.net','870.692.5977','PR-81685','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL);
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dosage_forms`
--

DROP TABLE IF EXISTS `dosage_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dosage_forms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dosage_forms`
--

LOCK TABLES `dosage_forms` WRITE;
/*!40000 ALTER TABLE `dosage_forms` DISABLE KEYS */;
INSERT INTO `dosage_forms` VALUES (1,'Capsule','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(2,'Tablet','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(3,'Tablet','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(4,'Syrup','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(5,'Tablet','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(6,'Capsule','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(7,'Capsule','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(8,'Syrup','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(9,'Injection','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(10,'Capsule','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(11,'Tablet','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(12,'Tablet','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(13,'Syrup','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(14,'Syrup','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(15,'Tablet','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(16,'Tablet','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(17,'Injection','2025-07-23 13:28:56','2025-07-23 13:28:56',NULL),(18,'Syrup','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(19,'Tablet','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(20,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(21,'Capsule','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(22,'Tablet','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(23,'Tablet','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(24,'Syrup','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(25,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(26,'Syrup','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(27,'Capsule','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(28,'Capsule','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(29,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(30,'Tablet','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(31,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(32,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(33,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(34,'Syrup','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(35,'Syrup','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(36,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(37,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(38,'Capsule','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(39,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(40,'Capsule','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(41,'Capsule','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(42,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(43,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(44,'Syrup','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(45,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(46,'Capsule','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(47,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(48,'Injection','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(49,'Tablet','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(50,'Tablet','2025-07-23 13:28:57','2025-07-23 13:28:57',NULL);
/*!40000 ALTER TABLE `dosage_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generated_reports`
--

DROP TABLE IF EXISTS `generated_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `generated_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `report_type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`parameters`)),
  `file_path` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `download_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `generated_reports_user_id_report_type_index` (`user_id`,`report_type`),
  KEY `generated_reports_generated_at_index` (`generated_at`),
  CONSTRAINT `generated_reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generated_reports`
--

LOCK TABLES `generated_reports` WRITE;
/*!40000 ALTER TABLE `generated_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `generated_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication_suppliers`
--

DROP TABLE IF EXISTS `medication_suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medication_suppliers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact_person` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medication_suppliers_name_unique` (`name`),
  UNIQUE KEY `medication_suppliers_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication_suppliers`
--

LOCK TABLES `medication_suppliers` WRITE;
/*!40000 ALTER TABLE `medication_suppliers` DISABLE KEYS */;
INSERT INTO `medication_suppliers` VALUES (1,'Kutch-Yost','Filiberto Olson','lucinda93@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(2,'Zulauf PLC','Adolfo Jacobs','langworth.clay@example.com','2025-07-23 13:28:56','2025-07-23 13:28:56'),(3,'Hamill, Gutkowski and Strosin','Grayson Gorczany','elliot.wyman@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(4,'Satterfield LLC','Arno Corkery','chaya.mckenzie@example.org','2025-07-23 13:28:56','2025-07-23 13:28:56'),(5,'Hill-McGlynn','Breana Greenholt','darius16@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(6,'Durgan, Marvin and Wilderman','Ms. Edythe Considine II','pkuphal@example.com','2025-07-23 13:28:56','2025-07-23 13:28:56'),(7,'Walsh, Johns and Satterfield','Mrs. Lurline Langworth IV','hrunte@example.org','2025-07-23 13:28:56','2025-07-23 13:28:56'),(8,'Hudson, Spencer and Orn','Deshawn Boyer','kim45@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(9,'Harvey-Schuster','Lazaro Dickens','senger.andres@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(10,'Jerde, Hettinger and Prohaska','Alyson Hartmann','jacey89@example.org','2025-07-23 13:28:56','2025-07-23 13:28:56'),(11,'Simonis-Hackett','Prof. Sigmund Torphy','herminio53@example.org','2025-07-23 13:28:56','2025-07-23 13:28:56'),(12,'Welch Ltd','Prof. Viva Sauer','cecelia.ernser@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(13,'Crooks-Yost','Diego DuBuque Sr.','denesik.ilene@example.com','2025-07-23 13:28:56','2025-07-23 13:28:56'),(14,'Daugherty, Rippin and Bernhard','Shanna Mueller','shaniya89@example.org','2025-07-23 13:28:56','2025-07-23 13:28:56'),(15,'Waters-Powlowski','Octavia Orn I','cleora77@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(16,'Hettinger-Lang','Mr. Deshaun Thompson DVM','willis45@example.net','2025-07-23 13:28:56','2025-07-23 13:28:56'),(17,'Heathcote, Bruen and Thompson','Conrad Dickinson','jevon.buckridge@example.org','2025-07-23 13:28:56','2025-07-23 13:28:56'),(18,'Terry Ltd','Prof. Edwin Carroll','pfannerstill.beaulah@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(19,'Dibbert and Sons','Kelsi Hodkiewicz PhD','tobin.weissnat@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(20,'Lubowitz-Cremin','Halie Bahringer','mhermiston@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(21,'Feeney-Koch','Roosevelt Ondricka MD','gerald56@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(22,'Schamberger Ltd','Audra Jaskolski','dooley.chris@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(23,'Torphy, Cummings and Koepp','Mr. Kelton Bosco','kamron.corkery@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(24,'Dickinson-Orn','Mr. Savion Kovacek','bdickinson@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(25,'Johns, Nolan and Weimann','Ben Frami','barrows.leora@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(26,'Lockman-Blick','Tod Pagac','zorn@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(27,'Price, McCullough and Keeling','Eulalia Swaniawski','sigrid.bartoletti@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(28,'Mitchell, Huel and Lehner','Nicolas Macejkovic','schamberger.barney@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(29,'Wunsch-Renner','Shana Becker','gus.mann@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(30,'Stehr, Kertzmann and Lowe','Roxanne Konopelski','pglover@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(31,'Hudson, Hermann and Stokes','Clarabelle Olson','mike23@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(32,'Cole PLC','Mrs. Sabina Sipes Sr.','moriah.marks@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(33,'Sanford, Rogahn and Rice','Bette Blick','qparisian@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(34,'Klein PLC','Reymundo Stark','bergstrom.merritt@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(35,'Lindgren Inc','Nicholas Wilderman','maye95@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(36,'Haley-Mayert','Shyanne Murphy V','mckayla.rolfson@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(37,'Heathcote-Murazik','Houston Jaskolski','karina.wintheiser@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(38,'Becker LLC','Alden Will','mccullough.winston@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(39,'Hirthe, Kuhn and Torphy','Mr. Lee Lowe','mercedes05@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(40,'Boehm-Mosciski','Blanche Hermann Sr.','electa.glover@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(41,'Heidenreich-Hettinger','Prof. Brett Tromp V','dorothea.watsica@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(42,'Kshlerin-Reilly','Kamryn Schmidt Sr.','vincenza30@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(43,'Kassulke, Ondricka and Auer','Jaylan O\'Keefe I','ktillman@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(44,'Boyer PLC','Mercedes Grimes','nullrich@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(45,'Stanton-Wilkinson','Arnaldo Mills','kim.fahey@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(46,'Wehner Inc','Meaghan Feest','luna.roob@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(47,'Fahey and Sons','Dr. Rubye Luettgen III','shana.schmeler@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(48,'Lang-Koepp','Roselyn Hermann II','ramon92@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(49,'Weimann Group','Tiara Beer I','alva.runte@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(50,'Hoeger-Mohr','Dr. Cali Gottlieb V','mariam.ledner@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(51,'Wuckert LLC','Faustino Hintz','ondricka.mafalda@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(52,'Torphy, VonRueden and Morar','Prof. Fausto Reichel Sr.','walsh.jody@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(53,'D\'Amore, Walsh and Wolf','Sister Barrows II','balistreri.edmund@example.org','2025-07-23 13:28:57','2025-07-23 13:28:57'),(54,'Daniel-Hirthe','Gabriel Howell','ystroman@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(55,'Schoen PLC','Marianne Moen','xwiza@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(56,'Botsford-Shanahan','Gianni McDermott','chelsie40@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(57,'Hermann Ltd','Sasha Bergstrom Sr.','king.joaquin@example.com','2025-07-23 13:28:57','2025-07-23 13:28:57'),(58,'Block, Schowalter and Wunsch','Mr. Tobin Gleichner III','yhowell@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(59,'Feil, Berge and Torphy','Mr. Jaylan Dicki','gail.terry@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57'),(60,'Herman LLC','Dayton Erdman PhD','petra.nader@example.net','2025-07-23 13:28:57','2025-07-23 13:28:57');
/*!40000 ALTER TABLE `medication_suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medications`
--

DROP TABLE IF EXISTS `medications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `dosage_form_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `schedule` tinyint(3) unsigned NOT NULL,
  `current_sale_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `supplier_id` bigint(20) unsigned NOT NULL,
  `reorder_level` int(11) NOT NULL,
  `quantity_on_hand` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `active_ingredient_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medications_name_unique` (`name`),
  KEY `medications_dosage_form_id_foreign` (`dosage_form_id`),
  KEY `medications_supplier_id_foreign` (`supplier_id`),
  KEY `medications_active_ingredient_id_foreign` (`active_ingredient_id`),
  CONSTRAINT `medications_active_ingredient_id_foreign` FOREIGN KEY (`active_ingredient_id`) REFERENCES `active_ingredients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `medications_dosage_form_id_foreign` FOREIGN KEY (`dosage_form_id`) REFERENCES `dosage_forms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medications_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `medication_suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medications`
--

LOCK TABLES `medications` WRITE;
/*!40000 ALTER TABLE `medications` DISABLE KEYS */;
INSERT INTO `medications` VALUES (1,1,'ut',2,173.42,1,63,271,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,1),(2,2,'reiciendis',0,40.46,2,34,394,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,2),(3,3,'doloribus',5,134.72,3,55,361,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,3),(4,4,'rerum',4,186.68,4,66,376,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,4),(5,5,'debitis',5,47.51,5,61,226,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,5),(6,6,'molestiae',0,195.75,6,64,207,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,6),(7,7,'architecto',0,64.87,7,75,34,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,7),(8,8,'soluta',0,141.93,8,67,362,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,8),(9,9,'accusantium',0,90.81,9,85,10,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,9),(10,10,'deleniti',0,159.82,10,89,381,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,10),(11,11,'excepturi',6,107.62,11,73,408,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,11),(12,12,'dolores',1,169.88,12,25,49,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,12),(13,13,'voluptate',4,113.15,13,58,337,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,13),(14,14,'dolorem',6,94.80,14,51,423,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,14),(15,15,'in',5,65.56,15,11,29,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,15),(16,16,'eveniet',5,145.54,16,10,464,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,16),(17,17,'quo',4,38.05,17,28,119,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,17),(18,18,'provident',6,36.48,18,19,374,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,18),(19,19,'numquam',3,113.10,19,65,401,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,19),(20,20,'itaque',5,109.11,20,55,165,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,20),(21,21,'sed',3,64.50,22,41,317,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,21),(22,22,'eaque',6,131.00,23,50,270,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,22),(23,23,'nesciunt',4,24.68,24,18,470,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,23),(24,24,'non',4,103.24,26,92,243,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,24),(25,25,'aspernatur',1,183.07,27,68,175,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,25),(26,26,'unde',6,130.99,28,44,466,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,26),(27,27,'consequuntur',1,103.01,30,99,155,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,27),(28,28,'dicta',0,68.22,31,29,142,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,28),(29,29,'eos',0,45.44,32,86,218,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,29),(30,30,'et',0,184.90,34,90,157,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,30),(31,31,'facere',5,128.55,35,97,170,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,31),(32,32,'nam',6,142.79,36,24,295,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,32),(33,33,'quasi',2,64.16,38,28,440,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,33),(34,34,'expedita',2,122.49,39,97,189,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,34),(35,35,'quidem',5,191.29,40,80,426,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,35),(36,36,'qui',3,85.49,42,43,70,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,36),(37,37,'libero',3,93.88,43,66,467,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,37),(38,38,'est',0,108.37,44,23,150,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,38),(39,39,'occaecati',6,61.94,46,26,418,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,39),(40,40,'sequi',2,77.68,47,96,135,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,40),(41,41,'atque',0,63.13,48,92,359,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,41),(42,42,'recusandae',3,32.81,50,23,280,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,42),(43,43,'quam',6,141.51,51,44,395,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,43),(44,44,'culpa',0,108.86,52,54,190,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,44),(45,45,'labore',5,71.13,54,14,281,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,45),(46,46,'quia',4,146.65,55,43,76,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,46),(47,47,'dignissimos',0,139.72,56,22,119,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,47),(48,48,'nisi',5,29.84,58,10,110,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,48),(49,49,'perferendis',2,179.57,59,35,30,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,49),(50,50,'asperiores',6,68.94,60,88,474,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL,50);
/*!40000 ALTER TABLE `medications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_04_21_120650_add_role_to_users_table',1),(5,'2025_04_21_151653_create_customers_table',1),(6,'2025_04_21_154340_create_prescriptions_table',1),(7,'2025_04_21_172034_add_name_to_prescriptions_table',1),(8,'2025_04_22_180507_add_repeat_fields_to_prescriptions_table',1),(9,'2025_04_23_000000_add_delivery_method_to_prescriptions_table',1),(10,'2025_04_23_220530_create_medication_suppliers_table',1),(11,'2025_04_23_220538_create_active_ingredients_table',1),(12,'2025_04_23_220544_create_dosage_forms_table',1),(13,'2025_04_23_220556_create_medications_table',1),(14,'2025_04_23_220612_create_doctors_table',1),(15,'2025_04_23_221752_create_prescription_items_table',1),(16,'2025_04_23_221813_create_orders_table',1),(17,'2025_04_23_221837_create_order_items_table',1),(18,'2025_05_14_080157_add_doctor_id_to_prescriptions_table',1),(19,'2025_06_02_121053_add_patient_id_number_to_prescriptions_table',1),(20,'2025_06_04_132553_create_active_ingredient_medication_table',1),(21,'2025_06_04_132623_create_active_ingredient_user_table',1),(22,'2025_06_04_133546_update_medications_table_drop_active_ingredient_id',1),(23,'2025_06_04_134138_create_allergies_table',1),(24,'2025_06_04_134251_create_allergy_user_table',1),(25,'2025_06_06_052125_create_customer_allergies_table',1),(26,'2025_06_07_160548_create_pharmacies_table',1),(27,'2025_06_07_204509_create_pharmacy_manager_table',1),(28,'2025_06_08_153148_create_pharmacists_table',1),(29,'2025_06_08_160010_update_users_role_column',1),(30,'2025_06_08_201024_add_active_ingredient_id_to_medications_table',1),(31,'2025_06_21_105347_create_stock_orders_table',1),(32,'2025_06_21_105354_create_stock_order_items_table',1),(33,'2025_06_21_125443_create_permission_tables',1),(34,'2025_06_26_150435_create_dispensed_items_table',1),(35,'2025_06_26_150803_add_repeats_used_to_prescription_items_table',1),(36,'2025_06_26_164135_create_generated_reports_table',1),(37,'2025_06_29_185603_add_profile_fields_to_users_table',1),(38,'2025_06_29_185859_create_pharmacist_profiles_table',1),(39,'2025_07_02_151624_add_password_changed_at_to_users_table',1),(40,'2025_07_02_153626_add_is_manual_to_prescriptions_table',1),(41,'2025_07_06_182639_make_file_path_nullable_in_prescriptions_table',1),(42,'2025_07_06_190409_add_pharmacy_id_to_pharmacist_profiles_table',1),(43,'2025_07_06_200000_update_existing_customers_with_missing_details',1),(44,'2025_07_06_201000_create_sample_approved_prescription',1),(45,'2025_07_09_143628_add_profile_completed_to_pharmacist_profiles_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `prescription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_prescription_id_foreign` (`prescription_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_prescription_id_foreign` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) unsigned NOT NULL,
  `order_date` date DEFAULT NULL,
  `status` enum('pending','approved','rejected','dispensed') NOT NULL DEFAULT 'pending',
  `total_amount_due` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_customer_id_foreign` (`customer_id`),
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacies`
--

DROP TABLE IF EXISTS `pharmacies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharmacies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `health_council_registration_number` varchar(255) NOT NULL,
  `physical_address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `responsible_pharmacist_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pharmacies_health_council_registration_number_unique` (`health_council_registration_number`),
  KEY `pharmacies_responsible_pharmacist_id_foreign` (`responsible_pharmacist_id`),
  CONSTRAINT `pharmacies_responsible_pharmacist_id_foreign` FOREIGN KEY (`responsible_pharmacist_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacies`
--

LOCK TABLES `pharmacies` WRITE;
/*!40000 ALTER TABLE `pharmacies` DISABLE KEYS */;
/*!40000 ALTER TABLE `pharmacies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacist_profiles`
--

DROP TABLE IF EXISTS `pharmacist_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharmacist_profiles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `specializations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specializations`)),
  `certifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`certifications`)),
  `qualification` varchar(255) DEFAULT NULL,
  `university` varchar(255) DEFAULT NULL,
  `graduation_year` year(4) DEFAULT NULL,
  `years_experience` int(11) DEFAULT NULL,
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`languages`)),
  `license_status` varchar(255) NOT NULL DEFAULT 'active',
  `license_expiry` date DEFAULT NULL,
  `profile_completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `pharmacy_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pharmacist_profiles_user_id_unique` (`user_id`),
  KEY `pharmacist_profiles_pharmacy_id_foreign` (`pharmacy_id`),
  CONSTRAINT `pharmacist_profiles_pharmacy_id_foreign` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pharmacist_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacist_profiles`
--

LOCK TABLES `pharmacist_profiles` WRITE;
/*!40000 ALTER TABLE `pharmacist_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `pharmacist_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacists`
--

DROP TABLE IF EXISTS `pharmacists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharmacists` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `id_number` varchar(255) NOT NULL,
  `cellphone_number` varchar(255) NOT NULL,
  `health_council_registration_number` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pharmacists_user_id_unique` (`user_id`),
  UNIQUE KEY `pharmacists_id_number_unique` (`id_number`),
  UNIQUE KEY `pharmacists_health_council_registration_number_unique` (`health_council_registration_number`),
  CONSTRAINT `pharmacists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacists`
--

LOCK TABLES `pharmacists` WRITE;
/*!40000 ALTER TABLE `pharmacists` DISABLE KEYS */;
/*!40000 ALTER TABLE `pharmacists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacy_manager`
--

DROP TABLE IF EXISTS `pharmacy_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharmacy_manager` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pharmacy_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pharmacy_manager_pharmacy_id_user_id_unique` (`pharmacy_id`,`user_id`),
  KEY `pharmacy_manager_user_id_foreign` (`user_id`),
  CONSTRAINT `pharmacy_manager_pharmacy_id_foreign` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pharmacy_manager_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacy_manager`
--

LOCK TABLES `pharmacy_manager` WRITE;
/*!40000 ALTER TABLE `pharmacy_manager` DISABLE KEYS */;
/*!40000 ALTER TABLE `pharmacy_manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_items`
--

DROP TABLE IF EXISTS `prescription_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prescription_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint(20) unsigned NOT NULL,
  `medication_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `instructions` text DEFAULT NULL,
  `repeats` int(11) NOT NULL DEFAULT 0,
  `repeats_used` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prescription_items_prescription_id_foreign` (`prescription_id`),
  KEY `prescription_items_medication_id_foreign` (`medication_id`),
  CONSTRAINT `prescription_items_medication_id_foreign` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prescription_items_prescription_id_foreign` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_items`
--

LOCK TABLES `prescription_items` WRITE;
/*!40000 ALTER TABLE `prescription_items` DISABLE KEYS */;
INSERT INTO `prescription_items` VALUES (1,1,1,3,'Consectetur quod veniam quaerat est.',3,0,45.01,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(2,1,8,3,'Asperiores temporibus ex sit dolores unde.',3,0,62.20,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(3,1,15,1,'Porro unde maiores deleniti exercitationem voluptatem natus.',2,0,41.78,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(4,2,8,3,'Rem consequuntur nemo dolores iusto.',2,0,78.80,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(5,2,13,1,'Magni nostrum rem eos officia.',1,0,81.49,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(6,3,2,2,'Nisi magnam veritatis at repellendus vel quibusdam qui fuga.',2,0,70.47,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(7,3,18,2,'Eligendi et voluptatem molestiae.',1,0,90.53,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(8,4,2,2,'Et necessitatibus numquam aliquam facere.',2,0,53.64,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(9,5,2,2,'Dolor aliquid quae ab.',2,0,42.03,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(10,6,6,1,'Atque porro officia maiores explicabo voluptatem non in.',0,0,91.24,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(11,6,7,2,'Aut vero qui perferendis voluptates distinctio.',3,0,92.99,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(12,6,14,2,'Mollitia ducimus veniam autem dolorem in quaerat et.',1,0,33.43,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(13,7,2,3,'Iure numquam earum adipisci ipsum.',1,0,39.39,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(14,7,9,1,'Aut excepturi iure consectetur neque et.',0,0,83.85,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(15,7,16,3,'Et voluptatem veniam dolorum harum.',3,0,88.28,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(16,8,8,1,'Et molestiae rerum itaque sapiente enim.',3,0,51.72,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(17,8,19,3,'Inventore unde adipisci deleniti aut voluptatem at.',3,0,66.78,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(18,9,5,1,'Cupiditate rerum fuga labore aut tenetur.',3,0,31.64,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(19,9,14,1,'Iste accusamus sint architecto libero nostrum.',0,0,34.89,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(20,10,5,3,'Et amet temporibus nostrum autem nesciunt.',2,0,82.98,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(21,10,15,3,'Ducimus aut non sunt neque.',0,0,26.60,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(22,10,18,2,'Rerum officia aliquid est non.',2,0,91.70,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(23,11,2,2,'Voluptatibus odio rerum possimus et ut quia rerum deleniti.',0,0,29.11,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(24,11,7,1,'Sed velit ad soluta rem.',0,0,79.47,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(25,12,8,1,'Voluptatem perspiciatis non inventore totam dolorem sit.',0,0,99.35,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(26,12,11,3,'Et a corporis a.',0,0,33.64,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(27,12,16,3,'Qui et aut quia harum esse consectetur est.',0,0,89.87,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(28,13,7,2,'Quaerat unde reiciendis qui rerum et est.',0,0,37.09,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(29,13,17,3,'Facere sunt enim velit temporibus.',3,0,89.57,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(30,14,9,3,'Facilis eos quam recusandae optio esse et.',0,0,47.99,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(31,14,11,3,'Et delectus quaerat est sint vel minima id.',0,0,48.97,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(32,14,19,1,'Est in eveniet commodi.',0,0,40.75,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(33,15,10,2,'Ipsa vel sed quidem asperiores similique non quae.',0,0,63.57,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(34,15,12,2,'Doloribus qui dolorem pariatur odio placeat.',2,0,45.71,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(35,15,17,2,'Rerum est enim sed odio.',2,0,57.96,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(36,16,18,3,'Minus consequatur qui in consequatur accusamus.',3,0,97.28,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(37,16,19,1,'Aut suscipit et non eum facere rerum omnis assumenda.',0,0,39.27,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(38,16,20,2,'Asperiores nisi eum necessitatibus quia.',1,0,27.82,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(39,17,12,1,'Dolor voluptas id consequatur dolorem praesentium quia provident.',2,0,60.36,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(40,17,19,3,'Fuga aliquid officiis rem.',3,0,50.86,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(41,18,14,1,'Illo dicta perferendis et dolorem nobis praesentium ut.',0,0,43.46,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(42,19,1,1,'Voluptatem itaque mollitia fugit vitae et qui molestias vel.',3,0,47.75,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(43,19,13,1,'Laborum animi molestiae sunt modi rem nesciunt consequatur.',3,0,28.75,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(44,19,19,2,'Placeat quo laboriosam magnam provident vel adipisci eveniet.',3,0,50.96,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(45,20,2,3,'Amet et incidunt recusandae.',0,0,58.62,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(46,21,4,3,'Natus quis numquam omnis qui.',2,0,34.36,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(47,21,5,3,'Cupiditate ut id quis aut rerum.',2,0,41.59,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(48,21,6,2,'Eligendi dolorum molestias et repudiandae suscipit voluptatem maiores.',0,0,64.22,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL),(49,22,11,3,'Eligendi fuga maxime rerum eligendi et et.',3,0,76.31,'2025-07-23 13:28:57','2025-07-23 13:28:57',NULL);
/*!40000 ALTER TABLE `prescription_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prescriptions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `patient_id_number` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `is_manual` tinyint(1) NOT NULL DEFAULT 0,
  `delivery_method` enum('pickup','dispense') DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `repeats_total` int(11) NOT NULL DEFAULT 0,
  `repeats_used` int(11) NOT NULL DEFAULT 0,
  `next_repeat_date` date DEFAULT NULL,
  `doctor_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prescriptions_user_id_foreign` (`user_id`),
  KEY `prescriptions_doctor_id_foreign` (`doctor_id`),
  CONSTRAINT `prescriptions_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prescriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (1,3,NULL,'Voluptatem voluptate vel aliquid.','prescriptions/sample.pdf','rejected',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',2,0,'2025-10-15',8),(2,3,NULL,'Est aut voluptatibus nulla.','prescriptions/sample.pdf','dispensed',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',3,2,'2025-09-06',7),(3,4,NULL,'Laborum magni dignissimos provident.','prescriptions/sample.pdf','approved',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',3,3,'2025-09-06',4),(4,4,NULL,'Dolores eos quia ratione.','prescriptions/sample.pdf','rejected',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',4,3,'2025-09-20',1),(5,5,NULL,'Error unde vero quae.','prescriptions/sample.pdf','dispensed',0,NULL,'Quia iste aliquam est cumque quod fuga.',NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',2,3,'2025-08-31',2),(6,5,NULL,'Quae rerum dignissimos.','prescriptions/sample.pdf','approved',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',4,3,'2025-09-30',8),(7,6,NULL,'Unde enim praesentium temporibus.','prescriptions/sample.pdf','dispensed',0,NULL,'Quo ut exercitationem quis repellat alias aliquid voluptatem.',NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',1,2,'2025-08-19',5),(8,6,NULL,'Quas porro voluptatum autem.','prescriptions/sample.pdf','dispensed',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',1,1,'2025-08-11',9),(9,7,NULL,'Necessitatibus quaerat eos.','prescriptions/sample.pdf','approved',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',6,1,'2025-09-13',10),(10,7,NULL,'Exercitationem ullam repellat.','prescriptions/sample.pdf','approved',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',4,2,'2025-08-22',9),(11,8,NULL,'Dolor consequatur aut.','prescriptions/sample.pdf','dispensed',0,NULL,'Est deserunt necessitatibus qui nesciunt iure illum.',NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',2,2,'2025-08-21',7),(12,8,NULL,'Esse eum aperiam.','prescriptions/sample.pdf','dispensed',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',5,1,'2025-08-06',4),(13,9,NULL,'Minus qui dolor quas.','prescriptions/sample.pdf','approved',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',3,1,'2025-07-30',2),(14,9,NULL,'Saepe asperiores ipsa.','prescriptions/sample.pdf','dispensed',0,NULL,'Vel sunt in magni delectus omnis iste modi.',NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',4,2,'2025-09-30',9),(15,10,NULL,'Quasi consectetur qui.','prescriptions/sample.pdf','pending',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',1,3,'2025-10-19',10),(16,10,NULL,'Suscipit possimus nemo.','prescriptions/sample.pdf','pending',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',3,1,'2025-09-14',10),(17,11,NULL,'Asperiores dolorum magni omnis.','prescriptions/sample.pdf','dispensed',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',3,1,'2025-09-14',3),(18,11,NULL,'Ipsam sint eum velit.','prescriptions/sample.pdf','rejected',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',4,0,'2025-09-07',9),(19,12,NULL,'Corporis commodi sit molestiae eius.','prescriptions/sample.pdf','pending',0,NULL,'Dolorem et quasi eum labore quia eum officia.',NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',2,0,'2025-10-17',10),(20,12,NULL,'Totam maxime quia autem.','prescriptions/sample.pdf','dispensed',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',4,2,'2025-09-19',3),(21,13,NULL,'Dicta est et sequi distinctio.','prescriptions/sample.pdf','dispensed',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',4,3,'2025-09-05',4),(22,13,NULL,'Modi perferendis omnis doloribus.','prescriptions/sample.pdf','approved',0,NULL,NULL,NULL,'2025-07-23 13:28:57','2025-07-23 13:28:57',6,0,'2025-09-06',9);
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'manager','web','2025-07-23 13:28:56','2025-07-23 13:28:56'),(2,'pharmacist','web','2025-07-23 13:28:56','2025-07-23 13:28:56'),(3,'customer','web','2025-07-23 13:28:56','2025-07-23 13:28:56');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_order_items`
--

DROP TABLE IF EXISTS `stock_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `stock_order_id` bigint(20) unsigned NOT NULL,
  `medication_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_order_items_stock_order_id_foreign` (`stock_order_id`),
  KEY `stock_order_items_medication_id_foreign` (`medication_id`),
  CONSTRAINT `stock_order_items_medication_id_foreign` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_order_items_stock_order_id_foreign` FOREIGN KEY (`stock_order_id`) REFERENCES `stock_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_order_items`
--

LOCK TABLES `stock_order_items` WRITE;
/*!40000 ALTER TABLE `stock_order_items` DISABLE KEYS */;
INSERT INTO `stock_order_items` VALUES (1,1,21,6,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(2,1,22,31,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(3,1,23,93,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(4,2,24,13,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(5,2,25,79,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(6,2,26,64,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(7,3,27,27,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(8,3,28,86,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(9,3,29,41,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(10,4,30,22,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(11,4,31,94,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(12,4,32,43,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(13,5,33,9,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(14,5,34,88,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(15,5,35,36,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(16,6,36,31,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(17,6,37,17,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(18,6,38,77,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(19,7,39,56,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(20,7,40,59,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(21,7,41,39,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(22,8,42,58,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(23,8,43,24,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(24,8,44,3,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(25,9,45,8,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(26,9,46,86,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(27,9,47,15,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(28,10,48,46,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(29,10,49,79,'2025-07-23 13:28:57','2025-07-23 13:28:57'),(30,10,50,9,'2025-07-23 13:28:57','2025-07-23 13:28:57');
/*!40000 ALTER TABLE `stock_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_orders`
--

DROP TABLE IF EXISTS `stock_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `supplier_id` bigint(20) unsigned NOT NULL,
  `status` enum('Pending','Received') NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stock_orders_order_number_unique` (`order_number`),
  KEY `stock_orders_supplier_id_foreign` (`supplier_id`),
  CONSTRAINT `stock_orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `medication_suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_orders`
--

LOCK TABLES `stock_orders` WRITE;
/*!40000 ALTER TABLE `stock_orders` DISABLE KEYS */;
INSERT INTO `stock_orders` VALUES (1,'ORD-20250723-0001',21,'Received','2025-07-23 13:28:57','2025-07-23 13:28:57'),(2,'ORD-20250723-0002',25,'Received','2025-07-23 13:28:57','2025-07-23 13:28:57'),(3,'ORD-20250723-0003',29,'Received','2025-07-23 13:28:57','2025-07-23 13:28:57'),(4,'ORD-20250723-0004',33,'Pending','2025-07-23 13:28:57','2025-07-23 13:28:57'),(5,'ORD-20250723-0005',37,'Received','2025-07-23 13:28:57','2025-07-23 13:28:57'),(6,'ORD-20250723-0006',41,'Pending','2025-07-23 13:28:57','2025-07-23 13:28:57'),(7,'ORD-20250723-0007',45,'Received','2025-07-23 13:28:57','2025-07-23 13:28:57'),(8,'ORD-20250723-0008',49,'Received','2025-07-23 13:28:57','2025-07-23 13:28:57'),(9,'ORD-20250723-0009',53,'Pending','2025-07-23 13:28:57','2025-07-23 13:28:57'),(10,'ORD-20250723-0010',57,'Pending','2025-07-23 13:28:57','2025-07-23 13:28:57');
/*!40000 ALTER TABLE `stock_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `specializations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specializations`)),
  `certifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`certifications`)),
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `password_changed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Manager User',NULL,'manager@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'$2y$12$IAy0/sZRqwg4QeuEk1woD.fHSOVeqj/OkhOBwPP4AdtVPCzvhJuXO',NULL,NULL,'2025-07-23 13:28:56','2025-07-23 13:28:56','manager'),(2,'Pharmacist User',NULL,'pharmacist@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'$2y$12$JYATB6IE92xShvG2xPUpZ.wd3aa8UYO5XQht3MlTKQPZ8SbySu/FC',NULL,NULL,'2025-07-23 13:28:56','2025-07-23 13:28:56','pharmacist'),(3,'Customer User',NULL,'customer@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'$2y$12$IMBHkbSyQP7Sz3s/LTsJweRk0OujBsTb6RQFr/LEwN20NZL/VYgSe',NULL,NULL,'2025-07-23 13:28:56','2025-07-23 13:28:56','customer'),(4,'Brenda Fay',NULL,'vandervort.isabelle@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'snfmxeoN3i','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(5,'Amelie Steuber',NULL,'eloisa11@example.org',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'MgDhLnt46X','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(6,'Cody Hodkiewicz',NULL,'atowne@example.net',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'YIAQ9bsYmk','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(7,'Miss Maudie Heller PhD',NULL,'anika.gleichner@example.org',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'4zPgL3cv9U','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(8,'Lisandro Murazik MD',NULL,'durward42@example.org',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'41TTzFnlcy','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(9,'Dr. Cielo Jacobi',NULL,'maryam55@example.org',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'MbAcnlu7rz','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(10,'Irma Jacobson',NULL,'mrussel@example.net',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'iqEuCadSgU','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(11,'Alexa D\'Amore',NULL,'grady06@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'mtTv1OSLCs','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(12,'Dr. Wendy Grant DDS',NULL,'price.andreanne@example.org',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'3UNOuKbHwn','2025-07-23 13:28:57','2025-07-23 13:28:57','customer'),(13,'Elijah Bauch Jr.',NULL,'laney14@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-07-23 13:28:57','$2y$12$8E1NlxaV4AsoI6rIYFihD..ghNTRq2HI7Oa8YjociGFTTWEGjL.Lm',NULL,'IlO7KmZEO4','2025-07-23 13:28:57','2025-07-23 13:28:57','customer');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-25 18:47:49
