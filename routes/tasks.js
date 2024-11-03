const express = require('express');
const router = express.Router();
const Task= require ('../models/Task');

router.get('/', async (req, res) => {
    try{
        const tasks = await Task.find();
        res.json(tasks);

    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.post('/', async (req,res) =>{
    const task = new Task({
        title: req.body.title,
    });

    try{
        const newTask = await task.save();
        res.status(201).json(newTask);

    } catch(err){
        res.status(400).json({message: err.message});
    }

})

router.put('/:id'), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(task == null) {
            return res.status(404).json ({message: 'No se encontro la tarea'});
        }

        task.title = req.body.title;
        task.completed = req.body.completed;

        const updatedTask = await task.save();
        res.json(updatedTask);

    } catch (err){
        res.status(400).json({message: err.message});
    }
}

router.delete('/:ïd', async (re, res) =>{
    try{
        const task = await Task.findById(req.params.id);
        if(task == null){
            return res.status(404).json({message: 'No se encontro la tarea'});

        }

        await task.remove();
        res.json({message: "Tarea eliminada"});

    } catch(err){
        res.status(500).json({message: err.message});
    }
})

module.exports = router;

