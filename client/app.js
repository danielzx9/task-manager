document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const noTasksMessage = document.getElementById('noTasksMessage');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskTitle = taskInput.value;

        const response = await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: taskTitle }),
        });

        if (response.ok) {
            taskInput.value = '';
            fetchTasks();
        }
    });

    async function fetchTasks() {
        const response = await fetch('http://localhost:5000/api/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            noTasksMessage.style.display = 'block';
        } else {
            noTasksMessage.style.display = 'none';
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.title;
            li.style.textDecoration = task.completed ? 'line-through' : 'none';

            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Desmarcar' : 'Completar';
            completeButton.addEventListener('click', () => toggleComplete(task._id, !task.completed));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => deleteTask(task._id));

            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    }

    async function toggleComplete(id, completed) {
        await fetch(`http://localhost:5000/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
        fetchTasks();
    }

    async function deleteTask(id) {
        await fetch(`http://localhost:5000/api/tasks/${id}`, {
            method: 'DELETE',
        });
        fetchTasks();
    }

    fetchTasks(); // Cargar las tareas al iniciar
});
