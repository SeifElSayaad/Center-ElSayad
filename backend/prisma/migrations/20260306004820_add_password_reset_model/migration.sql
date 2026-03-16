/*
  Warnings:

  - You are about to drop the column `b2bDiscountPercent` on the `store_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "store_settings" DROP COLUMN "b2bDiscountPercent";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authProvider" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- DropEnum
DROP TYPE "B2BStatus";

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
