// author -> Abdelmonem Mahmoud Marei
// github -> https://github.com/AbdelmonemMarei
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Build this website using Typescript ES6 and OOP Paradigm to apply what I have learned in lectures
var TodoItem = /** @class */ (function () {
    function TodoItem(id, text) {
        this.id = id;
        this.text = text;
        this.completed = false;
        this.progress = 0;
    }
    return TodoItem;
}());
var TodoApp = /** @class */ (function () {
    function TodoApp() {
        this.todos = [];
        this.nextId = 1;
        this.editingId = null; //used for updating the content
        // Create the main container
        this.todoContainer = document.createElement('div');
        this.todoContainer.classList.add('todo-container');
        document.body.appendChild(this.todoContainer);
        // Create the header of website
        var websiteHeader = document.createElement("h1");
        websiteHeader.textContent = "To Do List Application";
        this.todoContainer.appendChild(websiteHeader);
        // Create container for user input
        this.todoFormContainer = document.createElement('div');
        this.todoContainer.appendChild(this.todoFormContainer);
        this.todoFormContainer.classList.add("todo-form-container");
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.placeholder = 'Add new todo';
        this.todoFormContainer.appendChild(this.inputField);
        this.errorParagrah = document.createElement('p');
        this.errorParagrah.classList.add('error');
        this.errorParagrah.textContent = 'please enter vaild todo task | start with letter';
        this.todoFormContainer.appendChild(this.errorParagrah);
        this.addButton = document.createElement('button');
        this.addButton.textContent = 'Add';
        this.addButton.addEventListener('click', this.addTodo.bind(this));
        this.todoFormContainer.appendChild(this.addButton);
        this.updateButton = document.createElement('button');
        this.updateButton.textContent = 'Update';
        this.updateButton.addEventListener('click', this.updateTodo.bind(this));
        this.todoFormContainer.appendChild(this.updateButton);
        this.updateButton.style.display = 'none';
        // Create container for table
        this.todoTableContainer = document.createElement('div');
        this.todoContainer.appendChild(this.todoTableContainer);
        this.todoTableContainer.classList.add("todo-table-container");
        this.loadTodosFromLocalStorage();
        this.renderTodos();
    }
    // Load values from local storage if there are already saved tasks
    TodoApp.prototype.loadTodosFromLocalStorage = function () {
        var storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            this.todos = JSON.parse(storedTodos);
            this.nextId = Math.max.apply(Math, __spreadArray(__spreadArray([], this.todos.map(function (todo) { return todo.id; }), false), [0], false)) + 1;
        }
    };
    // save todos to local storage to save values if user close the browser
    TodoApp.prototype.saveTodosToLocalStorage = function () {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    };
    TodoApp.prototype.createTodoTable = function () {
        var table = document.createElement('table');
        table.classList.add('todo-table');
        var thead = document.createElement('thead');
        table.appendChild(thead);
        var headerRow = document.createElement('tr');
        thead.appendChild(headerRow);
        var idHeader = document.createElement('th');
        idHeader.textContent = 'ID';
        headerRow.appendChild(idHeader);
        var completeHeader = document.createElement('th');
        completeHeader.textContent = 'Complete';
        headerRow.appendChild(completeHeader);
        var taskHeader = document.createElement('th');
        taskHeader.textContent = 'Task';
        headerRow.appendChild(taskHeader);
        var progressHeader = document.createElement('th');
        progressHeader.textContent = 'Progress';
        headerRow.appendChild(progressHeader);
        var actionsHeader = document.createElement('th');
        actionsHeader.textContent = 'Actions';
        headerRow.appendChild(actionsHeader);
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);
        return table;
    };
    TodoApp.prototype.createTodoRow = function (_a) {
        var _this = this;
        var id = _a.id, completed = _a.completed, progress = _a.progress, text = _a.text;
        var row = document.createElement('tr');
        row.classList.add('todo-row');
        row.dataset.todoId = String(id);
        var idCell = document.createElement('td');
        idCell.textContent = String(id);
        idCell.classList.add("id-cell");
        row.appendChild(idCell);
        var completeCell = document.createElement('td');
        completeCell.classList.add("complete-cell");
        var completeCheckbox = document.createElement('input');
        completeCheckbox.type = 'checkbox';
        completeCheckbox.checked = completed;
        completeCheckbox.addEventListener('change', function (event) {
            var targetCheckBox = event.target;
            var isCompleted = targetCheckBox.checked;
            _this.toggleComplete(id, isCompleted);
        });
        completeCell.appendChild(completeCheckbox);
        row.appendChild(completeCell);
        var taskCell = document.createElement('td');
        taskCell.classList.add('task-cell');
        var taskDescription = document.createElement('p');
        taskDescription.textContent = text;
        taskDescription.classList.add('todo-description');
        if (completed || progress == 100) {
            row.classList.add('completed');
        }
        else {
            row.classList.remove('completed');
        }
        taskCell.appendChild(taskDescription);
        row.appendChild(taskCell);
        var progressCell = document.createElement('td');
        progressCell.classList.add("progress-cell");
        var barElement = document.createElement('div');
        barElement.classList.add('progress-bar');
        var progressElement = document.createElement("p");
        // dynamic style according to progress percentage
        progressElement.style.width = "".concat(progress, "%");
        if (progress > 80) {
            progressElement.style.backgroundColor = "#5CB338";
        }
        else if (progress > 40) {
            progressElement.style.backgroundColor = "#FFD23F";
        }
        else {
            progressElement.style.backgroundColor = "#FF0000";
        }
        if (progress == 100 || completed) {
            progressElement.style.backgroundColor = "transparent";
        }
        barElement.appendChild(progressElement);
        progressCell.appendChild(barElement);
        var progressInput = document.createElement('input');
        progressInput.type = 'number';
        progressInput.min = '0';
        progressInput.max = '100';
        progressInput.value = String(progress);
        progressInput.addEventListener('change', function (event) {
            var targetProgressInput = event.target;
            var newProgress = parseInt(targetProgressInput.value, 10);
            if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
                _this.updateProgress(id, newProgress);
            }
            else {
                targetProgressInput.value = String(progress);
            }
        });
        progressCell.appendChild(progressInput);
        row.appendChild(progressCell);
        var actionsCell = document.createElement('td');
        actionsCell.classList.add("actions-cell");
        var editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function () { return _this.startEdit(id, text); });
        actionsCell.appendChild(editButton);
        var deleteButton = document.createElement('button');
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () { return _this.deleteTodo(id); });
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
        return row;
    };
    TodoApp.prototype.renderTodos = function () {
        var _this = this;
        // This container will not be empty so I use this approch to clear the container not as global variable (Lab)
        // Because when there is no task it will be a message that No tasks to view
        this.todoTableContainer.innerHTML = ''; // Clear the container
        if (this.todos.length > 0) {
            var todoTable = this.createTodoTable();
            var tbody_1 = todoTable.querySelector('tbody');
            this.todos.forEach(function (todo) {
                var todoRow = _this.createTodoRow(todo);
                tbody_1.appendChild(todoRow);
            });
            this.todoTableContainer.appendChild(todoTable);
        }
        else {
            this.nextId = 1;
            this.todoTableContainer.textContent = 'No tasks added to todo list';
        }
        // Change Form button behavior based on choosed todo task to edit or not (as indicator but logic is inside addOrUpdateTodo function)
        if (this.editingId !== null && this.todoTableContainer) {
            var editingTodo = this.todos.filter(function (todo) { return todo.id === _this.editingId; })[0];
            if (editingTodo) {
                // To let user update on the old value not from empty string value
                this.inputField.value = editingTodo.text;
                this.addButton.textContent = 'Update';
            }
            else {
                this.inputField.value = '';
                this.addButton.textContent = 'Add';
                this.editingId = null;
            }
        }
        else {
            this.inputField.value = '';
            this.addButton.textContent = 'Add';
            this.editingId = null;
        }
    };
    TodoApp.prototype.updateTodo = function () {
        var _this = this;
        var text = this.inputField.value.trim();
        if (!/^[a-zA-Z][a-zA-Z0-9]+$/.test(text)) {
            this.errorParagrah.classList.add('active');
            return;
        }
        else {
            this.errorParagrah.classList.remove('active');
        }
        // update object task text using rest parameter
        this.todos = this.todos.map(function (todo) {
            return todo.id === _this.editingId ? __assign(__assign({}, todo), { text: text }) : todo;
        });
        // To Prevent enable edit of this id after edit
        this.editingId = null;
        this.renderTodos();
        this.saveTodosToLocalStorage();
        // switch back to add button
        this.addButton.style.display = 'block';
        this.updateButton.style.display = 'none';
    };
    TodoApp.prototype.addTodo = function () {
        // add new todo
        var text = this.inputField.value.trim();
        if (!/^[a-zA-Z][a-zA-Z0-9]+$/.test(text)) {
            this.errorParagrah.classList.add('active');
            return;
        }
        else {
            this.errorParagrah.classList.remove('active');
        }
        var newTodo = new TodoItem(this.nextId++, text);
        this.todos.push(newTodo);
        this.renderTodos();
        this.saveTodosToLocalStorage();
    };
    TodoApp.prototype.deleteTodo = function (id) {
        // return unremoved todos element
        this.todos = this.todos.filter(function (todo) { return todo.id !== id; });
        // To Prevent enable edit of this id
        if (this.editingId === id) {
            this.editingId = null;
        }
        this.renderTodos();
        this.saveTodosToLocalStorage();
    };
    TodoApp.prototype.toggleComplete = function (id, completed) {
        // update object completed status using rest parameter
        this.todos = this.todos.map(function (todo) {
            return todo.id === id ? __assign(__assign({}, todo), { completed: completed }) : todo;
        });
        this.renderTodos();
        this.saveTodosToLocalStorage();
    };
    TodoApp.prototype.startEdit = function (id, text) {
        // To change actions from add to update
        this.editingId = id;
        this.inputField.value = text;
        this.addButton.style.display = 'none';
        this.updateButton.style.display = 'block';
    };
    // update progress
    TodoApp.prototype.updateProgress = function (id, progress) {
        // same as before
        this.todos = this.todos.map(function (todo) {
            return todo.id === id ? __assign(__assign({}, todo), { progress: progress }) : todo;
        });
        this.renderTodos();
        this.saveTodosToLocalStorage();
    };
    return TodoApp;
}());
// IIFE Function to start the app when page load
(function () {
    new TodoApp();
})();
