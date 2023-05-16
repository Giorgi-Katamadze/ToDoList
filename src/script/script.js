
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
    <div id="content" class="d-flex gap-2 justify-content-between align-items-center py-2 px-3 my-3 col-10 col-sm-8 col-md-7 mx-auto">
      <div class="d-flex align-items-center gap-3 col-10"> 
          <button class="choose col-2 col-md-1"><i class="fa-solid fa-check"></i></button>
          <h1 class="task col-10 col-md-11">${todo.name}</h1>
      </div>
      <div clss="col-4">
      <button class="removeBtn"><i class="fa-solid fa-trash"></i></button>
      </div>
          
    </div>
    `;
    // remove task
const removeBtn = div.querySelector('.removeBtn');
removeBtn.addEventListener('click', () => {
const index = todo.id;

  // Show delete confirmation alert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this task!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      todos.splice(todos.findIndex((todo) => todo.id === index), 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      if (todos.length == 0) {
        id = 0;
      }
      div.remove();
      displayTasks();
      controls();

      // Show success message after deleting the task
      Swal.fire('Deleted!', 'The task has been deleted.', 'success');
    }
  });
});


  // edit task
      const taskName = div.querySelector('.task');
      taskName.addEventListener('click', () => {
        div.innerHTML = `
        <div id ="content" class="d-flex gap-3 justify-content-between align-items-center py-3 px-3 my-3 col-10 col-sm-8 col-md-7 mx-auto">
            <input type="text" id="editName" class="col-8">
            <button id="editBtn" class="col-4">change</button>
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

   // Mark complited ToDos and change their status
    const choose = div.querySelector('.choose')
    choose.addEventListener('click', () => {
      const index = todo.id;
      const selectedTodo = todos.find(todo => todo.id === index);
      selectedTodo.status = !selectedTodo.status;
      localStorage.setItem('todos', JSON.stringify(todos));
      div.querySelector('h1').style.textDecorationLine = selectedTodo.status ? "line-through" : "";
      choose.style.opacity = selectedTodo.status ? "100%" : "40%";
      controls();
    })
    // Apply styles based on the selected status
    if (todo.status) {
      div.querySelector('h1').style.textDecorationLine = "line-through";
      choose.style.opacity = "100%";
    } else {
      div.querySelector('h1').style.textDecorationLine = "";
      choose.style.opacity = "40%";
    }
        tasks.appendChild(div)
      });
      controls()
    }

// display filters and controls for tasks
function controls() {
  tasksControls.innerHTML = `
    <div class="d-flex flex-wrap col-md-10 mx-auto justify-content-center align-items-center py-3">
            <div class="col-12 col-lg-2 d-flex justify-content-start px-3">
                <h4><span>${todos.length}</span> ${todos.length === 1 ? 'task' : 'tasks'}</h4>
            </div>
            <div class="d-flex gap-3 gap-sm-2 gap-md-3 flex-wrap justify-content-center justify-content-md-end px-3">
                <button id="all">All</button>
                <button id="active">Active</button>
                <button id="completed">Completed</button>
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
  const uncompletedTodos = todos.filter((todo) => !todo.status);

  // Show delete confirmation alert
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will delete all completed tasks!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete them!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.setItem('todos', JSON.stringify(uncompletedTodos));
      todos.splice(0, todos.length, ...uncompletedTodos);
      displayTasks();
      controls();

      // Show success message after deleting the completed tasks
      Swal.fire('Deleted!', 'Completed tasks have been deleted.', 'success');
    }
  });
});

  if (todos.length === 0) {
    tasksControls.style.display = 'none';
    tasks.innerHTML = `
    <div  class="col-12 text-center my-5 py-5">
    <h1 class="noToDo col-4 mx-auto">No Tasks</h1>
    </div>
    ` 
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
    <div id="content" class="d-flex gap-2 justify-content-between align-items-center py-2 px-3 my-3 col-10 col-sm-8 col-md-7 mx-auto">
      <div class="d-flex align-items-center gap-3 col-10"> 
          <button class="choose col-2 col-md-1"><i class="fa-solid fa-check"></i></button>
          <h1 class="task col-10 col-md-11">${todo.name}</h1>
      </div>
      <div clss="col-4">
      <button class="removeBtn"><i class="fa-solid fa-trash"></i></button>
      </div>
          
    </div>
    `;

    // remove task
const removeBtn = div.querySelector('.removeBtn');
removeBtn.addEventListener('click', () => {
const index = todo.id;

  // Show delete confirmation alert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this task!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      todos.splice(todos.findIndex((todo) => todo.id === index), 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      if (todos.length == 0) {
        id = 0;
      }
      div.remove();
      displayTasks();
      controls();

      // Show success message after deleting the task
      Swal.fire('Deleted!', 'The task has been deleted.', 'success');
    }
  });
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

    // Mark complited ToDos and change their status
    const choose = div.querySelector('.choose')
    choose.addEventListener('click', () => {
      const index = todo.id;
      const selectedTodo = todos.find(todo => todo.id === index);
      selectedTodo.status = !selectedTodo.status;
      localStorage.setItem('todos', JSON.stringify(todos));
      div.querySelector('h1').style.textDecorationLine = selectedTodo.status ? "line-through" : "";
      choose.style.opacity = selectedTodo.status ? "100%" : "40%";
      controls();
    })
    // Apply styles based on the selected status
    if (todo.status) {
      div.querySelector('h1').style.textDecorationLine = "line-through";
      choose.style.opacity = "100%";
    } else {
      div.querySelector('h1').style.textDecorationLine = "";
      choose.style.opacity = "40%";
    }
        tasks.appendChild(div);
      })
    }

// on reload tasks stay visible
document.addEventListener('DOMContentLoaded', () => {
  displayTasks()
  controls()
})


