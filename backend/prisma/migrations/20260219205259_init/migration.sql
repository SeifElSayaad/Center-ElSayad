/*
  Warnings:

  - You are about to drop the `wishlist_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_userId_fkey";

-- DropTable
DROP TABLE "wishlist_items";
