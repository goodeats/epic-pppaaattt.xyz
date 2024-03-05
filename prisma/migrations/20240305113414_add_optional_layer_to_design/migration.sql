-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Design" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextId" TEXT,
    "prevId" TEXT,
    "ownerId" TEXT NOT NULL,
    "artboardId" TEXT,
    "layerId" TEXT,
    CONSTRAINT "Design_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Design_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Design_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "Layer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Design" ("artboardId", "createdAt", "id", "nextId", "ownerId", "prevId", "type", "visible") SELECT "artboardId", "createdAt", "id", "nextId", "ownerId", "prevId", "type", "visible" FROM "Design";
DROP TABLE "Design";
ALTER TABLE "new_Design" RENAME TO "Design";
CREATE UNIQUE INDEX "Design_nextId_key" ON "Design"("nextId");
CREATE UNIQUE INDEX "Design_prevId_key" ON "Design"("prevId");
CREATE INDEX "Design_ownerId_idx" ON "Design"("ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
