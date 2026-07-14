-- CreateTable
CREATE TABLE "spawn_points" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_marta_accessible" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spawn_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "side_quests" (
    "id" SERIAL NOT NULL,
    "spawn_point_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "cost" DOUBLE PRECISION,
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "is_beginner_friendly" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "going_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "side_quests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "side_quests" ADD CONSTRAINT "side_quests_spawn_point_id_fkey" FOREIGN KEY ("spawn_point_id") REFERENCES "spawn_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
