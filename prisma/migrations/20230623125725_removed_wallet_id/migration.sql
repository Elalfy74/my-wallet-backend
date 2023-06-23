/*
  Warnings:

  - You are about to drop the column `walletId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_walletId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "walletId";
