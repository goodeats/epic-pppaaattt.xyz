/*
  Warnings:

  - Added the required column `ownerId` to the `ArtboardBranch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `ArtboardVersion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArtboardBranch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'main',
    "description" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "artboardId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "ArtboardBranch_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardBranch_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardBranch_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ArtboardBranch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ArtboardBranch" ("active", "artboardId", "createdAt", "default", "description", "id", "name", "parentId", "updatedAt") SELECT "active", "artboardId", "createdAt", "default", "description", "id", "name", "parentId", "updatedAt" FROM "ArtboardBranch";
DROP TABLE "ArtboardBranch";
ALTER TABLE "new_ArtboardBranch" RENAME TO "ArtboardBranch";
CREATE INDEX "ArtboardBranch_artboardId_idx" ON "ArtboardBranch"("artboardId");
CREATE INDEX "ArtboardBranch_ownerId_idx" ON "ArtboardBranch"("ownerId");
CREATE UNIQUE INDEX "ArtboardBranch_artboardId_default_key" ON "ArtboardBranch"("artboardId", "default");
CREATE UNIQUE INDEX "ArtboardBranch_artboardId_name_key" ON "ArtboardBranch"("artboardId", "name");
CREATE TABLE "new_ArtboardVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'latest',
    "description" TEXT,
    "latest" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "artboardId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "nextId" TEXT,
    "prevId" TEXT,
    CONSTRAINT "ArtboardVersion_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardVersion_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardVersion_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "ArtboardBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardVersion_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "ArtboardVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ArtboardVersion" ("artboardId", "branchId", "createdAt", "description", "id", "latest", "name", "nextId", "prevId", "updatedAt") SELECT "artboardId", "branchId", "createdAt", "description", "id", "latest", "name", "nextId", "prevId", "updatedAt" FROM "ArtboardVersion";
DROP TABLE "ArtboardVersion";
ALTER TABLE "new_ArtboardVersion" RENAME TO "ArtboardVersion";
CREATE UNIQUE INDEX "ArtboardVersion_nextId_key" ON "ArtboardVersion"("nextId");
CREATE UNIQUE INDEX "ArtboardVersion_prevId_key" ON "ArtboardVersion"("prevId");
CREATE INDEX "ArtboardVersion_artboardId_idx" ON "ArtboardVersion"("artboardId");
CREATE INDEX "ArtboardVersion_branchId_idx" ON "ArtboardVersion"("branchId");
CREATE INDEX "ArtboardVersion_ownerId_idx" ON "ArtboardVersion"("ownerId");
CREATE UNIQUE INDEX "ArtboardVersion_branchId_latest_key" ON "ArtboardVersion"("branchId", "latest");
CREATE UNIQUE INDEX "ArtboardVersion_branchId_name_key" ON "ArtboardVersion"("branchId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
