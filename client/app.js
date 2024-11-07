
// Elementos de tareas
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');



// Manejar envío de nuevas tareas
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const taskTitle = taskInput.value;

    const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: taskTitle })
    });

    if (response.ok) {
        taskInput.value = '';
        fetchTasks();
    } else {
        console.error('Error al agregar la tarea');
    }
});

async function completeTask(taskId, completed) {
    const token = localStorage.getItem('token');  

    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ completed: !completed }) 
    });

    if (response.ok) {
        fetchTasks(); 
    } else {
        console.error('Error al completar la tarea:', response.statusText);
    }
}

async function deleteTask(taskId) {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(response.ok){
        fetchTasks();

    }else{
        console.error('Error al eliminar la tarea: ', response.statusText);
    }
}


// Función para obtener y renderizar las tareas
async function fetchTasks() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    
    if (!response.ok) {
        console.error('Error al obtener las tareas:', response.statusText);
        return;
    }

    const tasks = await response.json();
    console.log('Tareas obtenidas:', tasks); // Verifica el contenido de tasks

    if (Array.isArray(tasks)) {
        renderTasks(tasks);
    } else {
        console.error('La respuesta no es un arreglo:', tasks);
    }
}

// Renderizar tareas en la lista
function renderTasks(tasks) {
    taskList.innerHTML = ''; // Limpiar lista
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed); // Agrega clase 'completed' si la tarea está completada

        const title = document.createElement('span');
        title.textContent = task.title;

        // Botón de completar
        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Desmarcar' : 'Completar';
        completeButton.addEventListener('click', () => toggleComplete(task._id, !task.completed));

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => deleteTask(task._id));

        li.appendChild(title);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

async function toggleComplete(taskId, completed) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
    });

    if (!response.ok) {
        console.error('Error al actualizar la tarea');
    } else {
        fetchTasks(); // Actualiza la lista de tareas
    }
}
