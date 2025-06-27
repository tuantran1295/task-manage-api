const prisma = require('../prisma');

exports.getMyTasks = async (req, res) => {
    const tasks = await prisma.task.findMany(
        {
            where: {
                assigneeId: req.user.id
            },
            orderBy: {
                dueDate: 'asc'
            },
        }
    );
    res.json(tasks);
}

exports.updateTaskStatus = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;
    const task = await prisma.task.findUnique({where: {id: +id}});
    if (!task || task.assigneeId !== req.user.id)
        return res.status(404).json({message: 'Task not found or forbidden'});
    if (!['IN_PROGRESS', 'COMPLETED'].includes(status))
        return res.status(400).json({message: 'Invalid status'});
    const updated = await prisma.task.update({where: {id: +id}, data: {status}});
    res.json(updated);
}

exports.createTask = async (req, res) => {
    // employer only
    const {title, description, dueDate, assigneeId} = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({message: 'Title is required.'});
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({message: 'Description is required.'});
    }
    if (!dueDate) {
        return res.status(400).json({message: 'Due date is required.'});
    }
    // Validate date
    const dueDateObj = new Date(dueDate);
    if (!(dueDateObj instanceof Date) || isNaN(dueDateObj.getTime())) {
        return res.status(400).json({message: 'Due date is invalid.'});
    }
    if (!assigneeId || isNaN(parseInt(assigneeId))) {
        return res.status(400).json({message: 'Assignee is required.'});
    }

    const user = await prisma.user.findUnique({where: {id: parseInt(assigneeId)}});
    if (!user || user.role !== 'EMPLOYEE')
        return res.status(400).json({message: 'Assignee must be employee'});

    const task = await prisma.task.create({
        data: {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDateObj,
            assigneeId: parseInt(assigneeId)
        }
    });
    res.status(201).json(task);
};

exports.getAllTasks = async (req, res) => {
    const {assigneeId, status, sortBy = 'createdAt', order = 'desc'} = req.query;
    const where = {};
    if (assigneeId) where.assigneeId = +assigneeId;
    if (status) where.status = status;
    // Validate sortBy, order
    const validSorts = ['createdAt', 'dueDate', 'status'];
    const orderBy = {[validSorts.includes(sortBy) ? sortBy : 'createdAt']: order === 'asc' ? 'asc' : 'desc'}
    const tasks = await prisma.task.findMany({where, orderBy});
    res.json(tasks);
}