/*
  Warnings:

  - The values [admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `VetProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[licenceNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('petOwner', 'vet');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'petOwner';
COMMIT;

-- DropForeignKey
ALTER TABLE "VetProfile" DROP CONSTRAINT "VetProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "profilePicture" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" JSONB,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "licenceNumber" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "specialties" TEXT[];

-- DropTable
DROP TABLE "VetProfile";

-- CreateIndex
CREATE UNIQUE INDEX "User_licenceNumber_key" ON "User"("licenceNumber");
