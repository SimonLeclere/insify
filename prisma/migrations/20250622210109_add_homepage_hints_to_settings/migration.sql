/*
  Warnings:

  - You are about to drop the column `displayHintsOnHomepage` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "displayHintsOnHomepage",
ADD COLUMN     "homepageHints" BOOLEAN DEFAULT true;
