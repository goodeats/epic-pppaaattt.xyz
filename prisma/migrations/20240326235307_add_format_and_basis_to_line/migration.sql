-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Line" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "width" REAL NOT NULL DEFAULT 1,
    "format" TEXT NOT NULL DEFAULT 'pixel',
    "basis" TEXT NOT NULL DEFAULT 'width',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "designId" TEXT NOT NULL,
    CONSTRAINT "Line_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Line" ("createdAt", "designId", "id", "updatedAt", "width") SELECT "createdAt", "designId", "id", "updatedAt", "width" FROM "Line";
DROP TABLE "Line";
ALTER TABLE "new_Line" RENAME TO "Line";
CREATE UNIQUE INDEX "Line_designId_key" ON "Line"("designId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
