-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArtworkImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'image',
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "artworkId" TEXT NOT NULL,
    CONSTRAINT "ArtworkImage_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArtworkImage" ("altText", "artworkId", "blob", "contentType", "createdAt", "id", "updatedAt") SELECT "altText", "artworkId", "blob", "contentType", "createdAt", "id", "updatedAt" FROM "ArtworkImage";
DROP TABLE "ArtworkImage";
ALTER TABLE "new_ArtworkImage" RENAME TO "ArtworkImage";
CREATE INDEX "ArtworkImage_artworkId_idx" ON "ArtworkImage"("artworkId");
PRAGMA foreign_key_check("ArtworkImage");
PRAGMA foreign_keys=ON;
