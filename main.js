let tasks = [];
let editingTaskId = null;

// to save things locally use json
function saveTasks() {
    try {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
        alert('Failed to save tasks. Your browser might have storage limits.');
    }
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        alert('Failed to load saved tasks. Starting with empty list.');
        tasks = [];
    }
}

function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const remainingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('remainingTasks').textContent = remainingTasks;
    document.getElementById('completionRate').textContent = completionRate + '%';
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    taskInput.value = '';
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasks();
    renderTasks();
    updateStats();
}

function editTask(id) {
    editingTaskId = id;
    renderTasks();
}

function saveTask(id) {
    const input = document.querySelector(`#edit-input-${id}`);
    const newText = input.value.trim();
    
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }
    
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.text = newText;
        }
        return task;
    });
    
    editingTaskId = null;
    saveTasks();
    renderTasks();
    updateStats();
}

function cancelEdit() {
    editingTaskId = null;
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No tasks yet. Add one above!';
        taskList.appendChild(emptyState);
        return;
    }
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        
        if (editingTaskId === task.id) {
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <input type="text" class="task-input" id="edit-input-${task.id}" value="${task.text}">
                <div class="button-group">
                    <button class="save-btn" onclick="saveTask(${task.id})">Save</button>
                    <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
                </div>
            `;
            

            setTimeout(() => {
                const input = document.getElementById(`edit-input-${task.id}`);
                input.focus();
                input.select();
            }, 0);
        } else {
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <div class="button-group">
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
        }
        
        taskList.appendChild(li);
    });
}

document.getElementById('addBtn').addEventListener('click', addTask);

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});


document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && editingTaskId !== null) {
        saveTask(editingTaskId);
    }
    if (e.key === 'Escape' && editingTaskId !== null) {
        cancelEdit();
    }
});


loadTasks();

renderTasks();
updateStats();