const addBtn = document.getElementById('add');
const tasks = document.getElementById('tasks');
const tasksControls = document.getElementById('tasksControls')
const todos = JSON.parse(localStorage.getItem('todos')) || [];
addBtn.addEventListener('click', () => {
  const toDoName = document.getElementById('toDoName').value;
  const toDoDesc = document.getElementById('toDoDesc').value;
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  const newTodo = { name: toDoName, desc: toDoDesc };
  todos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(todos));
  document.getElementById('toDoName').value = '';
  document.getElementById('toDoDesc').value = '';
  displayTasks()
  controls()
});
function displayTasks() {
    tasks.innerHTML = ''; 
    todos.forEach((todo, index) => {
        const div = document.createElement('div')
        div.classList.add('all')
        div.innerHTML += `
      <div id ="content" class="container d-flex col-4 mt-2 justify-content-between">
        <div class="d-flex gap-3"> 
            <button class="choose"></button>
            <h1>${todo.name}</h1>
            <p id="description">${todo.desc}</p>
        </div>
            <button class="removeBtn">X</button>
      </div>
      `;
      const removeBtn = div.querySelector('.removeBtn')
      removeBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            div.remove()
            controls()
      })
      const choosed = div.querySelector('.choose')
      choosed.addEventListener('click', () => {
        choosed.classList.toggle('green')
        div.classList.toggle('choosed')
        choosed.style.visibility = 'unset'
      })
      
      tasks.appendChild(div)
      const description = div.querySelector('#description');
      const truncatedDesc = todo.desc.substring(0, 10) + "...";
      description.textContent = (todo.desc.length > 10) ? truncatedDesc : todo.desc;
    })
}
function controls() {
  tasksControls.innerHTML = `
    <div class="container d-flex col-4 mt-5 justify-content-around">
      <div>
        <h4>${todos.length} items left</h4>
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

  if (todos.length == 0) {
    tasksControls.style.display = 'none';
  }

  const all = document.querySelector('#all');
  const active = document.querySelector('#active');
  const completed = document.querySelector('#completed');
  const clearCompleted = document.querySelector('#clear')

  all.addEventListener('click', () => {
    tasks.querySelectorAll('.all').forEach((div) => {
      div.classList.remove('displayNone');
    });
  });

  active.addEventListener('click', () => {
    tasks.querySelectorAll('.all:not(.choosed)').forEach((div) => {
      div.classList.remove('displayNone');
    });
    tasks.querySelectorAll('.choosed').forEach((div) => {
      div.classList.add('displayNone');
    });
  });

  completed.addEventListener('click', () => {
    tasks.querySelectorAll('.all:not(.choosed)').forEach((div) => {
      div.classList.add('displayNone');
    });
    tasks.querySelectorAll('.choosed').forEach((div) => {
      div.classList.remove('displayNone');
    });
  });
  clearCompleted.addEventListener('click', () => {
    todos.forEach((todo, index) => {
      const div = tasks.querySelectorAll('.all')[index];
      if (div.classList.contains('choosed')) {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
      }
    });
    displayTasks();
    controls();
  });
}
document.addEventListener('DOMContentLoaded', () => {
  displayTasks();
  controls()
})