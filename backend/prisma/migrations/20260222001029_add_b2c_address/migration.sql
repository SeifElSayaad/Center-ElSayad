/*
  Warnings:

  - A unique constraint covering the columns `[defaultAddressId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "defaultAddressId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_defaultAddressId_key" ON "users"("defaultAddressId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_defaultAddressId_fkey" FOREIGN KEY ("defaultAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
