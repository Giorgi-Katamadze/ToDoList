const addBtn = document.getElementById('add');
addBtn.addEventListener('click', () => {
    const toDoName = document.getElementById('toDoName').value;
  const toDoDesc = document.getElementById('toDoDesc').value;
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  const newTodo = { name: toDoName, desc: toDoDesc };
  todos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(todos));
  document.getElementById('toDoName').value = '';
  document.getElementById('toDoDesc').value = '';
  display()
});

function display() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const tasks = document.getElementById('tasks');
    tasks.innerHTML = ''; 
    todos.forEach((todo, index) => {
        const div = document.createElement('div')
        div.innerHTML += `
      <div id ="content" class="container d-flex col-4 mt-2 justify-content-between">
        <div class="d-flex gap-3"> 
            <button class="choose"></button>
            <h1>${todo.name}</h1>
        </div>
            <button class="removeBtn">X</button>
      </div>
      `;
      const removeBtn = div.querySelector('.removeBtn')
      removeBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            div.remove()
      })
      tasks.appendChild(div)
    }); 
}

document.addEventListener('DOMContentLoaded', () => {
    display();
  });

