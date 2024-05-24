/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Artwork` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artwork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Artwork_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Artwork_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Artwork" ("createdAt", "description", "id", "isVisible", "name", "ownerId", "projectId", "slug", "updatedAt") SELECT "createdAt", "description", "id", "isVisible", "name", "ownerId", "projectId", "slug", "updatedAt" FROM "Artwork";
DROP TABLE "Artwork";
ALTER TABLE "new_Artwork" RENAME TO "Artwork";
CREATE INDEX "Artwork_projectId_idx" ON "Artwork"("projectId");
CREATE INDEX "Artwork_ownerId_idx" ON "Artwork"("ownerId");
CREATE INDEX "Artwork_projectId_updatedAt_idx" ON "Artwork"("projectId", "updatedAt");
CREATE INDEX "Artwork_ownerId_updatedAt_idx" ON "Artwork"("ownerId", "updatedAt");
CREATE UNIQUE INDEX "Artwork_slug_ownerId_key" ON "Artwork"("slug", "ownerId");
PRAGMA foreign_key_check("Artwork");
PRAGMA foreign_keys=ON;
