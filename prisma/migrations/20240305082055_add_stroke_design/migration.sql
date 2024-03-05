-- CreateTable
CREATE TABLE "Stroke" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "style" TEXT NOT NULL DEFAULT 'solid',
    "value" TEXT NOT NULL DEFAULT '000000',
    "basis" TEXT NOT NULL DEFAULT 'defined',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "designId" TEXT NOT NULL,
    CONSTRAINT "Stroke_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Stroke_designId_key" ON "Stroke"("designId");
