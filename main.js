let tasks = [];
let editingTaskId = null;
let currentFilter = 'all'; 
let currentSort = 'default';
// to save things locally use json
function saveTasks() {
    try {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
        // save filter to local storage too
        localStorage.setItem('todoFilter', currentFilter);
        // save sorts
        localStorage.setItem('todoSort', currentSort);
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
            // safeguard for tasks made before
            tasks = tasks.map(task => ({
                ...task,
                id: task.id || crypto.randomUUID(), 
                priority: task.priority || 'medium'
            }))
        }
        // use saved filter default to 'all' if not found
        const savedFilter = localStorage.getItem('todoFilter');
        if (savedFilter) {
            currentFilter = savedFilter;
        }
        const savedSort = localStorage.getItem('todoSort');
        if (savedSort) {
            currentSort = savedSort;
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
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    if (clearCompletedBtn) {
        clearCompletedBtn.disabled = completedTasks === 0;
    }
}

function addTask(taskText = null, taskPriority = null) {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    
    // Use parameters if provided, otherwise get from inputs
    const text = taskText || taskInput.value.trim();
    const priority = taskPriority || priorityInput.value;
    
    if (text === '') {
        showMessageBox('Please enter a task!', 'warning');
        return;
    }
    
    const task = {
        id: crypto.randomUUID(), 
        text: text,
        completed: false,
        priority: priority,
    };
    
    tasks.push(task);
    
    // Only clear inputs if we're using the manual input (not from Gemini)
    if (!taskText) {
        taskInput.value = '';
        priorityInput.value = 'medium';
        const geminiResponseContainer = document.getElementById('geminiResponse');
        geminiResponseContainer.style.display = 'none';
        geminiResponseContainer.textContent = '';
    }
    
    saveTasks(); 
    sortTasksByPriority(currentSort);
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
    sortTasksByPriority(currentSort);
    updateStats();
}

function editTask(id) {
    editingTaskId = id;
    renderTasks(); 
}

function saveTask(id) {
    const input = document.querySelector(`#edit-input-${id}`);
    const newText = input.value.trim();
    const priorityEditSelect = document.querySelector(`#priority-edit-select-${id}`)
    const newPriority = priorityEditSelect ? priorityEditSelect.value : 'medium';
    
    if (newText === '') {
        // custom message box instead of alert
        showMessageBox('Task cannot be empty!', 'warning');
        return;
    }
    
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.text = newText;
            task.priority = newPriority;
        }
        return task;
    });
    
    editingTaskId = null;
    saveTasks();
    sortTasksByPriority(); 
    updateStats();
}

function cancelEdit() {
    editingTaskId = null;
    renderTasks(); 
}


function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    // set value sort dropdown to currentSort
    const sortSelect = document.getElementById('sortPriority');
    if (sortSelect) {
        sortSelect.value = currentSort;
    }

    let tasksToDisplay = [];
    if (currentFilter === 'active') {
        tasksToDisplay = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        tasksToDisplay = tasks.filter(task => task.completed);
    } else { // all
        tasksToDisplay = tasks;
    }

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

    tasksToDisplay.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        // make sure that it renders priorities cuz otherwise all the rest of the code useless
        li.classList.add(`priority-${task.priority}`);

        if (editingTaskId === task.id) {
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <input type="text" class="task-input" id="edit-input-${task.id}" value="${task.text}">
                <!-- ADDED: Priority selection dropdown for editing -->
                <select id="priority-edit-select-${task.id}" class="priority-select">
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                </select>
                <div class="button-group">
                    <button class="save-btn" onclick="saveTask('${task.id}')">Save</button> 
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
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <span class="task-text">${task.text}</span>
                <!-- ADDED: Display priority label -->
                <span class="priority-label priority-${task.priority}">${task.priority.toUpperCase()}</span>
                <div class="button-group">
                    <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button> 
                    <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
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

function sortTasksByPriority(sortOrder) {
    currentSort = sortOrder; // upd srt ordr
    saveTasks(); // save everything

    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };

    tasks.sort((a, b) => {
        // move completed tasks to bottom, looks better ngl
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        // both non-/completed sort by priority
        const priorityA = priorityOrder[a.priority] || 0; // 0 if undefined
        const priorityB = priorityOrder[b.priority] || 0;

        if (sortOrder === 'high-to-low') {
            return priorityB - priorityA; // hg /  lw
        } else if (sortOrder === 'low-to-high') {
            return priorityA - priorityB; // lw / hg
        }
        // treat ids as strings for comparison when sorting
        return String(a.id).localeCompare(String(b.id)); 
    });

    renderTasks(); 
}

