-- CreateTable
CREATE TABLE "Deadline" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "registrationOpen" TIMESTAMP(3) NOT NULL,
    "addDropStart" TIMESTAMP(3) NOT NULL,
    "addDropEnd" TIMESTAMP(3) NOT NULL,
    "registrationClose" TIMESTAMP(3) NOT NULL,
    "waitlistClose" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deadline_courseId_key" ON "Deadline"("courseId");

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
