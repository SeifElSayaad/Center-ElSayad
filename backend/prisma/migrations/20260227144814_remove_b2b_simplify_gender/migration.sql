/*
  Warnings:

  - The values [PREFER_NOT_TO_SAY] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [B2B] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `discountPercent` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `isB2BOrder` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `b2b_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "users" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('B2C', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "userType" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "userType" TYPE "UserType_new" USING ("userType"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "public"."UserType_old";
ALTER TABLE "users" ALTER COLUMN "userType" SET DEFAULT 'B2C';
COMMIT;

-- DropForeignKey
ALTER TABLE "b2b_profiles" DROP CONSTRAINT "b2b_profiles_userId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "discountPercent",
DROP COLUMN "isB2BOrder";

-- DropTable
DROP TABLE "b2b_profiles";
