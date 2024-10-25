/*
  Warnings:

  - You are about to drop the `Website` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Website" DROP CONSTRAINT "Website_topicId_fkey";

-- DropTable
DROP TABLE "Website";

-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "icon" VARCHAR(128),
    "url" VARCHAR(128) NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" VARCHAR(512),
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
