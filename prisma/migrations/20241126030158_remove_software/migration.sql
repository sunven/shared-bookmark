/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Software` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoftwareTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareTag" DROP CONSTRAINT "SoftwareTag_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareTag" DROP CONSTRAINT "SoftwareTag_tagId_fkey";

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "description" VARCHAR(512);

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Software";

-- DropTable
DROP TABLE "SoftwareTag";

-- DropTable
DROP TABLE "Tag";
