
// Elementos de tareas
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');


// Variables para los filtros
const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const statusFilter = document.getElementById('statusFilter');

searchInput.addEventListener('input', applyFilters); // Búsqueda
priorityFilter.addEventListener('change', applyFilters); // Filtro de prioridad
statusFilter.addEventListener('change', applyFilters); // Filtro de estado

function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const priority = priorityFilter.value;
    const status = statusFilter.value;

    const filteredTasks = allTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchText);

        const matchesPriority = priority === 'all' || task.priority === priority;

        // Filtro por estado (completado o pendiente)
        const matchesStatus =
            status === 'all' ||
            (status === 'completed' && task.completed) ||
            (status === 'pending' && !task.completed);

        return matchesSearch && matchesPriority && matchesStatus;
    });

    // Renderizar las tareas filtradas
    renderTasks(filteredTasks);
}



// Manejar envío de nuevas tareas
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const taskTitle = taskInput.value;
    const taskPriority = document.getElementById('prioritySelect').value;
    const dueDate = document.getElementById('dueDateInput').value;
    const taskTags = taskTagsInput.value.split(',').map(tag => tag.trim()); 


    const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: taskTitle, dueDate: dueDate , priority: taskPriority, tags: taskTags })
    });

    if (response.ok) {
        taskInput.value = '';
        document.getElementById('dueDateInput').value = '';
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

let allTasks = []; 
// Función para obtener y renderizar las tareas
async function fetchTasks() {
    const token = localStorage.getItem('token');
    
    try {
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

        allTasks = await response.json(); 
        applyFilters(); 

    } catch (error) {
        console.error('Hubo un problema al obtener las tareas:', error);
    }
}


function renderTasks(tasks) {
    taskList.innerHTML = ''; // Limpiar lista
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed); 

        const title = document.createElement('span');
        title.textContent = task.title;

        li.classList.remove('low-priority', 'medium-priority', 'high-priority');

        //Prioridades
        if (task.priority === 'low') {
            li.classList.add('low-priority');
        } else if (task.priority === 'medium') {
            li.classList.add('medium-priority');
        } else if (task.priority === 'high') {
            li.classList.add('high-priority');
        }

        //Fecha vencimiento
        const dueDate = new Date(task.dueDate);
        const dueDateText = document.createElement('span');
        dueDateText.textContent = dueDate ? ` (Vence: ${dueDate.toLocaleDateString()})` : '';

        const today = new Date();
        if (dueDate < today) {
            dueDateText.style.color = 'red'; // Vencido
            dueDateText.textContent = dueDateText.completed;
        } else if ((dueDate - today) / (1000 * 60 * 60 * 24) <= 3) {
            dueDateText.style.color = 'orange'; // Próximo a vencer
        } else {
            dueDateText.style.color = 'green'; // Sin vencer
        }

        // Añadir botones para completar y eliminar
        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Descompletar' : 'Completar';
        completeButton.addEventListener('click', async () => {
            await toggleComplete(task._id, !task.completed);
            fetchTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', async () => {
            await deleteTask(task._id);
            fetchTasks();
        });

        li.appendChild(title);
        li.appendChild(dueDateText);
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
