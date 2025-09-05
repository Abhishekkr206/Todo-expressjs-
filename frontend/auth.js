async function signup(){
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const prtMessage = document.getElementById("message")

    const res = await fetch("http://localhost:5000/auth/signup" , {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({username,password})
    })
    if(res.ok){
        window.location.href = "task.html"
    }
    else{
        const data = await res.json()
        prtMessage.textContent = data.message
    }
}

async function login(){
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const prtMessage = document.getElementById("message")

    const res = await fetch("http://localhost:5000/auth/login" , {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        credentials:"include",
        body:JSON.stringify({username,password})
    })
    if(res.ok){
        window.location.href = "task.html"
    }
    else{
        const data = await res.json()
        prtMessage.textContent = data.message
    }
}
