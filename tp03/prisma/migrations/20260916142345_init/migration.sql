-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "parameters" REAL NOT NULL,
    "downloads" INTEGER NOT NULL,
    "license" TEXT
);
