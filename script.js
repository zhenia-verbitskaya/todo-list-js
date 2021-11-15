'use strict';

const root = document.querySelector('.tasks'); // list container
const tasksList = root.querySelector('.tasks__list'); // list
const newTask = root.querySelector('.tasks__input'); //input field
const addBtn = root.querySelector('.tasks__button'); // add btn
const empty = root.querySelector('.tasks__empty'); // empty message

let elements = [];
let url = 'https://jsonplaceholder.typicode.com/todos';

async function getTodos(url) {
  let response = await fetch(url);
  let content = await response.text();
  if (!localStorage.getItem('data')) {
    localStorage.setItem('data', content);
  }

  elements = JSON.parse(localStorage.getItem('data')).slice(0, 10); // a part of server todo-list for easier scrolling xD

  for (let i = 0; i < elements.length; i++) {
    tasksList.insertAdjacentHTML('beforeend', `
    <li class="list__item" id=${elements[i].id}>
      <div class="list__text">${elements[i].title}</div>
      <button type="button" class="list__button">Готово</button>
    </li>
    `);
  }

  hasLength();
}

getTodos(url);

// saving to localStorage
function toStorage() {
  localStorage.setItem('data', JSON.stringify(elements));
}

// getting from localStorage
function fromStorage() {
  JSON.parse(localStorage.getItem('data'));
}

// checking array length
function hasLength() {
  if (elements.length > 0) {
    empty.style.display = "none";
  } else {
    empty.style.display = "block";
  };
}

// adding task to the list
addBtn.addEventListener('click', () => {
  if (newTask.value.trim().length === 0) {
    return;
  };

  let element = {
    id: elements.map(el => el.id).sort((a, b) => b - a)[0] + 1,
    title: newTask.value,
  };

  elements.push(element);
  tasksList.insertAdjacentHTML('beforeend', `
    <li class="list__item" id=${element.id}>
      <div class="list__text">${newTask.value}</div>
      <button type="button" class="list__button">Готово</button>
    </li>
  `);

  newTask.value = '';

  hasLength();

  toStorage();
});

// removing task from the list
tasksList.addEventListener('click', (event) => {
  if (!event.target.matches('.list__button')) {
    return;
  }

  let listIndex = event.target.closest('.list__item').id;
  let arrIndex = elements.findIndex((el) => el.id === +listIndex);
  event.target.closest('.list__item').remove();
  elements.splice(arrIndex, 1);

  hasLength();

  toStorage();
});

if (localStorage.getItem('data')) {
  fromStorage();
};

hasLength();
