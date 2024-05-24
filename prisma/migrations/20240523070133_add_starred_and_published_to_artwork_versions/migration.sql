-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArtworkVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'v0',
    "slug" TEXT NOT NULL DEFAULT 'v0',
    "description" TEXT NOT NULL DEFAULT 'initial version',
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "width" INTEGER NOT NULL DEFAULT 1080,
    "height" INTEGER NOT NULL DEFAULT 1920,
    "background" TEXT NOT NULL DEFAULT 'FFFFFF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "nextId" TEXT,
    "prevId" TEXT,
    CONSTRAINT "ArtworkVersion_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkVersion_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "ArtworkBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkVersion_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "ArtworkVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ArtworkVersion" ("background", "branchId", "createdAt", "description", "height", "id", "name", "nextId", "ownerId", "prevId", "slug", "updatedAt", "width") SELECT "background", "branchId", "createdAt", "description", "height", "id", "name", "nextId", "ownerId", "prevId", "slug", "updatedAt", "width" FROM "ArtworkVersion";
DROP TABLE "ArtworkVersion";
ALTER TABLE "new_ArtworkVersion" RENAME TO "ArtworkVersion";
CREATE UNIQUE INDEX "ArtworkVersion_nextId_key" ON "ArtworkVersion"("nextId");
CREATE UNIQUE INDEX "ArtworkVersion_prevId_key" ON "ArtworkVersion"("prevId");
CREATE INDEX "ArtworkVersion_branchId_idx" ON "ArtworkVersion"("branchId");
CREATE INDEX "ArtworkVersion_ownerId_idx" ON "ArtworkVersion"("ownerId");
CREATE UNIQUE INDEX "ArtworkVersion_branchId_name_key" ON "ArtworkVersion"("branchId", "name");
CREATE UNIQUE INDEX "ArtworkVersion_branchId_slug_key" ON "ArtworkVersion"("branchId", "slug");
PRAGMA foreign_key_check("ArtworkVersion");
PRAGMA foreign_keys=ON;
