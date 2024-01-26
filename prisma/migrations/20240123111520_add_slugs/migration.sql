/*
  Warnings:

  - Added the required column `slug` to the `Artboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Layer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Appearance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `AssetImage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Artboard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Artboard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Artboard" ("backgroundColor", "createdAt", "description", "height", "id", "isVisible", "name", "ownerId", "projectId", "updatedAt", "width") SELECT "backgroundColor", "createdAt", "description", "height", "id", "isVisible", "name", "ownerId", "projectId", "updatedAt", "width" FROM "Artboard";
DROP TABLE "Artboard";
ALTER TABLE "new_Artboard" RENAME TO "Artboard";
CREATE UNIQUE INDEX "Artboard_slug_key" ON "Artboard"("slug");
CREATE INDEX "Artboard_projectId_idx" ON "Artboard"("projectId");
CREATE INDEX "Artboard_ownerId_idx" ON "Artboard"("ownerId");
CREATE INDEX "Artboard_projectId_updatedAt_idx" ON "Artboard"("projectId", "updatedAt");
CREATE INDEX "Artboard_ownerId_updatedAt_idx" ON "Artboard"("ownerId", "updatedAt");
CREATE TABLE "new_Layer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "Layer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Layer" ("createdAt", "description", "id", "name", "ownerId", "parentId", "updatedAt") SELECT "createdAt", "description", "id", "name", "ownerId", "parentId", "updatedAt" FROM "Layer";
DROP TABLE "Layer";
ALTER TABLE "new_Layer" RENAME TO "Layer";
CREATE UNIQUE INDEX "Layer_slug_key" ON "Layer"("slug");
CREATE INDEX "Layer_ownerId_idx" ON "Layer"("ownerId");
CREATE INDEX "Layer_parentId_idx" ON "Layer"("parentId");
CREATE INDEX "Layer_ownerId_updatedAt_idx" ON "Layer"("ownerId", "updatedAt");
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("createdAt", "description", "id", "isVisible", "name", "ownerId", "updatedAt") SELECT "createdAt", "description", "id", "isVisible", "name", "ownerId", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");
CREATE INDEX "Project_ownerId_updatedAt_idx" ON "Project"("ownerId", "updatedAt");
CREATE TABLE "new_Appearance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Appearance_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Appearance" ("createdAt", "description", "id", "name", "ownerId", "type", "updatedAt", "value") SELECT "createdAt", "description", "id", "name", "ownerId", "type", "updatedAt", "value" FROM "Appearance";
DROP TABLE "Appearance";
ALTER TABLE "new_Appearance" RENAME TO "Appearance";
CREATE UNIQUE INDEX "Appearance_slug_key" ON "Appearance"("slug");
CREATE INDEX "Appearance_ownerId_idx" ON "Appearance"("ownerId");
CREATE INDEX "Appearance_ownerId_updatedAt_idx" ON "Appearance"("ownerId", "updatedAt");
CREATE TABLE "new_AssetImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "AssetImage_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AssetImage" ("altText", "blob", "contentType", "createdAt", "id", "name", "ownerId", "updatedAt") SELECT "altText", "blob", "contentType", "createdAt", "id", "name", "ownerId", "updatedAt" FROM "AssetImage";
DROP TABLE "AssetImage";
ALTER TABLE "new_AssetImage" RENAME TO "AssetImage";
CREATE UNIQUE INDEX "AssetImage_slug_key" ON "AssetImage"("slug");
CREATE INDEX "AssetImage_ownerId_idx" ON "AssetImage"("ownerId");
CREATE INDEX "AssetImage_ownerId_updatedAt_idx" ON "AssetImage"("ownerId", "updatedAt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
