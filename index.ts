// author -> Abdelmonem Mahmoud Marei
// github -> https://github.com/AbdelmonemMarei


// Build this website using Typescript ES6 and OOP Paradigm to apply what I have learned in lectures
class TodoItem {
  id: number;
  text: string;
  completed: boolean;
  progress: number;
  
  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
    this.completed = false;
    this.progress = 0;
  }
}
  
class TodoApp {
  private todos: TodoItem[] = [];
  private nextId: number = 1;
  private todoContainer: HTMLDivElement; // Container for the app
  private todoFormContainer: HTMLDivElement ;// Container for input field and button
  private todoTableContainer: HTMLDivElement;// Container for the table or nothing
  private inputField: HTMLInputElement; //input to add task description
  private errorParagrah: HTMLParagraphElement;//paragraph to display error message when user add unvalid task
  private addButton: HTMLButtonElement;//button to add task
  private updateButton: HTMLButtonElement;//button to update task
  private editingId: number | null = null; //used for updating the content
  
  constructor() {
    // Create the main container
    this.todoContainer = document.createElement('div') as HTMLDivElement;
    this.todoContainer.classList.add('todo-container');
    document.body.appendChild(this.todoContainer);
    // Create the header of website
    const websiteHeader = document.createElement("h1") as HTMLHeadingElement;
    websiteHeader.textContent = "To Do List Application"
    this.todoContainer.appendChild(websiteHeader);
    // Create container for user input
    this.todoFormContainer = document.createElement('div') as HTMLDivElement;
    this.todoContainer.appendChild(this.todoFormContainer);
    this.todoFormContainer.classList.add("todo-form-container");

    this.inputField = document.createElement('input') as HTMLInputElement;
    this.inputField.type = 'text';
    this.inputField.placeholder = 'Add new todo';
    this.todoFormContainer.appendChild(this.inputField);

    this.errorParagrah = document.createElement('p') as HTMLParagraphElement;
    this.errorParagrah.classList.add('error');
    this.errorParagrah.textContent = 'please enter vaild todo task | start with letter';
    this.todoFormContainer.appendChild(this.errorParagrah);
    
    this.addButton = document.createElement('button') as HTMLButtonElement;
    this.addButton.textContent = 'Add';
    this.addButton.addEventListener('click', this.addTodo.bind(this));
    this.todoFormContainer.appendChild(this.addButton);
    
    this.updateButton = document.createElement('button') as HTMLButtonElement;
    this.updateButton.textContent = 'Update';
    this.updateButton.addEventListener('click', this.updateTodo.bind(this));
    this.todoFormContainer.appendChild(this.updateButton);
    this.updateButton.style.display = 'none';
    
    // Create container for table
    this.todoTableContainer = document.createElement('div') as HTMLDivElement;
    this.todoContainer.appendChild(this.todoTableContainer);
    this.todoTableContainer.classList.add("todo-table-container");
    
    this.loadTodosFromLocalStorage();
    this.renderTodos();
  }
  // Load values from local storage if there are already saved tasks
  private loadTodosFromLocalStorage(): void {
    type localStorageType = string | null;
    const storedTodos:localStorageType = localStorage.getItem('todos');
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
      this.nextId = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
    }
  }
  // save todos to local storage to save values if user close the browser
  private saveTodosToLocalStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
  private createTodoTable(): HTMLTableElement {
    const table = document.createElement('table') as HTMLTableElement;
    table.classList.add('todo-table');

    const thead = document.createElement('thead') as HTMLTableSectionElement;
    table.appendChild(thead);

    const headerRow = document.createElement('tr') as HTMLTableRowElement;
    thead.appendChild(headerRow);

    const idHeader = document.createElement('th') as HTMLTableCellElement;
    idHeader.textContent = 'ID';
    headerRow.appendChild(idHeader);
    const completeHeader = document.createElement('th') as HTMLTableCellElement;
    completeHeader.textContent = 'Complete';
    headerRow.appendChild(completeHeader);
    const taskHeader = document.createElement('th') as HTMLTableCellElement;
    taskHeader.textContent = 'Task';
    headerRow.appendChild(taskHeader);
    const progressHeader = document.createElement('th') as HTMLTableCellElement;
    progressHeader.textContent = 'Progress';
    headerRow.appendChild(progressHeader);
    const actionsHeader = document.createElement('th') as HTMLTableCellElement;
    actionsHeader.textContent = 'Actions';
    headerRow.appendChild(actionsHeader);


    const tbody = document.createElement('tbody') as HTMLTableSectionElement;
    table.appendChild(tbody);

    return table;
  }

  private createTodoRow({id,completed,progress,text}: TodoItem): HTMLTableRowElement {

    const row = document.createElement('tr') as HTMLTableRowElement;
    row.classList.add('todo-row');
    row.dataset.todoId = String(id);

    const idCell = document.createElement('td') as HTMLTableCellElement;
    idCell.textContent = String(id);
    idCell.classList.add("id-cell")
    row.appendChild(idCell);

    const completeCell = document.createElement('td') as HTMLTableCellElement;
    completeCell.classList.add("complete-cell")
    const completeCheckbox = document.createElement('input') as HTMLInputElement;
    completeCheckbox.type = 'checkbox';
    completeCheckbox.checked = completed;
    completeCheckbox.addEventListener('change', (event) => {
      const targetCheckBox = event.target as HTMLInputElement
      const isCompleted:boolean = targetCheckBox.checked;
      this.toggleComplete(id, isCompleted);
    });
    completeCell.appendChild(completeCheckbox);
    row.appendChild(completeCell);

    const taskCell = document.createElement('td') as HTMLTableCellElement;
    taskCell.classList.add('task-cell')
    const taskDescription = document.createElement('p') as HTMLParagraphElement;
    taskDescription.textContent = text;
    taskDescription.classList.add('todo-description');
    if (completed || progress == 100) {
      row.classList.add('completed');
    }else{
      row.classList.remove('completed');
    }
    taskCell.appendChild(taskDescription);
    row.appendChild(taskCell);

    const progressCell = document.createElement('td') as HTMLTableCellElement;
    progressCell.classList.add("progress-cell")
    const barElement = document.createElement('div') as HTMLDivElement;
    barElement.classList.add('progress-bar');

    const progressElement = document.createElement("p") as HTMLParagraphElement;
    // dynamic style according to progress percentage
    progressElement.style.width = `${progress}%`;
    if (progress > 80) {
      progressElement.style.backgroundColor = "#5CB338";
    }else if(progress  > 40){
      progressElement.style.backgroundColor = "#FFD23F";
    }else{
      progressElement.style.backgroundColor = "#FF0000";
    }
    if(progress == 100 || completed) {progressElement.style.backgroundColor = "transparent"}
    barElement.appendChild(progressElement);
    progressCell.appendChild(barElement);
    const progressInput = document.createElement('input') as HTMLInputElement;
    progressInput.type = 'number';
    progressInput.min = '0';
    progressInput.max = '100';
    progressInput.value = String(progress);

    progressInput.addEventListener('change', (event) => {
      const targetProgressInput = event.target as HTMLInputElement;
      const newProgress = parseInt(targetProgressInput.value, 10);

      if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
        this.updateProgress(id, newProgress);
      } else {
        targetProgressInput.value = String(progress);
      }
    });
    progressCell.appendChild(progressInput);
    row.appendChild(progressCell);


    const actionsCell = document.createElement('td') as HTMLTableCellElement;
    actionsCell.classList.add("actions-cell");

    const editButton = document.createElement('button') as HTMLButtonElement;
    editButton.classList.add('edit-btn')
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => this.startEdit(id, text));
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('button') as HTMLButtonElement;
    deleteButton.classList.add("delete-btn")
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => this.deleteTodo(id));
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);

    return row;
  }
  
  private renderTodos(): void {
    // This container will not be empty so I use this approch to clear the container not as global variable (Lab)
    // Because when there is no task it will be a message that No tasks to view
    this.todoTableContainer.innerHTML=''; // Clear the container
    if (this.todos.length > 0) {
      const todoTable = this.createTodoTable() as HTMLTableElement;
      const tbody = todoTable.querySelector('tbody')as HTMLTableSectionElement;
      this.todos.forEach(todo => {
        const todoRow = this.createTodoRow(todo) as HTMLTableRowElement;
        tbody.appendChild(todoRow);
      });
      this.todoTableContainer.appendChild(todoTable);
    } else {
      this.nextId = 1;
      this.todoTableContainer.textContent = 'No tasks added to todo list';
    }
  
      // Change Form button behavior based on choosed todo task to edit or not (as indicator but logic is inside addOrUpdateTodo function)
    if (this.editingId !== null && this.todoTableContainer) {
      const editingTodo: TodoItem = this.todos.filter(todo => todo.id === this.editingId)[0];
      if (editingTodo) {
        // To let user update on the old value not from empty string value
        this.inputField.value = editingTodo.text;
        this.addButton.textContent = 'Update';
      } else {
        this.inputField.value = '';
        this.addButton.textContent = 'Add';
        this.editingId = null;
      }
    } else {
      this.inputField.value = '';
      this.addButton.textContent = 'Add';
      this.editingId = null;
    }
  }
  updateTodo(): void | undefined {
    const text:string = this.inputField.value.trim();
    if(!/^[a-zA-Z][a-zA-Z0-9]+$/.test(text)){
      this.errorParagrah.classList.add('active');
      return;
    }else{
      this.errorParagrah.classList.remove('active');
    }
    // update object task text using rest parameter
    this.todos = this.todos.map(todo =>
      todo.id === this.editingId ? { ...todo, text } : todo
    );
    // To Prevent enable edit of this id after edit
    this.editingId = null;
    this.renderTodos();
    this.saveTodosToLocalStorage();
    // switch back to add button
    this.addButton.style.display =  'block';
    this.updateButton.style.display = 'none';
  }
  addTodo(): void | undefined {
    // add new todo
    const text:string = this.inputField.value.trim();
    if(!/^[a-zA-Z][a-zA-Z0-9]+$/.test(text)){
      this.errorParagrah.classList.add('active');
      return;
    }else{
      this.errorParagrah.classList.remove('active');
    }
    const newTodo = new TodoItem(this.nextId++, text);
    this.todos.push(newTodo);
  
    this.renderTodos();
    this.saveTodosToLocalStorage();
  }
  deleteTodo(id: number): void {
    // return unremoved todos element
    this.todos = this.todos.filter(todo => todo.id !== id);
    // To Prevent enable edit of this id
    if (this.editingId === id) {
      this.editingId = null;
    }
    this.renderTodos();
    this.saveTodosToLocalStorage();
  }
  toggleComplete(id: number, completed: boolean): void {
    // update object completed status using rest parameter
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed } : todo
    );
    this.renderTodos();
    this.saveTodosToLocalStorage();
  }
  startEdit(id: number, text: string): void {
    // To change actions from add to update
    this.editingId = id;
    this.inputField.value = text;
    this.addButton.style.display =  'none';
    this.updateButton.style.display = 'block';
  }
  // update progress
  updateProgress(id: number, progress: number): void {
    // same as before
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, progress } : todo
    );
    this.renderTodos();
    this.saveTodosToLocalStorage();
  }
}
  

// IIFE Function to start the app when page load
(function() {
  new TodoApp();
}
)();