"use strict";

const checkBtn = document.querySelectorAll(".checked");
const taskInfo = document.querySelectorAll(".task p");
const removeBtn = document.querySelectorAll(".removed");
const taskBar = document.querySelector(".tasks");
const addBtn = document.querySelector("div#form button");
const taskValue = document.querySelector("#form input");
const modalSection = document.querySelector(".emptyTaskModal");
const task = document.querySelectorAll(".task");
const checkSection = document.querySelector(".checkedToDo");
const checkToggle = document.querySelector("#checkToggle");
const form = document.querySelector("#form")
const navBtn = document.querySelectorAll(".side-nav ul li");
const hamBurger = document.querySelector('.ham-burger');
const aboutSection = document.querySelector("#social-handles");
const pageToggleBtn = document.querySelector(".page-toggle");
const clipBoard = document.querySelectorAll(".share");
const remainToggle = document.querySelector("#remainToggle");
const refreshBtn = document.querySelector("#refreshBtn");

document.addEventListener("DOMContentLoaded", getTodos)
document.addEventListener("DOMContentLoaded", getCheckedTodos)

function createNode(parent) {
	const newDiv = document.createElement("div");
	const newPara = document.createElement("p");
	const newCheckBtn = document.createElement("img");
	const newCloseBtn = document.createElement("img");
	const textInfo = taskValue.value
  const newContent = document.createTextNode(textInfo);
  const firstChild = parent.firstChild;
  newDiv.classList.add("task")
  newCheckBtn.classList.add("checked")
  newCloseBtn.classList.add("removed")
  newCheckBtn.setAttribute("src", "img/check.svg")
  newCloseBtn.setAttribute("src", "img/close.svg")

  newPara.appendChild(newContent);
  newDiv.appendChild(newPara);
  newDiv.appendChild(newCheckBtn);
  newDiv.appendChild(newCloseBtn);
  if (firstChild === null) {
  	parent.insertBefore(newDiv, firstChild);
  } else {
  	parent.insertBefore(newDiv, firstChild);
  }
}

addBtn.addEventListener("click", () => {
  if (taskValue.value === "") {
  	document.querySelector(".emptyTaskModal p").textContent = "Cannot Add Empty Task!!!"
		modalSection.classList.remove("modalAnimate")
		modalSection.addEventListener("animationend", () => {
			modalSection.classList.add("modalAnimate")
		})
	} else if (taskValue.value !== "") {
		createNode(taskBar)
  	saveLocalTodos(taskValue.value)
	}
  taskValue.value = ""
})

taskBar.addEventListener("click", (e) => {
	const item = e.target;
	if (item.classList[0] === "removed") {
		const todo = item.parentElement;
		const todoText = todo.children[0].innerText;
		todo.classList.add("removing")
		removeLocalTodos(todoText)
		checkSection.children.forEach(child => {
			if (child.innerText === todoText) {
				child.remove();
			}
		})
		todo.addEventListener("animationend", () => {
			todo.remove();
		})
		if (item.previousElementSibling.previousElementSibling.classList.contains("completed")) {
			removeLocalTodos([todoText, "completed"])
		} else {
			removeLocalTodos([todoText])
		}
	} else if (item.classList[0] === "checked") {
			item.previousElementSibling.classList.add("completed")
			checkedMaker(item.parentElement)
			checkLocalTodo(item.previousElementSibling.innerText)
	}
})

