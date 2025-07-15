# 📝 To-Do App with AI Integration

A modern, feature-rich todo list application with AI-powered task generation using Google's Gemini API. Built with vanilla HTML, CSS, and JavaScript.

![To-Do App Screenshot](https://hc-cdn.hel1.your-objectstorage.com/s/v3/88405ddb534832db27ccf7381ac95ac7f4465239_cap4.png)
![To-Do App Screenshot](https://hc-cdn.hel1.your-objectstorage.com/s/v3/ac50a78da5df64b70ee3a21ef614e2e2bce0503a_cap3.png)
![To-Do App Screenshot](https://hc-cdn.hel1.your-objectstorage.com/s/v3/0c303f2f588e04409644cb6b226f54519129955b_cap2.png)
![To-Do App Screenshot](https://hc-cdn.hel1.your-objectstorage.com/s/v3/fe6fd60fd2f0acc5287e1fce00520e614c8f953a_capture.png)
![License](https://img.shields.io/badge/License-GPL%20v3-blue)

## ✨ Features

### Core Functionality
- ✅ **Add, edit, delete tasks** with intuitive controls
- 🎯 **Priority levels** (High, Medium, Low) with visual indicators
- ✔️ **Mark tasks as complete** with checkbox interaction
- 📊 **Real-time statistics** showing total, completed, remaining tasks, and completion rate
- 💾 **Local storage** persistence - your tasks are saved automatically
- 🔍 **Filter tasks** by status (All, Active, Completed)
- 📋 **Sort tasks** by priority (High to Low, Low to High, or Default)
- 🗑️ **Clear completed tasks** with confirmation dialog

### AI-Powered Features
- 🤖 **Gemini AI Integration** - Ask AI to generate task lists based on your goals
- 📝 **Smart task creation** - AI automatically assigns priorities to generated tasks
- 💬 **Natural language input** - Describe what you want to accomplish and get organized tasks

### User Experience
- 🎨 **Modern gradient UI** with smooth animations
- 📱 **Fully responsive design** - works on desktop, tablet, and mobile
- ⌨️ **Keyboard shortcuts** - Enter to save, Escape to cancel editing
- 🔔 **Custom notifications** - Success/warning/error messages with auto-dismiss
- 🎭 **Visual priority indicators** - Color-coded borders and labels

## 🚀 How to Run

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for AI features only)

### Installation & Setup

1. **Download the files**
   ```
   📁 To-Do App/
   ├── 📄 index.html
   ├── 📄 main.js
   ├── 📄 stylesheet.css
   └── 📄 README.md
   ```

2. **Get a Gemini API Key (Optional - for AI features)**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a free account and generate an API key
   - Open `main.js` and replace the empty `apiKey` variable on line 334:
     ```javascript
     const apiKey = "YOUR_API_KEY_HERE";
     ```

3. **Run the application**
   - Simply double-click `index.html` to open it in your default browser
   - Or right-click → "Open with" → choose your preferred browser
   - Or serve it using a local web server (optional)

### Alternative: Local Web Server
```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Then open http://localhost:8000 in your browser
```

## 📖 How to Use

### Basic Task Management
1. **Add a task**: Type in the input field, select priority, and click "Add Task" or press Enter
2. **Edit a task**: Click the "Edit" button, modify text/priority, then "Save" or press Enter
3. **Complete a task**: Check the checkbox next to any task
4. **Delete a task**: Click the "Delete" button (confirmation required)

### Filtering & Sorting
- **Filter tasks**: Use "All", "Active", or "Completed" buttons
- **Sort tasks**: Use the dropdown to sort by priority or creation date
- **Clear completed**: Use the red "Clear Completed" button to remove all finished tasks

### AI Task Generation
1. **Enter your goal**: Type what you want to accomplish (e.g., "Plan a birthday party")
2. **Click "Ask Gemini"**: The AI will generate a list of relevant tasks
3. **Auto-add tasks**: Generated tasks are automatically added with appropriate priorities
4. **Review & edit**: You can edit, complete, or delete AI-generated tasks like any other

### Example AI Prompts
- "Plan a vacation to Japan"
- "Organize my home office"
- "Prepare for a job interview"
- "Learn to cook Italian food"
- "Start a fitness routine"

## 🛠️ Technical Details

### Built With
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with flexbox, gradients, and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Local Storage API** - Data persistence
- **Google Gemini API** - AI task generation

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### File Structure
```
📁 To-Do App/
├── 📄 index.html          # Main HTML structure
├── 📄 main.js             # Application logic & AI integration
├── 📄 stylesheet.css      # Styling & responsive design
└── 📄 README.md           # This file
```

### Key JavaScript Functions
- `addTask()` - Creates new tasks manually or from AI
- `askGemini()` - Integrates with Google Gemini API
- `renderTasks()` - Updates the UI with current tasks
- `sortTasksByPriority()` - Handles task sorting
- `saveTasks()` & `loadTasks()` - Local storage management

## 🎨 Customization

### Modifying Colors
Edit the CSS variables in `stylesheet.css`:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Task priority colors */
.priority-high { border-left: 5px solid #dc3545; }
.priority-medium { border-left: 5px solid #ffc107; }
.priority-low { border-left: 5px solid #17a2b8; }
```

### Adding New Features
The code is modular and well-commented. Key areas for extension:
- **Task categories/tags** - Extend the task object structure
- **Due dates** - Add date fields and sorting
- **Collaboration** - Add sharing features
- **Themes** - Create multiple color schemes

## 🐛 Troubleshooting

### Common Issues

**Tasks not saving**
- Check if your browser supports Local Storage
- Clear browser cache and try again

**AI features not working**
- Verify your API key is correctly set in `main.js`
- Check your internet connection
- Ensure you haven't exceeded API rate limits

**Responsive issues**
- Try refreshing the page
- Check if you're using a supported browser version

### Error Messages
- **"Please enter a task!"** - The input field is empty
- **"API request failed"** - Check your API key and internet connection
- **"Gemini didn't return any tasks"** - Try rephrasing your request

## 🔧 Development

### Local Development Setup
1. Clone or download the project files
2. Make your changes to HTML, CSS, or JavaScript
3. Test in multiple browsers
4. Use browser developer tools for debugging

### Contributing
1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

For the full license text, see [GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html).

## 🎯 Future Enhancements

- [ ] Dark mode toggle
- [ ] Task categories/tags
- [ ] Due date tracking
- [ ] Data export/import
- [ ] Collaboration features
- [ ] Mobile app version
- [ ] Offline AI capabilities

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all files are in the same directory
4. Verify your Gemini API key is valid (if using AI features)

---

**Enjoy organizing your tasks with AI assistance! 🚀**
