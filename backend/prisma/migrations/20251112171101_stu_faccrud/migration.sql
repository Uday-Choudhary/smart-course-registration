/*
  Warnings:

  - You are about to drop the column `termId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Deadline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_termId_fkey";

-- DropForeignKey
ALTER TABLE "Deadline" DROP CONSTRAINT "Deadline_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Deadline" DROP CONSTRAINT "Deadline_termId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "termId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthday" TEXT,
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "subjects" JSONB;

-- DropTable
DROP TABLE "Deadline";
