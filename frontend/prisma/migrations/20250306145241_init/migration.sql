/*
  Warnings:

  - The primary key for the `CalendarEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,id]` on the table `CalendarEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CalendarEvent_userId_title_start_key";

-- AlterTable
ALTER TABLE "CalendarEvent" DROP CONSTRAINT "CalendarEvent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CalendarEvent_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_userId_id_key" ON "CalendarEvent"("userId", "id");
