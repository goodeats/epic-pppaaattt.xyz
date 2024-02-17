-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appearance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "global" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Appearance_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Appearance" ("createdAt", "description", "id", "name", "ownerId", "slug", "type", "updatedAt", "value") SELECT "createdAt", "description", "id", "name", "ownerId", "slug", "type", "updatedAt", "value" FROM "Appearance";
DROP TABLE "Appearance";
ALTER TABLE "new_Appearance" RENAME TO "Appearance";
CREATE INDEX "Appearance_ownerId_idx" ON "Appearance"("ownerId");
CREATE INDEX "Appearance_ownerId_updatedAt_idx" ON "Appearance"("ownerId", "updatedAt");
CREATE UNIQUE INDEX "Appearance_slug_ownerId_key" ON "Appearance"("slug", "ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
