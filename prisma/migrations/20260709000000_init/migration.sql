CREATE TABLE `medicines` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `sourceNo` INTEGER NOT NULL,
  `name` VARCHAR(180) NOT NULL,
  `category` VARCHAR(120) NOT NULL,
  `dosageForm` VARCHAR(80) NULL,
  `symptoms` TEXT NOT NULL,
  `indication` TEXT NOT NULL,
  `usageDescription` TEXT NOT NULL,
  `rawText` LONGTEXT NOT NULL,
  `preprocessedText` LONGTEXT NOT NULL,
  `mainFeatures` TEXT NOT NULL,
  `complaintGroup` VARCHAR(120) NULL,
  `price` INTEGER NULL,
  `imageUrl` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `medicines_sourceNo_key`(`sourceNo`),
  INDEX `medicines_name_idx`(`name`),
  INDEX `medicines_category_idx`(`category`),
  INDEX `medicines_complaintGroup_idx`(`complaintGroup`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `recommendation_histories` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `patientName` VARCHAR(120) NULL,
  `age` INTEGER NULL,
  `complaint` TEXT NOT NULL,
  `duration` VARCHAR(120) NULL,
  `diseaseHistory` TEXT NULL,
  `topMedicineName` VARCHAR(180) NULL,
  `topSimilarity` DOUBLE NULL,
  `resultSnapshot` LONGTEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `recommendation_histories_createdAt_idx`(`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
