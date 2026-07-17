-- CreateTable
CREATE TABLE "suggestions" (
    "id" SERIAL NOT NULL,
    "spawn_point_id" INTEGER NOT NULL,
    "author_name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "current_value" TEXT,
    "suggested_value" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_spawn_point_id_fkey" FOREIGN KEY ("spawn_point_id") REFERENCES "spawn_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;
