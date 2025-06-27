
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    // Hash passwords
    const password1 = await bcrypt.hash('employer123', 10)
    const password2 = await bcrypt.hash('employee123', 10)
    const password3 = await bcrypt.hash('employee456', 10)

    // Create users
    const employer = await prisma.user.upsert({
        where: { email: 'employer@example.com' },
        update: {},
        create: {
            name: 'Super Employer',
            email: 'employer@example.com',
            password: password1,
            role: 'EMPLOYER',
        },
    })

    const employee1 = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            name: 'Alice Employee',
            email: 'alice@example.com',
            password: password2,
            role: 'EMPLOYEE',
        },
    })

    const employee2 = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            name: 'Bob Employee',
            email: 'bob@example.com',
            password: password3,
            role: 'EMPLOYEE',
        },
    })

    // Create tasks
    await prisma.task.createMany({
        data: [
            {
                title: 'Design Landing Page',
                description: 'Create designs in Figma',
                status: 'PENDING',
                dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                assigneeId: employee1.id,
            },
            {
                title: 'Setup CI/CD',
                description: 'Deploy to staging server',
                status: 'IN_PROGRESS',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                assigneeId: employee1.id,
            },
            {
                title: 'Write API Docs',
                description: 'Complete API spec',
                status: 'COMPLETED',
                dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                assigneeId: employee2.id,
            }
        ]
    })

    console.log('Seeded successfully')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