async function askGemini() {
    const promptInput = document.getElementById('taskInput');
    const prompt = `Based on the following request, generate a list of tasks. Your response MUST be a valid JSON array of objects. Each object must have a 'taskName' (string) and a 'priority' (string, either 'high', 'medium', or 'low'). Request: "${promptInput.value.trim()}"`;
    const geminiResponseContainer = document.getElementById('geminiResponse');

    if (promptInput.value.trim() === '') {
        showMessageBox('Please enter a goal for Gemini to plan.', 'warning');
        return;
    }

    geminiResponseContainer.style.display = 'block';
    geminiResponseContainer.classList.add('loading');
    geminiResponseContainer.textContent = 'Thinking...';

    try {
        // Define the structure we expect from the API
        const schema = {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    "taskName": { "type": "STRING" },
                    "priority": { "type": "STRING", "enum": ["high", "medium", "low"] }
                },
                required: ["taskName", "priority"]
            }
        };

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        };
        const apiKey = "AIzaSyAGDFwaan802Vh9f4tW5Ukw2d-smp7m7uM"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        
        geminiResponseContainer.classList.remove('loading');

        if (result.candidates && result.candidates[0]?.content?.parts[0]) {
            const jsonText = result.candidates[0].content.parts[0].text;
            const generatedTasks = JSON.parse(jsonText);
            addTasksFromGemini(generatedTasks);
            geminiResponseContainer.style.display = 'none';
            promptInput.value = '';
        } else {
            geminiResponseContainer.textContent = 'Sorry, the response was empty or in an unexpected format.';
            console.error("Unexpected API response structure:", result);
        }
 
     } catch (error) {
        console.error('Error calling Gemini API:', error);
        geminiResponseContainer.classList.remove('loading');
        geminiResponseContainer.textContent = `An error occurred: ${error.message}. Please try a different prompt.`;
    }
}

function addTasksFromGemini(newTasks) {
    if (!Array.isArray(newTasks) || newTasks.length === 0) {
        showMessageBox("Gemini didn't return any tasks. Please try a different prompt.", "warning");
        return;
    }
    newTasks.forEach(task => {
        // chjeck task object is valid before adding
        if(task.taskName && task.priority) {
            addTask(task.taskName, task.priority);
        }
    });
    showMessageBox(`${newTasks.length} tasks were added by the AI!`, 'success');
    saveTasks();
    renderTasks();
}
function clearCompletedTasks() {
    const completedCount = tasks.filter(task => task.completed).length;
    if (completedCount === 0) {
        showMessageBox('No completed tasks to clear.', 'info');
        return;
    }

    showConfirmBox(`Are you sure you want to delete ${completedCount} completed task(s)?`, () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        if (currentFilter === 'completed') {
            setFilter('all');
        } else {
            renderTasks();
        }
        updateStats();
        showMessageBox('Cleared all completed tasks.', 'success');
    });
}





document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBtn').addEventListener('click',  () => addTask());
    document.getElementById('geminiBtn').addEventListener('click', askGemini);
    document.getElementById('taskInput').addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
    document.addEventListener('keydown', e => { if (editingTaskId !== null) { if (e.key === 'Enter') saveTask(editingTaskId); if (e.key === 'Escape') cancelEdit(); } });
    document.getElementById('clearCompletedBtn').addEventListener('click', clearCompletedTasks);
    loadTasks();
    saveTasks();
    renderTasks();
});



