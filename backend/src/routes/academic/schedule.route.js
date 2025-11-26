const express = require('express');
const router = express.Router();
const {
    getAllSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getFacultySchedule,
} = require('../../controllers/academic/schedule.controller');
const { verifyToken, requireFacultyOrAdmin } = require('../../miiddleware/authMiddleware');

router.get('/faculty', verifyToken, requireFacultyOrAdmin, getFacultySchedule);

router.get('/', getAllSchedules);
router.post('/create', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
