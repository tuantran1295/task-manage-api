const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jawt.sign({
        id: user.id,
        role: user.role,
        name: user.name,
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token });

}

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!(role === 'EMPLOYEE' || role === 'EMPLOYER')) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    });
    res.status(201).json({ id: user.id, name: user.name, role: user.role });
}