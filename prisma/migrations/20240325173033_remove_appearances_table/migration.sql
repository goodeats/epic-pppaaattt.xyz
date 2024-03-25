/*
  Warnings:

  - You are about to drop the `Appearance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppearancesOnArtboards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppearancesOnLayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Appearance";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AppearancesOnArtboards";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AppearancesOnLayers";
PRAGMA foreign_keys=on;
