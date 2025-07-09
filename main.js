let tasks = [];
let editingTaskId = null;
let currentFilter = 'all'; 

// to save things locally use json
function saveTasks() {
    try {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
        // save filter to local storage too
        localStorage.setItem('todoFilter', currentFilter);
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
        showMessageBox('Failed to save tasks. Your browser might have storage limits.', 'error');
    }
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
        // use saved filter default to 'all' if not found
        const savedFilter = localStorage.getItem('todoFilter');
        if (savedFilter) {
            currentFilter = savedFilter;
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        showMessageBox('Failed to load saved tasks. Starting with empty list.', 'error');
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
        showMessageBox('Please enter a task!', 'warning');
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
    // now use a confirmation dialog using a custom message box
    showConfirmBox('Are you sure you want to delete this task?', () => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(); 
        updateStats();
        showMessageBox('Task deleted successfully!', 'success');
    });
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
        // custom message box instead of alert
        showMessageBox('Task cannot be empty!', 'warning');
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
    // display based on filter
    let tasksToDisplay = [];
    if (currentFilter === 'active') {
        tasksToDisplay = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        tasksToDisplay = tasks.filter(task => task.completed);
    } else { // 'all'
        tasksToDisplay = tasks;
    }

    // update active state of filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(`filter${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}Btn`).classList.add('active');
    
    if (tasksToDisplay.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = `No ${currentFilter === 'all' ? '' : currentFilter} tasks yet.`;
        taskList.appendChild(emptyState);
        return;
    }
    
    tasksToDisplay.forEach(task => { // changed to filtere tasks and not just tasks
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

// set the current filter and re-render tasks
function setFilter(filterType) {
    currentFilter = filterType;
    saveTasks(); 
    renderTasks();
}

// custom message box functions (replacing alert/confirm)
function showMessageBox(message, type = 'info') {
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.innerHTML = `
        <p>${message}</p>
        <button onclick="this.parentNode.remove()">OK</button>
    `;
    document.body.appendChild(messageBox);
    // auto-remove after a few seconds for info/success messages
    if (type !== 'warning' && type !== 'error') {
        setTimeout(() => {
            if (messageBox.parentNode) {
                messageBox.parentNode.removeChild(messageBox);
            }
        }, 3000);
    }
}

function showConfirmBox(message, onConfirm) {
    const confirmBox = document.createElement('div');
    confirmBox.className = 'confirm-box';
    confirmBox.innerHTML = `
        <p>${message}</p>
        <div class="confirm-buttons">
            <button class="confirm-yes" onclick="handleConfirm(true, '${onConfirm.name}')">Yes</button>
            <button class="confirm-no" onclick="handleConfirm(false)">No</button>
        </div>
    `;
    document.body.appendChild(confirmBox);

    window._confirmCallback = onConfirm;
}

function handleConfirm(confirmed, callbackName) {
    const confirmBox = document.querySelector('.confirm-box');
    if (confirmBox) {
        confirmBox.remove();
    }
    if (confirmed && window._confirmCallback) {
        window._confirmCallback();
    }
    window._confirmCallback = null; 
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

