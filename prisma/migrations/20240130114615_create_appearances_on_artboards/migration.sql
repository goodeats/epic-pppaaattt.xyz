-- CreateTable
CREATE TABLE "AppearancesOnArtboards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "overrideValue" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "appearanceId" TEXT NOT NULL,
    "artboardId" TEXT NOT NULL,
    CONSTRAINT "AppearancesOnArtboards_appearanceId_fkey" FOREIGN KEY ("appearanceId") REFERENCES "Appearance" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AppearancesOnArtboards_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AppearancesOnArtboards_appearanceId_idx" ON "AppearancesOnArtboards"("appearanceId");

-- CreateIndex
CREATE INDEX "AppearancesOnArtboards_artboardId_idx" ON "AppearancesOnArtboards"("artboardId");

-- CreateIndex
CREATE INDEX "AppearancesOnArtboards_appearanceId_artboardId_idx" ON "AppearancesOnArtboards"("appearanceId", "artboardId");
