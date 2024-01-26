/*
  Warnings:

  - A unique constraint covering the columns `[slug,ownerId]` on the table `Appearance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,ownerId]` on the table `Artboard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,ownerId]` on the table `AssetImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,ownerId]` on the table `Layer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,ownerId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Appearance_slug_key";

-- DropIndex
DROP INDEX "Artboard_slug_key";

-- DropIndex
DROP INDEX "AssetImage_slug_key";

-- DropIndex
DROP INDEX "Layer_slug_key";

-- DropIndex
DROP INDEX "Project_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Appearance_slug_ownerId_key" ON "Appearance"("slug", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Artboard_slug_ownerId_key" ON "Artboard"("slug", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetImage_slug_ownerId_key" ON "AssetImage"("slug", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Layer_slug_ownerId_key" ON "Layer"("slug", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_ownerId_key" ON "Project"("slug", "ownerId");
