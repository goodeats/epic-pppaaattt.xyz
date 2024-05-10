-- CreateTable
CREATE TABLE "ArtboardVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'latest',
    "description" TEXT,
    "latest" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "artboardId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "nextId" TEXT,
    "prevId" TEXT,
    CONSTRAINT "ArtboardVersion_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardVersion_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "ArtboardBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardVersion_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "ArtboardVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtboardBranch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'main',
    "description" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "artboardId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "ArtboardBranch_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardBranch_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ArtboardBranch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtboardMergeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "artboardId" TEXT NOT NULL,
    "sourceBranchId" TEXT NOT NULL,
    "targetBranchId" TEXT NOT NULL,
    CONSTRAINT "ArtboardMergeRequest_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardMergeRequest_sourceBranchId_fkey" FOREIGN KEY ("sourceBranchId") REFERENCES "ArtboardBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtboardMergeRequest_targetBranchId_fkey" FOREIGN KEY ("targetBranchId") REFERENCES "ArtboardBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "artboardId" TEXT,
    "artboardVersionId" TEXT,
    "artboardBranchId" TEXT,
    "layerId" TEXT,
    CONSTRAINT "Design_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Design_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_artboardVersionId_fkey" FOREIGN KEY ("artboardVersionId") REFERENCES "ArtboardVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Design_artboardBranchId_fkey" FOREIGN KEY ("artboardBranchId") REFERENCES "ArtboardBranch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Design_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Design" ("artboardId", "createdAt", "id", "layerId", "nextId", "ownerId", "prevId", "selected", "type", "visible") SELECT "artboardId", "createdAt", "id", "layerId", "nextId", "ownerId", "prevId", "selected", "type", "visible" FROM "Design";
DROP TABLE "Design";
ALTER TABLE "new_Design" RENAME TO "Design";
CREATE UNIQUE INDEX "Design_nextId_key" ON "Design"("nextId");
CREATE UNIQUE INDEX "Design_prevId_key" ON "Design"("prevId");
CREATE INDEX "Design_ownerId_idx" ON "Design"("ownerId");
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
    "artboardBranchId" TEXT,
    "nextId" TEXT,
    "prevId" TEXT,
    "parentId" TEXT,
    CONSTRAINT "Layer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_artboardVersionId_fkey" FOREIGN KEY ("artboardVersionId") REFERENCES "ArtboardVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Layer_artboardBranchId_fkey" FOREIGN KEY ("artboardBranchId") REFERENCES "ArtboardBranch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Layer_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Layer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Layer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Layer" ("artboardId", "createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "slug", "updatedAt", "visible") SELECT "artboardId", "createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "slug", "updatedAt", "visible" FROM "Layer";
DROP TABLE "Layer";
ALTER TABLE "new_Layer" RENAME TO "Layer";
CREATE UNIQUE INDEX "Layer_nextId_key" ON "Layer"("nextId");
CREATE UNIQUE INDEX "Layer_prevId_key" ON "Layer"("prevId");
CREATE INDEX "Layer_ownerId_idx" ON "Layer"("ownerId");
CREATE INDEX "Layer_parentId_idx" ON "Layer"("parentId");
CREATE INDEX "Layer_ownerId_updatedAt_idx" ON "Layer"("ownerId", "updatedAt");
CREATE UNIQUE INDEX "Layer_slug_ownerId_key" ON "Layer"("slug", "ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ArtboardVersion_nextId_key" ON "ArtboardVersion"("nextId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtboardVersion_prevId_key" ON "ArtboardVersion"("prevId");

-- CreateIndex
CREATE INDEX "ArtboardVersion_artboardId_idx" ON "ArtboardVersion"("artboardId");

-- CreateIndex
CREATE INDEX "ArtboardVersion_branchId_idx" ON "ArtboardVersion"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtboardVersion_branchId_latest_key" ON "ArtboardVersion"("branchId", "latest");

-- CreateIndex
CREATE UNIQUE INDEX "ArtboardVersion_branchId_name_key" ON "ArtboardVersion"("branchId", "name");

-- CreateIndex
CREATE INDEX "ArtboardBranch_artboardId_idx" ON "ArtboardBranch"("artboardId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtboardBranch_artboardId_default_key" ON "ArtboardBranch"("artboardId", "default");

-- CreateIndex
CREATE UNIQUE INDEX "ArtboardBranch_artboardId_name_key" ON "ArtboardBranch"("artboardId", "name");

-- CreateIndex
CREATE INDEX "ArtboardMergeRequest_artboardId_idx" ON "ArtboardMergeRequest"("artboardId");

-- CreateIndex
CREATE INDEX "ArtboardMergeRequest_sourceBranchId_idx" ON "ArtboardMergeRequest"("sourceBranchId");

-- CreateIndex
CREATE INDEX "ArtboardMergeRequest_targetBranchId_idx" ON "ArtboardMergeRequest"("targetBranchId");
