-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "theme" TEXT DEFAULT 'system',
ALTER COLUMN "language" SET DEFAULT 'en';
