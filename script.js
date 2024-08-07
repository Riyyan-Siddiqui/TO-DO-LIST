// let radio = $("task-container input");
// task_container.style.backgroundColor = "red";

//Functionality

//Psuedocode:

// 1. When button is clicked pop up will occur

// 2. In pop-up there will be input text form appearing in center

// 3. The input will be storing data in local space

// 4. A div will be created in which there will be radio button, task, edit icon and delete icon.

// 5. If radio icon is clicked then opacity of that targetted div will be reduced and text decoration is line through.

// 6. If div is clicked delete icon will appear.

// 7. If delete icon is clicked so that particular div will be removed from local storage as well.

"use strict";

let $ = (id) => {
  return document.getElementById(id);
};

// Accessing HTML elements
let task_btn = document.querySelector(".row-2 button");
let main_container = $("container");
let pop_container = $("pop-container");
let task_input = $("enterTask");
let tick = $("tick");
let cross = $("cross");
let task_container = $("task-container");
let editing_taskId = null;
const TASK_INDEX_KEY = "taskIndex";
let i = 0;

const Popup = () => {
  main_container.style.filter = "blur(10px)";
  pop_container.style.display = "inherit";
};

const closePopup = () => {
  pop_container.style.display = "none";
  main_container.style.filter = "none";
  task_input.value = "";
};

task_btn.addEventListener("click", () => {
  Popup();
});

tick.addEventListener("click", (evt) => {
  evt.preventDefault();
  if (task_input.value === "") {
    closePopup();
    alert("Add some text to the task bar");
    return;
  }

  if (editing_taskId === null) {
    // Adding mode
    localStorage.setItem(i, task_input.value);
    addTaskonDOM(i, task_input.value);
    i += 1;
    updateTaskIndex(i); // Update task index after adding a new task
  } else {
    // Editing mode
    let para = document.querySelector(`[DivNo='${editing_taskId}'] p`);
    localStorage.setItem(editing_taskId, task_input.value);
    para.innerText = task_input.value;
    editing_taskId = null; // Reset editing mode
  }

  closePopup();
});

cross.addEventListener("click", (evt) => {
  evt.preventDefault();
  closePopup();
});

const addTaskonDOM = (i, task) => {
  let div = document.createElement("div");
  let input = document.createElement("input");
  div.setAttribute("DivNo", `${i}`);
  input.type = "radio";
  input.classList.add("radio");
  let para = document.createElement("p");
  para.innerText = task;
  let editIcon = document.createElement("i");
  editIcon.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  let delIcon = document.createElement("i");
  delIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  div.append(input);
  div.append(para);
  div.append(editIcon);
  div.append(delIcon);
  task_container.prepend(div);

  div.addEventListener("click", (evt) => {
    checkDone(evt.target, para, div, input);
  });

  delIcon.addEventListener("click", (evt) => {
    let no = div.getAttribute("DivNo");
    deleteTask(evt.target, div, no);
  });

  editIcon.addEventListener("click", (evt) => {
    editing_taskId = i;
    evt.preventDefault();
    Popup();
  });
};

const checkDone = (el, para, div, input) => {
  if (el.checked) {
    para.style.textDecoration = "line-through";
    div.style.opacity = "60%";
    input.disabled = "true";
  }
};

const deleteTask = (el, div, Divno) => {
  div.remove();
  localStorage.removeItem(Divno);
};

const updateTaskIndex = (newIndex) => {
  localStorage.setItem(TASK_INDEX_KEY, newIndex);
};

const loadTasksFromLocalStorage = () => {
  let taskCount = localStorage.length;
  for (let index = 0; index < taskCount; index++) {
    let key = localStorage.key(index);
    if (key === TASK_INDEX_KEY) continue; // Skip the index key
    let taskValue = localStorage.getItem(key);
    addTaskonDOM(key, taskValue);
  }
};

window.addEventListener("load", () => {
  i = Number(localStorage.getItem(TASK_INDEX_KEY)) || 0;
  loadTasksFromLocalStorage();
});
