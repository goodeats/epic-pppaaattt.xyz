-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "selectedDesigns" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Artboard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Artboard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Artboard" ("backgroundColor", "createdAt", "description", "height", "id", "isVisible", "name", "ownerId", "projectId", "selectedDesigns", "slug", "updatedAt", "width") SELECT "backgroundColor", "createdAt", "description", "height", "id", "isVisible", "name", "ownerId", "projectId", coalesce("selectedDesigns", '{}') AS "selectedDesigns", "slug", "updatedAt", "width" FROM "Artboard";
DROP TABLE "Artboard";
ALTER TABLE "new_Artboard" RENAME TO "Artboard";
CREATE INDEX "Artboard_projectId_idx" ON "Artboard"("projectId");
CREATE INDEX "Artboard_ownerId_idx" ON "Artboard"("ownerId");
CREATE INDEX "Artboard_projectId_updatedAt_idx" ON "Artboard"("projectId", "updatedAt");
CREATE INDEX "Artboard_ownerId_updatedAt_idx" ON "Artboard"("ownerId", "updatedAt");
CREATE UNIQUE INDEX "Artboard_slug_ownerId_key" ON "Artboard"("slug", "ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
