const express = require('express');
const router = express.Router();
const {
    getAllSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
} = require('../../controllers/academic/schedule.controller');

router.get('/', getAllSchedules);
router.post('/create', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
