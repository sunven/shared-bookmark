-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "updaterId" TEXT;

-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "updaterId" TEXT;
