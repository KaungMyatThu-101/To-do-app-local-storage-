let userTaskInput = document.querySelector(".input-txt");
let todoslists = document.querySelector(".todos-list");
let filters = document.querySelectorAll(".filter span");
let clearBtn = document.querySelector(".clear-btn");

let editTeaskId;
let isEditTask = false;
let currentFilterStatus = "all";
//datas from local storage
let todos = JSON.parse(localStorage.getItem("todos-list")) || [];

function statusUpdate(status) {
  let taks = status.parentElement.lastElementChild;
  if (status.checked) {
    taks.classList.add("activate");
    // console.log(todos[status.id]);
    todos[status.id].status = "complete";
  } else {
    taks.classList.remove("activate");
    todos[status.id].status = "pending";
  }
  localStorage.setItem("todos-list", JSON.stringify(todos));
}

function deleteTask(deleteID) {
  todos.splice(deleteID, 1);
  localStorage.setItem("todos-list", JSON.stringify(todos));
  showTodos(currentFilterStatus); // Use currentFilterStatus
}
function updateTask(id, oldTask) {
  editTeaskId = id;
  userTaskInput.value = oldTask; //input text value
  isEditTask = true;
}
//clear all
clearBtn.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todos-list", JSON.stringify(todos));
  showTodos();
});

//for filter tasks

filters.forEach((span) => {
  span.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    currentFilterStatus = span.id; // Update currentFilterStatus
    showTodos(currentFilterStatus);
  });
});

function showTodos(filterStatus = "all") {
  todoslists.innerHTML = ""; //to not repeat the data
  let li = ""; // Define li to hold  HTML string
  if (todos) {
    todos.forEach((key, id) => {
      let statusComplete = key.status == "complete" ? "activate" : "";
      let completeTaskCheck = key.status == "complete" ? "checked" : "";

      if (filterStatus == key.status || filterStatus == "all") {
        li += `
        <li class="todo-items">
          <label for="${id}">
            <input type="checkbox" name="" id="${id}" onclick="statusUpdate(this)" ${completeTaskCheck} />
            <p class="todo-txt ${statusComplete}">${key.tasks}</p>
          </label>
          <div>
            <i class="fa-solid fa-pen-to-square edit-ic" onclick="updateTask(${id},'${key.tasks}')"></i>
            <i class="fa-regular fa-trash-can delete-ic" onclick="deleteTask(${id})"></i>
          </div>
        </li>
        `;
      }
    });
    // todoslists.innerHTML = li || `<span> No lists </span>`;
  }
  todoslists.innerHTML = li || `<p class="noText"> No lists </p>`;
}
showTodos();

userTaskInput.addEventListener("keyup", (e) => {
  let inputText = userTaskInput.value.trim();
  if (e.key == "Enter" && inputText) {
    if (isEditTask) {
      // Update the existing task instead of adding a new one
      todos[editTeaskId].tasks = inputText;
      // Reset isEditTask to false since we have finished editing
      isEditTask = false;
    } else {
      if (!todos) {
        todos = [];
      }
      let userTasks = { tasks: inputText, status: "pending" };
      todos.push(userTasks);
    }
    // Save the updated todos array to localStorage
    localStorage.setItem("todos-list", JSON.stringify(todos));
    // Clear the input field
    userTaskInput.value = "";
    // Update the displayed todos
    showTodos();
  }
});

// console.log(todos);
