const prisma = require('../prisma');

exports.getEmployeeSummary = async (req, res) => {
    // find all employees
    const employees = await prisma.user.findMany({
        where: { role: 'EMPLOYEE' },
        select: {
            id: true, name: true, email: true,
            _count: { select: { tasks: true } },
            tasks: { select: { status: true } }
        }
    });
    // Map completion stats
    const summary = employees.map(e => ({
        id: e.id,
        name: e.name,
        email: e.email,
        totalTasks: e._count.tasks,
        completedTasks: e.tasks.filter(t => t.status === 'COMPLETED').length
    }));
    res.json(summary);
}