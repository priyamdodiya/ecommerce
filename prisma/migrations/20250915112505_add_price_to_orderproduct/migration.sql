/*
  Warnings:

  - You are about to drop the column `address` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "address",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "public"."orders_products" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;
