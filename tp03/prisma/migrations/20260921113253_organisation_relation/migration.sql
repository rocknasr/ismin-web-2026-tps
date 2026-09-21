/*
  Warnings:

  - You are about to drop the column `org` on the `Model` table. All the data in the column will be lost.
  - Added the required column `orgId` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "parameters" REAL NOT NULL,
    "downloads" INTEGER NOT NULL,
    "license" TEXT,
    "orgId" TEXT NOT NULL,
    CONSTRAINT "Model_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Model" ("downloads", "id", "license", "name", "parameters", "task") SELECT "downloads", "id", "license", "name", "parameters", "task" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_slug_key" ON "Organisation"("slug");
