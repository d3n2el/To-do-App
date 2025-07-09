        let tasks = [];
        
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
        
        function renderTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item';
                if (task.completed) {
                    li.classList.add('completed');
                }
                
                li.innerHTML = `
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                `;
                
                taskList.appendChild(li);
            });
        }
        
        // actually add things
        document.getElementById('addBtn').addEventListener('click', addTask);
        
        document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
        
        renderTasks();