const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoute = require('./routes/auth');
const tasksRoute = require('./routes/tasks');

require('dotenv').config();

const app = express();


const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));


app.use(express.json());
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB connected')).catch(err => console.error(err));



app.use('/api/auth', authRoute);
app.use('/api/tasks', tasksRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})