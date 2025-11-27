/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Category` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Category_label_key` ON `Category`(`label`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_value_key` ON `Category`(`value`);
