/*
  Warnings:

  - A unique constraint covering the columns `[slug,ownerId,artboardId]` on the table `Layer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,ownerId,artboardVersionId]` on the table `Layer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Layer_slug_ownerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Layer_slug_ownerId_artboardId_key" ON "Layer"("slug", "ownerId", "artboardId");

-- CreateIndex
CREATE UNIQUE INDEX "Layer_slug_ownerId_artboardVersionId_key" ON "Layer"("slug", "ownerId", "artboardVersionId");
