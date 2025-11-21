/*
  Warnings:

  - You are about to drop the column `courseId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `facultyId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `facultyId` on the `SectionSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `SectionSchedule` table. All the data in the column will be lost.
  - Added the required column `sectionCourseId` to the `SectionSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "SectionSchedule" DROP CONSTRAINT "SectionSchedule_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "SectionSchedule" DROP CONSTRAINT "SectionSchedule_sectionId_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "courseId",
DROP COLUMN "facultyId";

-- AlterTable
ALTER TABLE "SectionSchedule" DROP COLUMN "facultyId",
DROP COLUMN "sectionId",
ADD COLUMN     "sectionCourseId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SectionCourse" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "facultyId" TEXT,

    CONSTRAINT "SectionCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SectionCourse_sectionId_courseId_key" ON "SectionCourse"("sectionId", "courseId");

-- AddForeignKey
ALTER TABLE "SectionCourse" ADD CONSTRAINT "SectionCourse_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionCourse" ADD CONSTRAINT "SectionCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionCourse" ADD CONSTRAINT "SectionCourse_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionSchedule" ADD CONSTRAINT "SectionSchedule_sectionCourseId_fkey" FOREIGN KEY ("sectionCourseId") REFERENCES "SectionCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
