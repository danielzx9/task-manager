
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
        li.textContent = task.title;
        taskList.appendChild(li);
    });
}
