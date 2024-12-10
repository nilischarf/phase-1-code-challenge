const  todoInput = document.getElementById("input-task")
const addButton = document.getElementById("add-button")
const todoList = document.getElementById("todo-list")

const serverURL = "file:///Users/nilischarf/Development/code/phase-1/phase-1-code-challenge/list.html"

async function fetchTasks() {
    const response = await fetch(serverURL)
    const tasks = await response.json()
    tasks.forEach(task => {
        const listItem = createTaskElement(task.text)
        todoList.appendChild(listItem)
    })
}

async function addTask() {
    const taskName = todoInput.value.trim()

    if (taskName === "") {
        alert("Please enter a task.")
        return
    }

    try {
        const response = await fetch(serverURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: taskName })
        })
        const newTask = await response.json()
        const listItem = createTaskElement(newTask.text)
        todoList.appendChild(listItem)
        todoInput.value = ""
    } catch (error) {
        console.error("Failed to add task:", error);
    }
}
    
   
function createTaskElement(taskName) {
    const listItem = document.createElement("li")
    listItem.draggable = true

    const taskSpan = document.createElement("span") 
    taskSpan.textContent = taskName

    const completeButton = document.createElement("button")
    completeButton.textContent = "✅"
    completeButton.classList.add("complete")
    completeButton.addEventListener("click", () => markTaskComplete (taskSpan, completeButton))

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "❌"
    deleteButton.classList.add("delete")
    deleteButton.addEventListener("click", () => deleteTask (listItem))

    listItem.appendChild(taskSpan)
    listItem.appendChild(completeButton)
    listItem.appendChild(deleteButton)

    listItem.addEventListener("dragstart", dragStart)
    listItem.addEventListener("dragover", dragOver)
    listItem.addEventListener("drop", drop)
    listItem.addEventListener("dragend", dragEnd)

    return listItem
}

function markTaskComplete(taskSpan, completeButton) {
    taskSpan.textContent += "😊"
    taskSpan.style.textDecoration = "line-through"
    completeButton.disabled = true
}

async function deleteTask(taskElement) {
    const taskName = taskElement.querySelector("span").textContent.replace(" 😊", "");
    try {
        const response = await fetch(`${serverURL}/${taskName}`, {
        method: "DELETE",
        })
        todoList.removeChild(taskElement)
    } catch (error) {
        console.error("Failed to delete task:", error);
    }
}
    
let draggedItem = null

function dragStart(e) {
    draggedItem = this
    setTimeout(() => this.style.display = "none", 0)
}

function dragOver(e) {
    e.preventDefault()
}

function drop(e) {
    e.preventDefault()
    if (this !== draggedItem) {
        const allTasks =  Array.from(todoList.children)
        const draggedIndex = allTasks.indexOf(draggedItem)
        const targetIndex = allTasks.indexOf(this)

        if (draggedIndex < targetIndex) {
            this.after(draggedItem)
        } else {
            this.before(draggedItem)
        }
    }
}

function dragEnd() {
    this.style.display = "flex"
    draggedItem = null
}

addButton.addEventListener("click", addTask)

todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask()
    }
})