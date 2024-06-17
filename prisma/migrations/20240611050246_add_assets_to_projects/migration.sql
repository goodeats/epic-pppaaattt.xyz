-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "attributes" TEXT NOT NULL DEFAULT '{}',
    "blob" BLOB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT,
    "artworkId" TEXT,
    "artworkVersionId" TEXT,
    "layerId" TEXT,
    CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Asset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Asset_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Asset_artworkVersionId_fkey" FOREIGN KEY ("artworkVersionId") REFERENCES "ArtworkVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Asset_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Asset" ("artworkId", "artworkVersionId", "attributes", "blob", "createdAt", "description", "id", "layerId", "name", "ownerId", "slug", "type", "updatedAt") SELECT "artworkId", "artworkVersionId", "attributes", "blob", "createdAt", "description", "id", "layerId", "name", "ownerId", "slug", "type", "updatedAt" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE INDEX "Asset_ownerId_idx" ON "Asset"("ownerId");
CREATE UNIQUE INDEX "Asset_slug_ownerId_key" ON "Asset"("slug", "ownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
