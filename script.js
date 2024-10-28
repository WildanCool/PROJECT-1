const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(tugas);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      tugas.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTugas();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addTugas() {
  const textTugas = document.getElementById("title").value;
  const tanngalMembuat = document.getElementById("date").value;

  const membuatId = generateId();
  const tugasObject = membuatTugasObject(
    membuatId,
    textTugas,
    tanngalMembuat,
    false
  ); //false berarti belum dikerjakan
  tugas.push(tugasObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

tugas = [];
const RENDER_EVENT = "render-tugas";

function membuatTugasObject(membuatId, textTugas, tanggalMembuat, isCompleted) {
  return {
    id: membuatId,
    tugas: textTugas,
    tanggal: tanggalMembuat,
    completed: isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(tugas);
});

function buatTugas(tugasObject) {
  const listTugas = document.createElement("h2");
  listTugas.innerText = tugasObject.tugas;
  listTugas.classList.add("text-base", "font-bold");

  const listTanggal = document.createElement("p");
  listTanggal.innerText = tugasObject.tanggal;
  listTanggal.classList.add("text-xs");

  const kotakList = document.createElement("div");
  kotakList.classList.add("inner");
  kotakList.append(listTugas, listTanggal);

  const container = document.createElement("div");
  container.classList.add(
    "item",
    "shadow",
    "flex",
    "bg-white",
    "rounded-sm",
    "h-12",
    "px-1",
    "mt-2"
  );
  container.append(kotakList);
  container.setAttribute("id", `tugas-${tugasObject.id}`);

  if (tugasObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button", "mt-1");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(tugasObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button", "mt-1");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(tugasObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button", "mt-1", "mr-1");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(tugasObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(tugas);
  const uncompletedTugas = document.getElementById("tugas");
  uncompletedTugas.innerHTML = "";

  const completedTODOList = document.getElementById("tugas-terselesaikan");
  completedTODOList.innerHTML = "";

  for (const tugasItem of tugas) {
    const tugasElement = buatTugas(tugasItem);

    if (!tugasItem.isCompleted) {
      uncompletedTugas.append(tugasElement);
    } else completedTODOList.append(tugasElement);
  }
});

function removeTaskFromCompleted(todoId) {
  const tugasTarget = findTodoIndex(todoId);

  if (tugasTarget === -1) return;

  tugas.splice(tugasTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in tugas) {
    if (tugas[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

function undoTaskFromCompleted(todoId) {
  const tugasTarget = findTodo(todoId);

  if (tugasTarget == null) return;

  tugasTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(todoId) {
  const tugasTarget = findTodo(todoId);

  if (tugasTarget == null) return;

  tugasTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodo(todoId) {
  for (const todoItem of tugas) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}
