const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB connected')).catch(err => console.error(err));

const tasksRoute = require('./routes/tasks');
app.use('/api/tasks', tasksRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})