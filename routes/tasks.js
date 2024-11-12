const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    // Solo usuarios autenticados pueden acceder a esta ruta
    try {
        const tasks = await Task.find({ userId: req.user.userId,  }); // Filtrar tareas por usuario

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    console.log(req.body);
    const { title, priority, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'El título de la tarea es obligatorio' });
    }

    if (dueDate && new Date(dueDate) < new Date()) {
        return res.status(400).json({ message: 'La fecha de vencimiento no puede estar en el pasado' });
    }

    try {
        const newTask = new Task({
            title,
            priority,
            dueDate,
            tags,
            userId: req.user.userId // Asegúrate de que estás guardando el usuario correcto
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


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
        if (req.body.tags != null){
            task.tags = req.body.tags;
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

