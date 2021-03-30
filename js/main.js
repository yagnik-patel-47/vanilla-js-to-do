"use strict";
const checkBtn = document.querySelectorAll(".checked");
const removeBtn = document.querySelectorAll(".removed");
const taskBar = document.querySelector(".tasks");
const addBtn = document.querySelector("div#form button");
const taskValue = document.querySelector("#form input");
const modalSection = document.querySelector(".emptyTaskModal");
const task = document.querySelectorAll(".task");
const checkSection = document.querySelector(".checkedToDo");
const checkToggle = document.querySelector("#checkToggle");
const form = document.querySelector("#form");
const burgers = document.querySelectorAll(".burger");
const hamBurger = document.querySelector(".ham-burger");
const aboutSection = document.querySelector("#social-handles");
const pageToggleBtn = document.querySelector(".page-toggle");
const clipBoard = document.querySelectorAll(".share");
const remainToggle = document.querySelector("#remainToggle");
const refreshBtn = document.querySelector("#refreshBtn");
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw_app.js");
  });
}

document.addEventListener("DOMContentLoaded", getTodos);
document.addEventListener("DOMContentLoaded", getCheckedTodos);

const animations = {
  leftIn: {
    targets: "#logo img",
    translateX: ["-3rem", 0],
    opacity: [0, 1],
    duration: 1500,
    easing: "spring(1, 80, 10, 0)",
  },
  bottomIn: {
    targets: ["#form", ".task"],
    translateY: ["2rem", 0],
    opacity: [0, 1],
    duration: 700,
    easing: "easeInOutExpo",
  },
  rightIn: {
    targets: ".about-link button",
    translateX: ["3rem", 0],
    opacity: [0, 1],
    duration: 1500,
    easing: "spring(1, 80, 10, 0)",
  },
  GetRid: {
    targets: "",
    translateX: [0, "100%"],
    duration: 1500,
    easing: "spring(1, 80, 10, 0)",
  },
  GetIn: {
    targets: "",
    translateX: ["-3rem", 0],
    opacity: [0, 1],
    duration: 1500,
    easing: "spring(1, 80, 10, 0)",
  },
  GetRidHam: {
    targets: "",
    translateX: [0, "-3rem"],
    opacity: [1, 0],
    duration: 1500,
    easing: "spring(1, 80, 10, 0)",
  },
  fadeOff: {
    targets: "",
    opacity: [1, 0],
    scale: [1, 0.8],
    duration: 400,
    easing: "easeInOutQuad",
  },
  fadeIn: {
    targets: "",
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 300,
    easing: "easeInOutQuad",
  },
  rightOut: {
    targets: "",
    opacity: [1, 0],
    translateX: [0, "3rem"],
    duration: 600,
    easing: "easeInOutQuad",
  },
  deleteFade: {
    targets: "",
    keyframes: [
      { translateY: "2rem", scale: 0.8, opacity: 1 },
      { translateY: "10rem", scale: 0.8, opacity: 0 },
    ],
    duration: 600,
    easing: "spring(1, 80, 10, 0)",
  },
  modalIn: {
    targets: "",
    keyframes: [
      { translateY: "-2rem", opacity: 0 },
      { translateY: 0, opacity: 1 },
    ],
    duration: 800,
    easing: "spring(1, 80, 10, 0)",
  },
};
function createNode(parent) {
  const newDiv = document.createElement("div");
  const newPara = document.createElement("p");
  const newCheckBtn = document.createElement("img");
  const newCloseBtn = document.createElement("img");
  const textInfo = taskValue.value;
  const newContent = document.createTextNode(textInfo);
  const firstChild = parent.firstChild;
  newDiv.classList.add("task");
  newCheckBtn.classList.add("checked");
  newCloseBtn.classList.add("removed");
  newCheckBtn.classList.add("fade-in-out");
  newCloseBtn.classList.add("spinThat");
  newCheckBtn.setAttribute("src", "img/check.svg");
  newCloseBtn.setAttribute("src", "img/close.svg");
  newPara.classList.add("taskText");
  newPara.appendChild(newContent);
  newDiv.appendChild(newPara);
  newDiv.appendChild(newCheckBtn);
  newDiv.appendChild(newCloseBtn);
  if (firstChild === null) {
    parent.appendChild(newDiv);
  } else {
    parent.insertBefore(newDiv, firstChild);
  }
  anime(animInit(animations.bottomIn, newDiv));
  anime({
    targets: newDiv,
    translateY: ["2rem", 0],
    rotateY: [45, 0],
    opacity: [0, 1],
    duration: 700,
    easing: "easeInOutExpo",
    delay: 100,
  });
}
addBtn.addEventListener("click", () => {
  if (taskValue.value === "") {
    document.querySelector(".emptyTaskModal p").textContent =
      "Cannot Add Empty Task!!!";
    modalSection.classList.remove("opHidden");
    anime({
      targets: ".emptyTaskModal p",
      opacity: 0,
      duration: 0,
    });
    anime(
      animInit(animations.modalIn, ".emptyTaskModal p")
    ).complete = function () {
      setTimeout(function () {
        anime({
          targets: ".emptyTaskModal p",
          duration: 500,
          keyframes: [
            { translateY: 0, opacity: 1 },
            { translateY: "-2rem", opacity: 0 },
          ],
          easing: "spring(1, 80, 10, 0)",
        }).complete = function () {
          modalSection.classList.add("opHidden");
        };
      }, 1000);
    };
  } else if (taskValue.value !== "") {
    createNode(taskBar);
    saveLocalTodos(taskValue.value);
  }
  taskValue.value = "";
});
taskBar.addEventListener("click", (e) => {
  const item = e.target;
  if (item.getAttribute("src") === "img/close.svg") {
    const todo = item.parentElement;
    const todoPara = todo.children[0];
    const todoText = todoPara.innerText;
    anime(animInit(animations.deleteFade, todo)).complete = function () {
      todo.remove();
    };
    removeLocalTodos(todoText);
    const checkChilds = checkSection.children;
    [...checkChilds].forEach((child) => {
      let needChild = child;
      if (needChild.innerText === todoText) {
        child.remove();
      }
    });
    if (
      item.previousElementSibling.previousElementSibling.classList.contains(
        "completed"
      )
    ) {
      removeLocalTodos([todoText, "completed"]);
    } else {
      removeLocalTodos([todoText]);
    }
  } else if (item.getAttribute("src") === "img/check.svg") {
    item.previousElementSibling.classList.add("completed");
    item.setAttribute("src", "img/redo.svg");
    let needElem = item.parentElement;
    checkedMaker(item.parentElement);
    checkLocalTodo(needElem.innerText);
    if (item.classList.contains("fade-in-out")) {
      item.classList.replace("fade-in-out", "spinThat");
    } else {
      item.classList.add("spinThat");
    }
  } else if (item.getAttribute("src") === "img/redo.svg") {
    item.previousElementSibling.classList.remove("completed");
    item.setAttribute("src", "img/check.svg");
    removeCheckedTodo(item.parentElement.innerText);
    const checkChilds = checkSection.children;
    [...checkChilds].forEach((child) => {
      let needEleme = item.parentElement;
      let needCh = child;
      if (needCh.innerText === needEleme.innerText) {
        child.remove();
      }
      if (checkChilds.length === 0) {
        const newPara = document.createElement("p");
        const newContent = document.createTextNode("No Checked Task");
        newPara.appendChild(newContent);
        checkSection.appendChild(newPara);
      }
    });
    if (item.classList.contains("spinThat")) {
      item.classList.replace("spinThat", "fade-in-out");
    } else {
      item.classList.add("fade-in-out");
    }
  }
});
function checkedMaker(childElm) {
  const needElm = childElm;
  const newChecked = needElm.cloneNode(true);
  newChecked.children[0].style.textDecoration = "none";
  newChecked.children[0].style.color = "#545454";
  newChecked.children[0].classList.remove("taskText");
  newChecked.children[1].remove();
  newChecked.children[1].remove();
  newChecked.classList.replace("task", "centerWork");
  if (checkSection.firstChild.textContent === "No Checked Task") {
    const defaultText = checkSection.firstChild;
    checkSection.replaceChild(newChecked, defaultText);
  } else if (checkSection.firstChild.textContent !== "No Checked Task") {
    checkSection.insertBefore(newChecked, checkSection.firstChild);
  }
}
checkToggle.addEventListener("click", () => {
  checkToggle.textContent === "Checked Task"
    ? (checkToggle.textContent = "Add Task")
    : (checkToggle.textContent = "Checked Task");
  document.querySelector(".taskHead").textContent ===
  ("To Do List" || "Remaining Task")
    ? (document.querySelector(".taskHead").textContent = "Checked To Do")
    : (document.querySelector(".taskHead").textContent = "To Do List");
  document.querySelector("#side-nav").classList.remove("side-nav-showed");
  burgers[1].classList.toggle("middle-rem");
  burgers[0].classList.toggle("top-bur");
  burgers[2].classList.toggle("bottom-bur");
  if (getComputedStyle(checkSection).display === "block") {
    //Check Active
    anime(animInit(animations.fadeOff, checkSection)).complete = () => {
      taskBar.classList.toggle("display-none");
      form.style.display = "grid";
      checkSection.classList.toggle("display-none");
      anime(animInit(animations.fadeIn, [taskBar, form]));
    };
  } else if (getComputedStyle(checkSection).display === "none") {
    // Task Active
    anime(animInit(animations.fadeOff, [taskBar, form])).complete = () => {
      form.style.display = "none";
      checkSection.classList.toggle("display-none");
      taskBar.classList.toggle("display-none");
      anime(animInit(animations.fadeIn, checkSection));
    };
  }
  anime(animInit(animations.leftIn, ".taskHead"));
  if (remainToggle.textContent === "Add Task") {
    remainToggle.textContent = "Remaining Task";
  }
  if (remainToggle.textContent === "Remaining Task") {
    if (!taskBar.classList.contains("display-none")) {
      [...taskBar.children].forEach((child) => {
        if (child.children[0].classList.contains("completed")) {
          if (child.style.display === "none") {
            document.querySelector(".taskHead").textContent = "Checked To Do";
            form.style.display = "grid";
            child.style.display = "grid";
            anime(animInit(animations.fadeIn, child));
          }
        }
      });
    }
  }
});
remainToggle.addEventListener("click", () => {
  let toDefCounter = 0;
  remainToggle.textContent === "Remaining Task"
    ? (remainToggle.textContent = "Add Task")
    : (remainToggle.textContent = "Remaining Task");
  document.querySelector("#side-nav").classList.remove("side-nav-showed");
  burgers[1].classList.toggle("middle-rem");
  burgers[0].classList.toggle("top-bur");
  burgers[2].classList.toggle("bottom-bur");
  anime(animInit(animations.leftIn, ".taskHead"));
  if (remainToggle.textContent === "Add Task") {
    if (!checkSection.classList.contains("display-none")) {
      anime(animInit(animations.fadeOff, checkSection)).complete = function () {
        checkSection.classList.add("display-none");
        taskBar.classList.remove("display-none");
        form.style.display = "grid";
        checkToggle.textContent = "Checked Task";
        anime(animInit(animations.fadeIn, taskBar));
        anime(animInit(animations.fadeIn, form));
      };
    }
    anime(animInit(animations.fadeOff, form)).complete = function () {
      form.style.display = "none";
    };
    const taskChilds = taskBar.children;
    [...taskChilds].forEach((child) => {
      if (child.children[0].classList.contains("completed")) {
        anime(animInit(animations.fadeOff, child)).complete = function () {
          child.style.display = "none";
        };
      } else if (!child.children[0].classList.contains("completed")) {
        toDefCounter++;
        anime(animInit(animations.fadeIn, child, 400));
        child.addEventListener("click", (e) => {
          const targetE = e.target;
          if (targetE.classList.contains("checked")) {
            if (remainToggle.textContent === "Add Task") {
              anime(
                animInit(animations.rightOut, child)
              ).complete = function () {
                child.style.display = "none";
                anime({
                  targets: child,
                  translateX: 0,
                  duration: 0,
                });
              };
            }
          }
        });
      }
    });
    document.querySelector(".taskHead").textContent = "Remaining Task";
  } else if (remainToggle.textContent === "Remaining Task") {
    const taskChilds = taskBar.children;
    [...taskChilds].forEach((child) => {
      anime(animInit(animations.fadeOff, child)).complete = function () {
        child.style.display = "grid";
        anime(animInit(animations.fadeIn, child));
      };
    });
    form.style.display = "grid";
    anime(animInit(animations.fadeIn, form, 400));
    document.querySelector(".taskHead").textContent = "To Do List";
  }
});
refreshBtn.addEventListener("click", () => {
  location.reload();
});
if (!checkSection.hasChildNodes()) {
  const newPara = document.createElement("p");
  const newContent = document.createTextNode("No Checked Task");
  newPara.appendChild(newContent);
  checkSection.appendChild(newPara);
}
checkToggle.addEventListener("click", () => {
  if (!checkSection.hasChildNodes()) {
    const newPara = document.createElement("p");
    const newContent = document.createTextNode("No Checked Task");
    newPara.appendChild(newContent);
    checkSection.appendChild(newPara);
  }
});
hamBurger.addEventListener("click", () => {
  document.querySelector("#side-nav").classList.toggle("side-nav-showed");
  burgers[1].classList.toggle("middle-rem");
  burgers[0].classList.toggle("top-bur");
  burgers[2].classList.toggle("bottom-bur");
});
pageToggleBtn.addEventListener("click", togglePage);
function togglePage() {
  if (
    aboutSection.style.display === "" ||
    aboutSection.style.display === "none"
  ) {
    document.querySelector(".developerHead").style.visibility = "visible";
    pageToggleBtn.textContent = "App";
    anime(animInit(animations.GetIn, ".developerHead"));
    anime(animInit(animations.GetRid, ".userHead"));
    anime(animInit(animations.GetRidHam, ".ham-burger"));
    anime({
      targets: "#task-bar",
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 500,
      easing: "easeInOutQuad",
      complete: function () {
        aboutSection.style.display = "flex";
        document.querySelector("#task-bar").style.display = "none";
        anime(animInit(animations.fadeIn, "#social-handles"));
        anime(animInit(animations.bottomIn, ".handle", anime.stagger(200)));
        anime(animInit(animations.leftIn, ".handles-head"), 150);
        anime(animInit(animations.bottomIn, ".thanks-footer"), 150);
      },
    });
    if (
      document.querySelector("#side-nav").classList.contains("side-nav-showed")
    ) {
      document.querySelector("#side-nav").classList.remove("side-nav-showed");
      burgers[1].classList.remove("middle-rem");
      burgers[0].classList.remove("top-bur");
      burgers[2].classList.remove("bottom-bur");
    }
  } else if (aboutSection.style.display === "flex") {
    pageToggleBtn.textContent = "About";
    anime({
      targets: "#social-handles",
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 500,
      easing: "easeInOutQuad",
      complete: function () {
        aboutSection.style.display = "none";
        document.querySelector("#task-bar").style.display = "flex";
        anime(animInit(animations.fadeIn, "#task-bar"));
        anime(animInit(animations.leftIn, ".taskHead"), 150);
        anime(
          animInit(animations.bottomIn, ["#form", ".task"], anime.stagger(200))
        );
      },
    });
    anime(animInit(animations.GetRid, ".developerHead"));
    anime(animInit(animations.GetIn, ".userHead"));
    anime(animInit(animations.GetIn, ".ham-burger"));
  }
}
[...clipBoard].forEach((clipboard) => {
  clipboard.addEventListener("click", (e) => {
    document.querySelector(".emptyTaskModal p").textContent =
      "Copied To Clipboard!";
    modalSection.classList.remove("opHidden");
    anime({
      targets: ".emptyTaskModal p",
      opacity: 0,
      duration: 0,
    });
    anime(
      animInit(animations.modalIn, ".emptyTaskModal p")
    ).complete = function () {
      setTimeout(function () {
        anime({
          targets: ".emptyTaskModal p",
          duration: 500,
          keyframes: [
            { translateY: 0, opacity: 1 },
            { translateY: "-2rem", opacity: 0 },
          ],
          easing: "spring(1, 80, 10, 0)",
        }).complete = function () {
          modalSection.classList.add("opHidden");
        };
      }, 1000);
    };
    const clipImg = e.target;
    const needLink = clipImg.previousElementSibling.getAttribute("href");
    const textarea = document.createElement("textarea");
    const textareaChild = document.createTextNode(needLink);
    textarea.appendChild(textareaChild);
    document.body.appendChild(textarea);
    textarea.classList.add("copy-text");
    var copyTextarea = document.querySelector(".copy-text");
    copyTextarea.focus();
    copyTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  });
});
function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todosMadeByYagnik") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todosMadeByYagnik"));
  }
  let needTodo = [todo];
  todos.push(needTodo);
  localStorage.setItem("todosMadeByYagnik", JSON.stringify(todos));
}
function getTodos() {
  let todos;
  if (localStorage.getItem("todosMadeByYagnik") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todosMadeByYagnik"));
  }
  todos.forEach((todo) => {
    const newDiv = document.createElement("div");
    const newPara = document.createElement("p");
    const newCheckBtn = document.createElement("img");
    const newCloseBtn = document.createElement("img");
    let textInfo;
    if (todo.length === 1) {
      textInfo = todo[0];
      newCheckBtn.setAttribute("src", "img/check.svg");
      newCheckBtn.classList.add("fade-in-out");
    } else if (todo.length === 2) {
      textInfo = todo[0];
      newPara.classList.add(todo[1]);
      newCheckBtn.setAttribute("src", "img/redo.svg");
      newCheckBtn.classList.add("spinThat");
    }
    const newContent = document.createTextNode(textInfo);
    const firstChild = taskBar.firstChild;
    newDiv.classList.add("task");
    newPara.classList.add("taskText");
    newCheckBtn.classList.add("checked");
    newCloseBtn.classList.add("removed");
    newCloseBtn.classList.add("spinThat");
    newCloseBtn.setAttribute("src", "img/close.svg");
    newPara.appendChild(newContent);
    newDiv.appendChild(newPara);
    newDiv.appendChild(newCheckBtn);
    newDiv.appendChild(newCloseBtn);
    if (firstChild === null) {
      taskBar.appendChild(newDiv);
    } else {
      taskBar.insertBefore(newDiv, firstChild);
    }
  });
}
function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todosMadeByYagnik") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todosMadeByYagnik"));
  }
  todos.splice(todos.indexOf(todo), 1);
  localStorage.setItem("todosMadeByYagnik", JSON.stringify(todos));
}
function checkLocalTodo(todo) {
  let todos = JSON.parse(localStorage.getItem("todosMadeByYagnik"));
  let index;
  let need;
  todos.forEach((eachTodo) => {
    eachTodo.forEach((task) => {
      if (task === todo) {
        need = task;
      }
    });
    if (eachTodo[0] === need) {
      index = todos.indexOf(eachTodo);
      todos.splice(index, 1, [todo, "completed"]);
      localStorage.setItem("todosMadeByYagnik", JSON.stringify(todos));
    }
  });
}
function getCheckedTodos() {
  let todos;
  if (localStorage.getItem("todosMadeByYagnik") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todosMadeByYagnik"));
  }
  let checkedTodo;
  todos.forEach((todo) => {
    if (todo[1] === "completed") {
      checkedTodo = todo;
      const newDiv = document.createElement("div");
      const newPara = document.createElement("p");
      const newContent = document.createTextNode(checkedTodo[0]);
      newPara.style.textDecoration = "none";
      newPara.style.color = "#545454";
      newDiv.classList.add("centerWork");
      newPara.appendChild(newContent);
      newDiv.appendChild(newPara);
      if (checkSection.firstChild.textContent === "No Checked Task") {
        const defaultText = checkSection.firstChild;
        checkSection.replaceChild(newDiv, defaultText);
      } else if (checkSection.firstChild.textContent !== "No Checked Task") {
        checkSection.insertBefore(newDiv, checkSection.firstChild);
      }
    }
  });
}
function removeCheckedTodo(todo) {
  let todos = JSON.parse(localStorage.getItem("todosMadeByYagnik"));
  let index;
  let need;
  todos.forEach((eachTodo) => {
    if (eachTodo.length === 2) {
      if (eachTodo[0] === todo) {
        eachTodo.splice(1, 1);
        localStorage.setItem("todosMadeByYagnik", JSON.stringify(todos));
      }
    }
  });
}
function animInit(obj, targetTags, Animdelay = 0) {
  let animObj = obj;
  animObj.targets = targetTags;
  animObj.delay = Animdelay;
  return animObj;
}