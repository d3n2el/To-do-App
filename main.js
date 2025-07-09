        let tasks = [];
        let editingTaskId = null;
        
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
            renderTasks();
        }
        
        function deleteTask(id) {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }
        
        function toggleTask(id) {
            tasks = tasks.map(task => {
                if (task.id === id) {
                    task.completed = !task.completed;
                }
                return task;
            });
            renderTasks();
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
            renderTasks();
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
        
        
        renderTasks();