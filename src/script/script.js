// declare everything needed from HTML
const tasks = document.getElementById('tasks');
const tasksControls = document.getElementById('tasksControls')

// localStorage items
const todos = JSON.parse(localStorage.getItem('todos')) || [];
let status = false
let id = todos.length

// add task if submit 
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
  const toDoName = document.getElementById('toDoName').value;
  const input = document.getElementById('toDoName')
  if (input.value === '') {
    document.querySelector('span').classList.remove('show');
  } else {
    document.querySelector('span').classList.add('show');
    const newTodo = { id: id, name: toDoName, status: status };
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    document.getElementById('toDoName').value = '';
    id++
    displayTasks();
    controls()
  }
})

//display tasks after submit
function displayTasks() {
  tasks.innerHTML = ''; 
  todos.forEach((todo) => {
      const div = document.createElement('div')
      div.classList.add('all')
      div.innerHTML += `
    <div id ="content" class="container d-flex col-4 mt-2 justify-content-between">
      <div class="d-flex gap-3"> 
          <button class="choose"></button>
          <h1 class="task">${todo.name}</h1>
      </div>
          <button class="removeBtn">X</button>
    </div>
    `;
    // remove task
    const removeBtn = div.querySelector('.removeBtn');
    removeBtn.addEventListener('click', () => {
    const index = todo.id;
    todos.splice(todos.findIndex((todo) => todo.id === index), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    if (todos.length == 0) {
      id = 0;
    }
    div.remove();
    displayTasks();
    controls()
});

  // edit task
      const taskName = div.querySelector('.task');
      taskName.addEventListener('click', () => {
        div.innerHTML = `
        <div id ="content" class="container d-flex col-4 my-5 justify-content-around">
            <input type="text" id="editName">
            <button id="editBtn">change</button>
          </div>
        `;
        const editBtn = div.querySelector('#editBtn');
        const editNameInput = div.querySelector("#editName");
        editNameInput.value = taskName.textContent; 
        editBtn.addEventListener('click' , () =>{
          const newName = editNameInput.value;
          todo.name = newName;
          localStorage.setItem('todos', JSON.stringify(todos));
          taskName.textContent = newName; 
          displayTasks(); 
      });
    })

    //change status on complited tasks
    const choose = div.querySelector('.choose')
    choose.addEventListener('click', () => {
      const index = todo.id;
      const selectedTodo = todos.find(todo => todo.id === index);
      selectedTodo.status = !selectedTodo.status;
      localStorage.setItem('todos', JSON.stringify(todos));
      choose.style.backgroundColor = selectedTodo.status ? "green" : "";
      choose.style.visibility = "unset"
      controls();
    })

    // set choose btn bg based on task status
    if(todo.status===true){
      choose.style.backgroundColor = "green"
    }
    else{
      choose.style.backgroundColor = ""
    }
    tasks.appendChild(div)
  });
  controls()
}

// display filters and controls for tasks
function controls() {
  tasksControls.innerHTML = `
    <div class="container d-flex col-4 mt-5 justify-content-around">
      <div>
        <h4>
        <span>
        ${todos.length}
        </span>
        item
        </h4>
      </div>
      <div>
        <button id="all">All</button>
        <button id="active">Active</button>
        <button id="completed">Completed</button>
      </div>
      <div>
        <button id="clear">Clear Completed</button>
      </div>
    </div>
  `;
const count = tasksControls.querySelector('span')

  // display control buttons
  const all = tasksControls.querySelector('#all');
  const active = tasksControls.querySelector('#active');
  const completed = tasksControls.querySelector('#completed');
  const clear = tasksControls.querySelector('#clear');

  // display all to-dos
  all.addEventListener('click', () => {
    count.innerHTML = todos.length
    displayFilteredTasks(todos);
  });

  // display only active to-dos
  active.addEventListener('click', () => {
    const activeTodos = todos.filter(todo => !todo.status);
    count.innerHTML = activeTodos.length
    displayFilteredTasks(activeTodos);
  });

  // display only completed to-dos
  completed.addEventListener('click', () => {
    const completedTodos = todos.filter(todo => todo.status);
    count.innerHTML = completedTodos.length
    displayFilteredTasks(completedTodos);
  });

  // clear completed to-dos
  clear.addEventListener('click', () => {
    const uncompletedTodos = todos.filter(todo => !todo.status);
    localStorage.setItem('todos', JSON.stringify(uncompletedTodos));
    todos.splice(0, todos.length, ...uncompletedTodos);
    displayTasks();
    controls();
  });

  if (todos.length === 0) {
    tasksControls.style.display = 'none';
  }
  else{
    tasksControls.style.display = "unset"
  }
}

// helper function to display filtered tasks
function displayFilteredTasks(filteredTodos) {
  tasks.innerHTML = '';
  filteredTodos.forEach((todo) => {
    const div = document.createElement('div');
    div.classList.add('all');
    div.innerHTML += `
      <div id="content" class="container d-flex col-4 mt-2 justify-content-between">
        <div class="d-flex gap-3"> 
          <button class="choose"></button>
          <h1 class="task">${todo.name}</h1>
        </div>
        <button class="removeBtn">X</button>
      </div>
    `;

    // remove task
    const removeBtn = div.querySelector('.removeBtn');
    removeBtn.addEventListener('click', () => {
      const index = todo.id;
      todos.splice(todos.findIndex(todo => todo.id === index), 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      if (todos.length == 0) {
        id = 0;
      }
      div.remove()
      displayTasks()
      controls();
    });

 // edit task
    const taskName = div.querySelector('.task');
    taskName.addEventListener('click', () => {
    div.innerHTML = `
   <div id ="content" class="container d-flex col-4 my-5 justify-content-around">
       <input type="text" id="editName">
       <button id="editBtn">change</button>
     </div>
   `;
    const editBtn = div.querySelector('#editBtn');
    const editNameInput = div.querySelector("#editName");
    editNameInput.value = taskName.textContent; 
    editBtn.addEventListener('click' , () =>{
     const newName = editNameInput.value;
     todo.name = newName;
     localStorage.setItem('todos', JSON.stringify(todos));
     taskName.textContent = newName; 
     displayFilteredTasks(); 
 });
})

    // change status on completed tasks
    const choose = div.querySelector('.choose');
    choose.addEventListener('click', () => {
      const index = todo.id;
      const selectedTodo = todos.find(todo => todo.id === index);
      selectedTodo.status = !selectedTodo.status;
      localStorage.setItem('todos', JSON.stringify(todos));
      choose.style.backgroundColor = selectedTodo.status ? "green" : "";
      choose.style.visibility = "unset";
      controls();
    });
    
    // set choose btn bg based on task status
    if (todo.status === true) {
      choose.style.backgroundColor = "green";
    } else {
      choose.style.backgroundColor = "";
    }
    tasks.appendChild(div);
  })
}

// on reload tasks stay visible
document.addEventListener('DOMContentLoaded', () => {
  displayTasks()

  controls()
})
