-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Artboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
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

-- CreateTable
CREATE TABLE "Layer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "Layer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appearance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Appearance_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppearancesOnLayers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "overrideValue" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "appearanceId" TEXT NOT NULL,
    "layerId" TEXT NOT NULL,
    CONSTRAINT "AppearancesOnLayers_appearanceId_fkey" FOREIGN KEY ("appearanceId") REFERENCES "Appearance" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AppearancesOnLayers_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LayersOnArtboards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "layerId" TEXT NOT NULL,
    "artboardId" TEXT NOT NULL,
    CONSTRAINT "LayersOnArtboards_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LayersOnArtboards_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssetImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "AssetImage_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssetImagesOnLayers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "assetImageId" TEXT NOT NULL,
    "layerId" TEXT NOT NULL,
    CONSTRAINT "AssetImagesOnLayers_assetImageId_fkey" FOREIGN KEY ("assetImageId") REFERENCES "AssetImage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssetImagesOnLayers_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");

-- CreateIndex
CREATE INDEX "Project_ownerId_updatedAt_idx" ON "Project"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "Artboard_projectId_idx" ON "Artboard"("projectId");

-- CreateIndex
CREATE INDEX "Artboard_ownerId_idx" ON "Artboard"("ownerId");

-- CreateIndex
CREATE INDEX "Artboard_projectId_updatedAt_idx" ON "Artboard"("projectId", "updatedAt");

-- CreateIndex
CREATE INDEX "Artboard_ownerId_updatedAt_idx" ON "Artboard"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "Layer_ownerId_idx" ON "Layer"("ownerId");

-- CreateIndex
CREATE INDEX "Layer_parentId_idx" ON "Layer"("parentId");

-- CreateIndex
CREATE INDEX "Layer_ownerId_updatedAt_idx" ON "Layer"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "Appearance_ownerId_idx" ON "Appearance"("ownerId");

-- CreateIndex
CREATE INDEX "Appearance_ownerId_updatedAt_idx" ON "Appearance"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "AppearancesOnLayers_appearanceId_idx" ON "AppearancesOnLayers"("appearanceId");

-- CreateIndex
CREATE INDEX "AppearancesOnLayers_layerId_idx" ON "AppearancesOnLayers"("layerId");

-- CreateIndex
CREATE INDEX "AppearancesOnLayers_appearanceId_layerId_idx" ON "AppearancesOnLayers"("appearanceId", "layerId");

-- CreateIndex
CREATE INDEX "LayersOnArtboards_layerId_idx" ON "LayersOnArtboards"("layerId");

-- CreateIndex
CREATE INDEX "LayersOnArtboards_artboardId_idx" ON "LayersOnArtboards"("artboardId");

-- CreateIndex
CREATE INDEX "LayersOnArtboards_layerId_artboardId_idx" ON "LayersOnArtboards"("layerId", "artboardId");

-- CreateIndex
CREATE INDEX "AssetImage_ownerId_idx" ON "AssetImage"("ownerId");

-- CreateIndex
CREATE INDEX "AssetImage_ownerId_updatedAt_idx" ON "AssetImage"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "AssetImagesOnLayers_assetImageId_idx" ON "AssetImagesOnLayers"("assetImageId");

-- CreateIndex
CREATE INDEX "AssetImagesOnLayers_layerId_idx" ON "AssetImagesOnLayers"("layerId");

-- CreateIndex
CREATE INDEX "AssetImagesOnLayers_assetImageId_layerId_idx" ON "AssetImagesOnLayers"("assetImageId", "layerId");
