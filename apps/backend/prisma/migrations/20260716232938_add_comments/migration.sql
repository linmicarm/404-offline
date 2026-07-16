-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "side_quest_id" INTEGER NOT NULL,
    "author_name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_side_quest_id_fkey" FOREIGN KEY ("side_quest_id") REFERENCES "side_quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
