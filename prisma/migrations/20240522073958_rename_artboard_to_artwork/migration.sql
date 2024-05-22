/*
  Warnings:

  - You are about to drop the `Artboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtboardBranch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtboardMergeRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtboardVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `artboardVersionId` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `artboardVersionId` on the `Layer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Artboard_slug_ownerId_key";

-- DropIndex
DROP INDEX "Artboard_ownerId_updatedAt_idx";

-- DropIndex
DROP INDEX "Artboard_projectId_updatedAt_idx";

-- DropIndex
DROP INDEX "Artboard_ownerId_idx";

-- DropIndex
DROP INDEX "Artboard_projectId_idx";

-- DropIndex
DROP INDEX "ArtboardBranch_artboardId_slug_key";

-- DropIndex
DROP INDEX "ArtboardBranch_artboardId_name_key";

-- DropIndex
DROP INDEX "ArtboardBranch_ownerId_idx";

-- DropIndex
DROP INDEX "ArtboardBranch_artboardId_idx";

-- DropIndex
DROP INDEX "ArtboardMergeRequest_targetBranchId_idx";

-- DropIndex
DROP INDEX "ArtboardMergeRequest_sourceBranchId_idx";

-- DropIndex
DROP INDEX "ArtboardMergeRequest_artboardId_idx";

-- DropIndex
DROP INDEX "ArtboardVersion_branchId_slug_key";

-- DropIndex
DROP INDEX "ArtboardVersion_branchId_name_key";

-- DropIndex
DROP INDEX "ArtboardVersion_ownerId_idx";

-- DropIndex
DROP INDEX "ArtboardVersion_branchId_idx";

-- DropIndex
DROP INDEX "ArtboardVersion_prevId_key";

-- DropIndex
DROP INDEX "ArtboardVersion_nextId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Artboard";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtboardBranch";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtboardMergeRequest";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtboardVersion";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Artwork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Artwork_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Artwork_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtworkBranch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'main',
    "slug" TEXT NOT NULL DEFAULT 'main',
    "description" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "ArtworkBranch_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkBranch_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkBranch_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ArtworkBranch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtworkVersion" (
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
    CONSTRAINT "ArtworkVersion_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkVersion_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "ArtworkBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkVersion_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "ArtworkVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtworkMergeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "artworkId" TEXT NOT NULL,
    "sourceBranchId" TEXT NOT NULL,
    "targetBranchId" TEXT NOT NULL,
    CONSTRAINT "ArtworkMergeRequest_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkMergeRequest_sourceBranchId_fkey" FOREIGN KEY ("sourceBranchId") REFERENCES "ArtworkBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtworkMergeRequest_targetBranchId_fkey" FOREIGN KEY ("targetBranchId") REFERENCES "ArtworkBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "artworkVersionId" TEXT,
    "layerId" TEXT,
    CONSTRAINT "Design_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Design_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_artworkVersionId_fkey" FOREIGN KEY ("artworkVersionId") REFERENCES "ArtworkVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Design" ("createdAt", "id", "layerId", "nextId", "ownerId", "prevId", "selected", "type", "visible") SELECT "createdAt", "id", "layerId", "nextId", "ownerId", "prevId", "selected", "type", "visible" FROM "Design";
DROP TABLE "Design";
ALTER TABLE "new_Design" RENAME TO "Design";
CREATE UNIQUE INDEX "Design_nextId_key" ON "Design"("nextId");
CREATE UNIQUE INDEX "Design_prevId_key" ON "Design"("prevId");
CREATE INDEX "Design_ownerId_idx" ON "Design"("ownerId");
CREATE INDEX "Design_layerId_idx" ON "Design"("layerId");
CREATE INDEX "Design_artworkVersionId_idx" ON "Design"("artworkVersionId");
CREATE TABLE "new_Layer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "artworkVersionId" TEXT,
    "nextId" TEXT,
    "prevId" TEXT,
    "parentId" TEXT,
    CONSTRAINT "Layer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_artworkVersionId_fkey" FOREIGN KEY ("artworkVersionId") REFERENCES "ArtworkVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Layer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Layer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Layer" ("createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "selected", "slug", "updatedAt", "visible") SELECT "createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "selected", "slug", "updatedAt", "visible" FROM "Layer";
DROP TABLE "Layer";
ALTER TABLE "new_Layer" RENAME TO "Layer";
CREATE UNIQUE INDEX "Layer_nextId_key" ON "Layer"("nextId");
CREATE UNIQUE INDEX "Layer_prevId_key" ON "Layer"("prevId");
CREATE INDEX "Layer_ownerId_idx" ON "Layer"("ownerId");
CREATE INDEX "Layer_artworkVersionId_idx" ON "Layer"("artworkVersionId");
CREATE INDEX "Layer_parentId_idx" ON "Layer"("parentId");
CREATE INDEX "Layer_ownerId_updatedAt_idx" ON "Layer"("ownerId", "updatedAt");
CREATE UNIQUE INDEX "Layer_slug_ownerId_artworkVersionId_key" ON "Layer"("slug", "ownerId", "artworkVersionId");
PRAGMA foreign_key_check("Design");
PRAGMA foreign_key_check("Layer");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "Artwork_projectId_idx" ON "Artwork"("projectId");

-- CreateIndex
CREATE INDEX "Artwork_ownerId_idx" ON "Artwork"("ownerId");

-- CreateIndex
CREATE INDEX "Artwork_projectId_updatedAt_idx" ON "Artwork"("projectId", "updatedAt");

-- CreateIndex
CREATE INDEX "Artwork_ownerId_updatedAt_idx" ON "Artwork"("ownerId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_slug_ownerId_key" ON "Artwork"("slug", "ownerId");

-- CreateIndex
CREATE INDEX "ArtworkBranch_artworkId_idx" ON "ArtworkBranch"("artworkId");

-- CreateIndex
CREATE INDEX "ArtworkBranch_ownerId_idx" ON "ArtworkBranch"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkBranch_artworkId_name_key" ON "ArtworkBranch"("artworkId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkBranch_artworkId_slug_key" ON "ArtworkBranch"("artworkId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkVersion_nextId_key" ON "ArtworkVersion"("nextId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkVersion_prevId_key" ON "ArtworkVersion"("prevId");

-- CreateIndex
CREATE INDEX "ArtworkVersion_branchId_idx" ON "ArtworkVersion"("branchId");

-- CreateIndex
CREATE INDEX "ArtworkVersion_ownerId_idx" ON "ArtworkVersion"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkVersion_branchId_name_key" ON "ArtworkVersion"("branchId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkVersion_branchId_slug_key" ON "ArtworkVersion"("branchId", "slug");

-- CreateIndex
CREATE INDEX "ArtworkMergeRequest_artworkId_idx" ON "ArtworkMergeRequest"("artworkId");

-- CreateIndex
CREATE INDEX "ArtworkMergeRequest_sourceBranchId_idx" ON "ArtworkMergeRequest"("sourceBranchId");

-- CreateIndex
CREATE INDEX "ArtworkMergeRequest_targetBranchId_idx" ON "ArtworkMergeRequest"("targetBranchId");
