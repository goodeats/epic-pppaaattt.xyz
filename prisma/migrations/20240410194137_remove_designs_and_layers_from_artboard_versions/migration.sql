/*
  Warnings:

  - You are about to drop the column `artboardBranchId` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `artboardBranchId` on the `Layer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Design" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextId" TEXT,
    "prevId" TEXT,
    "ownerId" TEXT NOT NULL,
    "artboardId" TEXT,
    "artboardVersionId" TEXT,
    "layerId" TEXT,
    CONSTRAINT "Design_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Design_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_artboardVersionId_fkey" FOREIGN KEY ("artboardVersionId") REFERENCES "ArtboardVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Design" ("artboardId", "artboardVersionId", "createdAt", "id", "layerId", "nextId", "ownerId", "prevId", "selected", "type", "visible") SELECT "artboardId", "artboardVersionId", "createdAt", "id", "layerId", "nextId", "ownerId", "prevId", "selected", "type", "visible" FROM "Design";
DROP TABLE "Design";
ALTER TABLE "new_Design" RENAME TO "Design";
CREATE UNIQUE INDEX "Design_nextId_key" ON "Design"("nextId");
CREATE UNIQUE INDEX "Design_prevId_key" ON "Design"("prevId");
CREATE INDEX "Design_ownerId_idx" ON "Design"("ownerId");
CREATE INDEX "Design_layerId_idx" ON "Design"("layerId");
CREATE INDEX "Design_artboardVersionId_idx" ON "Design"("artboardVersionId");
CREATE TABLE "new_Layer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "artboardId" TEXT,
    "artboardVersionId" TEXT,
    "nextId" TEXT,
    "prevId" TEXT,
    "parentId" TEXT,
    CONSTRAINT "Layer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_artboardVersionId_fkey" FOREIGN KEY ("artboardVersionId") REFERENCES "ArtboardVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Layer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Layer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Layer" ("artboardId", "artboardVersionId", "createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "slug", "updatedAt", "visible") SELECT "artboardId", "artboardVersionId", "createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "slug", "updatedAt", "visible" FROM "Layer";
DROP TABLE "Layer";
ALTER TABLE "new_Layer" RENAME TO "Layer";
CREATE UNIQUE INDEX "Layer_nextId_key" ON "Layer"("nextId");
CREATE UNIQUE INDEX "Layer_prevId_key" ON "Layer"("prevId");
CREATE INDEX "Layer_ownerId_idx" ON "Layer"("ownerId");
CREATE INDEX "Layer_artboardVersionId_idx" ON "Layer"("artboardVersionId");
CREATE INDEX "Layer_parentId_idx" ON "Layer"("parentId");
CREATE INDEX "Layer_ownerId_updatedAt_idx" ON "Layer"("ownerId", "updatedAt");
CREATE UNIQUE INDEX "Layer_slug_ownerId_key" ON "Layer"("slug", "ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
