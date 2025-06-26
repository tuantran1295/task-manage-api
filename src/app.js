const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // this will import src/routes/index.js

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount your API routes
app.use('/api', routes);

// Health check route (optional)
app.get('/', (req, res) => {
    res.send('Task Manager API is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});