const checkedMaker = (childElm) => {
	const needElm = childElm;
	const newChecked = needElm.cloneNode(true)
	newChecked.children[0].style.textDecoration = "none"
	newChecked.children[0].style.color = "#545454"
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
	checkToggle.textContent === "Checked Task" ? checkToggle.textContent = "Add Task" : checkToggle.textContent = "Checked Task"
	document.querySelector("#task-bar h5").textContent === "To Do List" || "Remaining Task" ? document.querySelector("#task-bar h5").textContent = "Checked To Do" : document.querySelector("#task-bar h5").textContent = "To Do List"
	
	document.querySelector(".taskHead").style.display = "none"
	setTimeout(function() {
		document.querySelector(".taskHead").style.display = "initial"
	}, 1);
	taskBar.classList.toggle("display-none")
	if (taskBar.classList.contains("display-none")) {
		form.style.display = "none"
	} else if (!taskBar.classList.contains("display-none")) {
		form.style.display = "grid"
	}
	checkSection.classList.toggle("display-none");
	if (remainToggle.textContent === "Add Task") {
		remainToggle.textContent = "Remaining Task"
	}
	if (remainToggle.textContent === "Remaining Task") {
		if (!taskBar.classList.contains("display-none")) {
			taskBar.children.forEach(child => {
				if (child.children[0].classList.contains("completed")){
					if (child.style.display === "none") {
						document.querySelector(".taskHead").textContent = "To Do List"
						form.style.display = "grid";
						form.style.animation = "rightIn 1s ease-in-out 1"
						child.style.display = "grid";
						child.style.animation = "todo 1s ease-in-out 1";
						child.addEventListener("animationend", () => {
							child.style.display = "grid";
						})
						form.addEventListener("animationend", () => {
							form.style.display = "grid";
						})
					}
				}
			})
		}
	}
})

remainToggle.addEventListener("click", () => {
	remainToggle.textContent === "Remaining Task" ? remainToggle.textContent = "Add Task" : remainToggle.textContent = "Remaining Task";
	
	if (remainToggle.textContent === "Add Task") {
		if (!checkSection.classList.contains("display-none")) {
			checkSection.classList.add("display-none")
			taskBar.classList.remove("display-none");
			checkToggle.textContent = "Checked Task";
		}
		const taskChilds = taskBar.children;
		taskChilds.forEach((child) => {
			if (child.children[0].classList.contains("completed")) {
				child.style.animation = "rightOut 1s ease-in-out 1";
				child.addEventListener("animationend", () => {
					child.style.display = "none";
				})
			} else if (!child.children[0].classList.contains("completed")) {
				child.style.display = "none";
				setTimeout(function() {
					child.style.animation = "rightIn 1s ease-in-out 1"
					child.style.display = "grid";
				}, 10);
			}
		})
		form.style.animation = "leftOut 1s ease-in-out 1";
		form.addEventListener("animationend", () => {
			form.style.display = "none";
		})
		document.querySelector(".taskHead").textContent = "Remaining Task";
	} else if (remainToggle.textContent === "Remaining Task") {
		taskBar.children.forEach(child => {
			if (child.children[0].classList.contains("completed")) {
				child.style.display = "grid";
				child.style.animation = "todo 1s ease-in-out 1";
				child.addEventListener("animationend", () => {
					child.style.display = "grid";
				})
			} else if (!child.children[0].classList.contains("completed")) {
				child.style.display = "none";
				setTimeout(function() {
					child.style.animation = "todo 1s ease-in-out 1"
					child.style.display = "grid";
				}, 10);
			}
		})
		document.querySelector(".taskHead").textContent = "To Do List";
		form.style.display = "grid";
		form.style.animation = "todo 1s ease-in-out 1";
		form.addEventListener("animationend", () => {
			form.style.display = "grid";
		})
	}
})

refreshBtn.addEventListener("click", () => {
	location.reload();
})

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
	checkSection.appendChild(newPara)
	}
})

hamBurger.addEventListener("click", () => {
	document.querySelector("#side-nav").classList.toggle("side-nav-showed")
})

document.querySelector("#logo").addEventListener("click", () => {
	if (document.querySelector("#side-nav").classList.contains("side-nav-showed")) {
		document.querySelector("#side-nav").classList.remove("side-nav-showed")
	}
})

document.querySelector("#task-bar").addEventListener("click", () => {
	if (document.querySelector("#side-nav").classList.contains("side-nav-showed")) {
		document.querySelector("#side-nav").classList.remove("side-nav-showed")
	}
})

pageToggleBtn.addEventListener("click", togglePage)

