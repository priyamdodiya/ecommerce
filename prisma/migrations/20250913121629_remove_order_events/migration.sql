/*
  Warnings:

  - You are about to drop the `order_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."order_events" DROP CONSTRAINT "order_events_orderId_fkey";

-- DropTable
DROP TABLE "public"."order_events";
