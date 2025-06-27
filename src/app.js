const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const os = require('os');
dotenv.config();

const apiRoutes = require('./routes');

const app = express();

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public assets (optional, for your own CSS/images)
app.use(express.static(path.join(__dirname, 'public')));

// Mount the API routes (your original API, unchanged)
app.use('/api', apiRoutes);

// --- Frontend web views ---

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/employee-tasks', (req, res) => res.render('employee-tasks'));
app.get('/tasks', (req, res) => res.render('tasks'));
app.get('/tasks-create', (req, res) => res.render('tasks-create'));
app.get('/employee-summary', (req, res) => res.render('employee-summary'));

// Catchall: If not found, show 404 or redirect to login
app.use((req, res) => res.status(404).send('<h1>404 Not Found</h1><a href="/login">Login</a>'));

// Start server
const PORT = process.env.PORT || 3000;
const HOST = os.hostname();
app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
    // console.log(`Server is running at http://${HOST}:${PORT}`);
});