function togglePage() {
	const logoH1 = document.querySelector("#logo h1")
	if (aboutSection.style.display === "" || aboutSection.style.display === "none") {
		document.querySelector("#task-bar").style.display = "none";
		logoH1.style.display = "none";
		setTimeout(function() {
			logoH1.style.display = "initial";
		}, 10);
		aboutSection.style.display = "flex"
		hamBurger.style.display = "none"
		document.querySelector("nav").style.justifyContent = "flex-end"
		pageToggleBtn.textContent = "App"
		logoH1.innerHTML = `Developed By,<br />Yagnik Patel.`
	} else if (aboutSection.style.display === "flex") {
		document.querySelector("#task-bar").style.display = "flex"
		logoH1.style.display = "none";
		setTimeout(function() {
			logoH1.style.display = "initial";
		}, 10);
		aboutSection.style.display = "none"
		hamBurger.style.display = "block";
		document.querySelector("nav").style.justifyContent = "space-between"
		pageToggleBtn.textContent = "About"
		logoH1.innerHTML = `Good Morning,<br />User.`
	}
} 

clipBoard.forEach(clipboard => {
	clipboard.addEventListener("click", (e) => {
		document.querySelector(".emptyTaskModal p").textContent = "Copied To Clipboard!"
		modalSection.classList.remove("modalAnimate")
		modalSection.addEventListener("animationend", () => {
			modalSection.classList.add("modalAnimate")
		})
		const needLink = e.target.previousElementSibling.getAttribute("href")
		const textarea = document.createElement("textarea")
		const textareaChild = document.createTextNode(needLink)
		textarea.appendChild(textareaChild)
		document.body.appendChild(textarea)
		textarea.classList.add("copy-text")
		var copyTextarea = document.querySelector('.copy-text');
  	copyTextarea.focus();
  	copyTextarea.select();
  	document.execCommand('copy');
		document.body.removeChild(textarea)
	})
})

function saveLocalTodos(todo) {
	let todos; 
	if (localStorage.getItem("todosMadeByYagnik") === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem("todosMadeByYagnik")) 
	}
	
	let needTodo = [todo]
	todos.push(needTodo)
	localStorage.setItem("todosMadeByYagnik", JSON.stringify(todos))
}

function getTodos() {
	let todos; 
	if (localStorage.getItem("todosMadeByYagnik") === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem("todosMadeByYagnik")) 
	}
	
	todos.forEach((todo) => {
		const newDiv = document.createElement("div");
		const newPara = document.createElement("p");
		const newCheckBtn = document.createElement("img");
		const newCloseBtn = document.createElement("img");
		let textInfo;
		if (todo.length === 1) {
			textInfo = todo[0];
		} else if (todo.length === 2) {
			textInfo = todo[0];
			newPara.classList.add(todo[1])
		}
		
  	const newContent = document.createTextNode(textInfo);
  	const firstChild = taskBar.firstChild;
  	newDiv.classList.add("task")
  	newCheckBtn.classList.add("checked")
  	newCloseBtn.classList.add("removed")
  	newCheckBtn.setAttribute("src", "img/check.svg")
  	newCloseBtn.setAttribute("src", "img/close.svg")

  	newPara.appendChild(newContent);
  	newDiv.appendChild(newPara);
  	newDiv.appendChild(newCheckBtn);
  	newDiv.appendChild(newCloseBtn);
  	if (firstChild === null) {
  		taskBar.insertBefore(newDiv, firstChild);
  	} else {
  		taskBar.insertBefore(newDiv, firstChild);
  	}
	})
}

function removeLocalTodos(todo) {
	let todos;
	if (localStorage.getItem("todosMadeByYagnik") === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem("todosMadeByYagnik")) 
	}
	
	console.log(todo);
	todos.splice(todos.indexOf(todo), 1)
	localStorage.setItem("todosMadeByYagnik", JSON.stringify(todos))
}

function checkLocalTodo(todo) {
	let todos = JSON.parse(localStorage .getItem("todosMadeByYagnik"));
	let index;
	let need;
	todos.forEach((eachTodo) => {
		eachTodo.forEach(task => {
			if (task === todo) {
				need = task;
			}
		})
		if (eachTodo[0] === need) {
			index = todos.indexOf(eachTodo)
			todos.splice(index, 1, [todo, "completed"])
			localStorage.setItem("todosMadeByYagnik", JSON.stringify(todos));
		}
	})
}

function getCheckedTodos() {
	let todos;
	if (localStorage.getItem("todosMadeByYagnik") === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem("todosMadeByYagnik")) 
	}
	
	let checkedTodo;
	todos.forEach(todo => {
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
	})
}