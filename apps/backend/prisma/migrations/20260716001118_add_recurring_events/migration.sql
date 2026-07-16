-- AlterTable
ALTER TABLE "side_quests" ADD COLUMN     "is_recurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrence" TEXT;
