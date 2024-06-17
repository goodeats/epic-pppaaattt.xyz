/*
  Warnings:

  - You are about to drop the `ArtworkImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LayerImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtworkImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LayerImage";
PRAGMA foreign_keys=on;
