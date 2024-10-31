-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_topicId_fkey";

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
