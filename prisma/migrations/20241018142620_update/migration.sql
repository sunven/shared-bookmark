-- DropForeignKey
ALTER TABLE "SoftwareTag" DROP CONSTRAINT "SoftwareTag_softwareId_fkey";

-- AddForeignKey
ALTER TABLE "SoftwareTag" ADD CONSTRAINT "SoftwareTag_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;
