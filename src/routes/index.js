const express = require('express');
const auth = require('../middlewares/auth');
const AuthCtrl = require('../controllers/auth');
const TaskCtrl = require('../controllers/tasks');
const EmpCtrl = require('../controllers/employees');
const router = express.Router();

router.post('/auth/login', AuthCtrl.login);
router.post('/auth/register', AuthCtrl.register);

// Employee endpoints
router.get('/tasks/my', auth(['EMPLOYEE']), TaskCtrl.getMyTasks);
router.patch('/tasks/:id', auth(['EMPLOYEE']), TaskCtrl.updateTaskStatus);

// Employer endpoints
router.post('/tasks', auth(['EMPLOYER']), TaskCtrl.createTask);
router.get('/tasks', auth(['EMPLOYER']), TaskCtrl.getAllTasks);
router.get('/employees/summary', auth(['EMPLOYER']), EmpCtrl.getEmployeeSummary);

router.get('/users/me', auth([]), AuthCtrl.me);

module.exports = router;