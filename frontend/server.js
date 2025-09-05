const fbform = document.getElementById("fbform")
const fbpara = document.getElementById("fbmessage")
const fblist = document.getElementById("fblist")
const showTasks = document.getElementById("showTasks")
const loginbtn = document.getElementById("logout")

const SERVER = "https://todo-expressjs-api.onrender.com"

//Add task
fbform.addEventListener("submit", async (e)=>{
    e.preventDefault()

    const task = document.getElementById("topic").value
    const message = document.getElementById("message").value
    
    // Basic validation
    if(!task.trim()) {
        fbpara.textContent = "Please enter a task!"
        return
    }

    try{
        const id = Date.now()
        console.log("Adding task:", {id, task, message})

        const res = await fetch(`${SERVER}/tasks/todo`, {
            method:"POST",
            headers:{"Content-Type": "application/json"},
            credentials:"include",
            body: JSON.stringify({id,task,message})
        })

        console.log("Add task response status:", res.status)
        const data = await res.json()
        console.log("Add task response data:", data)

        if(res.ok) {
            fbpara.textContent = data.message
            fbform.reset()
            await lodeTask(true) // Pass true to skip message
        } else {
            fbpara.textContent = data.message || "Failed to add task"
        }

    } catch (error) {
        console.error("Add task error:", error)
        fbpara.textContent = "Error submitting task. Please try again later."
    }
})

//Get task
const lodeTask = async (skipMessage = false) => {
    try{
        console.log("Loading tasks...")
        
        const res = await fetch(`${SERVER}/tasks/todo`, {
            credentials:"include"
        })
        
        console.log("Load tasks response status:", res.status)
        
        if(res.status === 401) {
            const errorData = await res.json()
            if(errorData.message === "No token") {
                loginbtn.textContent = "Login"
                loginbtn.style.backgroundColor = "green"
                if (!skipMessage) fbpara.textContent = "Please log in to view tasks"
                return
            }
        }

        if(!res.ok) {
            throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        console.log("Load tasks response data:", data)

        fblist.innerHTML = ""

        // Check if we have tasks
        if(!data.message || data.message.length === 0) {
            if (!skipMessage) fbpara.textContent = "All clear! Nothing on your list."
            return
        }

        data.message.forEach((task)=>{
            const lipara = document.createElement("p")
            const lidiv = document.createElement("div")
            lidiv.id = "lidiv"

            const li = document.createElement("li")
            const dltButton = document.createElement("button")
            const editButton = document.createElement("button")

            editButton.id = "editBtn"
        
            lipara.textContent = `${task.task}: ${task.message}`
            li.append(lipara)
            lipara.id = "lipara"

            dltButton.textContent = "Delete"
            dltButton.onclick = ()=> deleteTask(task.id) 

            editButton.textContent = "✏️"
            editButton.onclick = ()=> EditTask(task)

            lidiv.append(editButton)
            lidiv.append(dltButton)
            li.append(lidiv)
            fblist.append(li)
        })

        // Only show message if not skipping
        if (!skipMessage) {
            fbpara.textContent = `Loaded ${data.message.length} task(s)`
        }

    }
    catch(error){
        console.error("Load tasks error:", error)
        if (!skipMessage) fbpara.textContent = "Error loading tasks. Make sure you're logged in."
    }
}

showTasks.addEventListener("click", () => lodeTask())

async function deleteTask(id){
    try{
        console.log("Deleting task:", id)
        
        const res = await fetch(`${SERVER}/tasks/todo/${id}`, {
            method:"DELETE",
            credentials:"include"
        })

        console.log("Delete task response status:", res.status)
        const data = await res.json()
        console.log("Delete task response data:", data)

        if(res.ok) {
            fbpara.textContent = data.message
            await lodeTask(true) // Skip message
        } else {
            fbpara.textContent = data.message || "Failed to delete task"
        }
    }
    catch(error){
        console.error("Delete task error:", error)
        fbpara.textContent = "Error deleting task"
    }
}

async function EditTask(task){
    const newTask = prompt("Edit task topic:", task.task)
    const newMessage = prompt("Edit task message:", task.message)

    if(newTask === null && newMessage === null) return
    
    if(!newTask?.trim() && !newMessage?.trim()) {
        fbpara.textContent = "Task cannot be empty"
        return
    }

    try{
        console.log("Editing task:", task.id)
        
        const res = await fetch(`${SERVER}/tasks/todo/${task.id}`, {
            method:"PATCH",
            headers:{"Content-Type": "application/json"},
            credentials:"include",
            body: JSON.stringify({
                task: newTask?.trim() || task.task,
                message: newMessage?.trim() || task.message
            })
        })

        console.log("Edit task response status:", res.status)
        const data = await res.json()
        console.log("Edit task response data:", data)

        if(res.ok) {
            fbpara.textContent = data.message
            await lodeTask(true) // Skip message
        } else {
            fbpara.textContent = data.message || "Failed to edit task"
        }
    }
    catch(error){
        console.error("Edit task error:", error)
        fbpara.textContent = "Error editing task"
    }
}

// Load tasks when page loads (skip message)
lodeTask(true)

// logout
async function logout(){
    fetch(`${SERVER}/auth/logout`,{
        method:"POST",
        credentials:"include"
    })
    window.location.href = "login.html"
}