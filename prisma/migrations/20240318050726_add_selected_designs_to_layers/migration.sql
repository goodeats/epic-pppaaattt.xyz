-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Layer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "selectedDesigns" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "artboardId" TEXT,
    "nextId" TEXT,
    "prevId" TEXT,
    "parentId" TEXT,
    CONSTRAINT "Layer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Layer_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Layer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Layer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Layer" ("artboardId", "createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "slug", "updatedAt", "visible") SELECT "artboardId", "createdAt", "description", "id", "name", "nextId", "ownerId", "parentId", "prevId", "slug", "updatedAt", "visible" FROM "Layer";
DROP TABLE "Layer";
ALTER TABLE "new_Layer" RENAME TO "Layer";
CREATE UNIQUE INDEX "Layer_nextId_key" ON "Layer"("nextId");
CREATE UNIQUE INDEX "Layer_prevId_key" ON "Layer"("prevId");
CREATE INDEX "Layer_ownerId_idx" ON "Layer"("ownerId");
CREATE INDEX "Layer_parentId_idx" ON "Layer"("parentId");
CREATE INDEX "Layer_ownerId_updatedAt_idx" ON "Layer"("ownerId", "updatedAt");
CREATE UNIQUE INDEX "Layer_slug_ownerId_key" ON "Layer"("slug", "ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
