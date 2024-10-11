/*
  Warnings:

  - A unique constraint covering the columns `[transactionID]` on the table `deposits` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "deposits_transactionID_key" ON "deposits"("transactionID");
