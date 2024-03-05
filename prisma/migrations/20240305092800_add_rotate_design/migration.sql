-- CreateTable
CREATE TABLE "Rotate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rotation" REAL NOT NULL DEFAULT 0,
    "basis" TEXT NOT NULL DEFAULT 'defined',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "designId" TEXT NOT NULL,
    CONSTRAINT "Rotate_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Rotate_designId_key" ON "Rotate"("designId");
