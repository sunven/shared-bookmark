-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "github" VARCHAR(128),
ALTER COLUMN "url" DROP NOT NULL;