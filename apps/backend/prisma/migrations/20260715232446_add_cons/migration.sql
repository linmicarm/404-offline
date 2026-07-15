-- CreateTable
CREATE TABLE "cons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ticket_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cons_pkey" PRIMARY KEY ("id")
);
