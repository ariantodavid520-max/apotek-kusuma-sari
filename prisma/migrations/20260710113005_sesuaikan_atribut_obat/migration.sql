/*
  Warnings:

  - You are about to drop the column `complaintGroup` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the column `dosageForm` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the column `mainFeatures` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the column `preprocessedText` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the column `rawText` on the `medicines` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `medicines_complaintGroup_idx` ON `medicines`;

-- AlterTable
ALTER TABLE `medicines` DROP COLUMN `complaintGroup`,
    DROP COLUMN `dosageForm`,
    DROP COLUMN `mainFeatures`,
    DROP COLUMN `preprocessedText`,
    DROP COLUMN `rawText`;
