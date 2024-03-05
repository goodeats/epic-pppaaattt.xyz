-- CreateTable
CREATE TABLE "Layout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "style" TEXT NOT NULL DEFAULT 'random',
    "count" INTEGER NOT NULL DEFAULT 1000,
    "rows" INTEGER NOT NULL DEFAULT 9,
    "columns" INTEGER NOT NULL DEFAULT 9,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "designId" TEXT NOT NULL,
    CONSTRAINT "Layout_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Layout_designId_key" ON "Layout"("designId");
