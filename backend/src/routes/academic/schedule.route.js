const express = require('express');
const router = express.Router();
const getAllSchedules = require('../../controllers/schedules/getAllSchedules');
const createSchedule = require('../../controllers/schedules/createSchedule');
const updateSchedule = require('../../controllers/schedules/updateSchedule');
const deleteSchedule = require('../../controllers/schedules/deleteSchedule');
const getFacultySchedule = require('../../controllers/schedules/getFacultySchedule');
const { verifyToken, requireFacultyOrAdmin } = require('../../miiddleware/authMiddleware');


router.get('/faculty', verifyToken, requireFacultyOrAdmin, getFacultySchedule);

router.get('/', getAllSchedules);
router.post('/create', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
