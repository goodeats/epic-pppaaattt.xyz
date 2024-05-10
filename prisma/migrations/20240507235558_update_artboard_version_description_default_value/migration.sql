-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArtboardVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'v0',
    "slug" TEXT NOT NULL DEFAULT 'v0',
    "description" TEXT NOT NULL DEFAULT 'initial version',
    "width" INTEGER NOT NULL DEFAULT 1080,
    "height" INTEGER NOT NULL DEFAULT 1920,
    "background" TEXT NOT NULL DEFAULT 'FFFFFF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "nextId" TEXT,
    "prevId" TEXT,
    CONSTRAINT "ArtboardVersion_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardVersion_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "ArtboardBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardVersion_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "ArtboardVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ArtboardVersion" ("background", "branchId", "createdAt", "description", "height", "id", "name", "nextId", "ownerId", "prevId", "slug", "updatedAt", "width") SELECT "background", "branchId", "createdAt", coalesce("description", 'initial version') AS "description", "height", "id", "name", "nextId", "ownerId", "prevId", "slug", "updatedAt", "width" FROM "ArtboardVersion";
DROP TABLE "ArtboardVersion";
ALTER TABLE "new_ArtboardVersion" RENAME TO "ArtboardVersion";
CREATE UNIQUE INDEX "ArtboardVersion_nextId_key" ON "ArtboardVersion"("nextId");
CREATE UNIQUE INDEX "ArtboardVersion_prevId_key" ON "ArtboardVersion"("prevId");
CREATE INDEX "ArtboardVersion_branchId_idx" ON "ArtboardVersion"("branchId");
CREATE INDEX "ArtboardVersion_ownerId_idx" ON "ArtboardVersion"("ownerId");
CREATE UNIQUE INDEX "ArtboardVersion_branchId_name_key" ON "ArtboardVersion"("branchId", "name");
CREATE UNIQUE INDEX "ArtboardVersion_branchId_slug_key" ON "ArtboardVersion"("branchId", "slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
