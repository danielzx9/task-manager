const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }

})

router.put('/:id', async (req, res) => { // <--- se corrigió la sintaxis
    try {
        const task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'No se encontró la tarea' });
        }

        if (req.body.title != null) {
            task.title = req.body.title;
        }
        if (req.body.completed != null) {
            task.completed = req.body.completed;
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID de tarea no válido' });
        }

        const result = await Task.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No se encontró la tarea' });
        }
        res.json({ message: "Tarea eliminada" });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

