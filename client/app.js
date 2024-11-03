const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskTitle= taskInput.value;

    const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: taskTitle}),

    });

    if(response.ok){
        taskInput.value = '';
        fetchTasks();
    }

});

async function fetchTasks(){
    const response = await fetch('http://localhost:5000/api/tasks');
    const tasks = await response.json();
    renderTasks(tasks);
}

function renderTasks(tasks){
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.title;
        taskList.appendChild(li);
        
    });
}

fetchTasks();