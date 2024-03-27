/*
  Warnings:

  - You are about to drop the column `rotation` on the `Rotate` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rotate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL DEFAULT 0,
    "basis" TEXT NOT NULL DEFAULT 'defined',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "designId" TEXT NOT NULL,
    CONSTRAINT "Rotate_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rotate" ("basis", "createdAt", "designId", "id", "updatedAt") SELECT "basis", "createdAt", "designId", "id", "updatedAt" FROM "Rotate";
DROP TABLE "Rotate";
ALTER TABLE "new_Rotate" RENAME TO "Rotate";
CREATE UNIQUE INDEX "Rotate_designId_key" ON "Rotate"("designId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
