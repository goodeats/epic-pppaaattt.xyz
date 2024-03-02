-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Palette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "format" TEXT NOT NULL DEFAULT 'hex',
    "value" TEXT NOT NULL DEFAULT '000000',
    "opacity" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "designId" TEXT NOT NULL,
    CONSTRAINT "Palette_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Palette" ("createdAt", "designId", "format", "id", "opacity", "updatedAt", "value") SELECT "createdAt", "designId", "format", "id", "opacity", "updatedAt", "value" FROM "Palette";
DROP TABLE "Palette";
ALTER TABLE "new_Palette" RENAME TO "Palette";
CREATE UNIQUE INDEX "Palette_designId_key" ON "Palette"("designId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
