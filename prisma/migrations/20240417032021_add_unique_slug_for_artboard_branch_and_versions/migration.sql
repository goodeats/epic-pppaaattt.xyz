/*
  Warnings:

  - A unique constraint covering the columns `[artboardId,slug]` on the table `ArtboardBranch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branchId,slug]` on the table `ArtboardVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArtboardBranch_artboardId_slug_key" ON "ArtboardBranch"("artboardId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArtboardVersion_branchId_slug_key" ON "ArtboardVersion"("branchId", "slug");
