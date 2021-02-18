const body = document.querySelector("body");
const contentArea = document.createElement("div");
contentArea.id = "canvas";

/*
=====================================
  TASKS
=====================================
*/

//? Crear tarea

async function createTask() {
    const form = document.getElementById("createTask");
    var obj = {};
    for (var i = 0; i < form.elements.length; i++) {
        var item = form.elements.item(i);
        obj[item.name] = item.value;
    }
    const response = await fetch("http://localhost:8080/task", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
}


/*
=====================================
  USUARIOS
=====================================
*/

// Crear usuario
async function createUser() {
    const form = document.getElementById("createUser");
    var obj = {};
    for (var i = 0; i < form.elements.length; i++) {
        var item = form.elements.item(i);
        obj[item.name] = item.value;
    }
    const response = await fetch("http://localhost:8080/user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
}

//? Modificar Tarea

function modifyTask() {
    contentArea.remove();

    console.log("vamos a modificar la tarea:")
}

//? Ver Tareas

function printTaskData(tasks) {
    const tareas = Object.entries(tasks).map(([key, value]) => {
        return { id: key, ...value }
    });

    const selectedViewerGrid = document.querySelector("#viewerGrid");
    // if (selectedViewerGrid) {
    //     selectedViewerGrid.remove();
    // };
    const contentGrid = document.createElement("div");
    const headerTasks = document.createElement("header");
    const titleTasks = document.createElement("h1");

    headerTasks.id = "headerTasks";
    titleTasks.id = "tituloTareas";
    contentGrid.id = "viewerGrid";

    titleTasks.innerText = "Tareas";

    body.appendChild(contentArea);
    contentArea.appendChild(headerTasks);
    headerTasks.appendChild(titleTasks);
    contentArea.appendChild(contentGrid);

    const listElements = tareas.map((task) => {
        // console.log("task dentro de map:", task);

        const div = document.createElement("div");
        const h3Title = document.createElement("h3");
        const pDescription = document.createElement("p");
        const pDate = document.createElement("p");
        const modifyBtn = document.createElement("button");

        div.id = "element";
        h3Title.className = "titleTask"
        pDescription.className = "description";
        pDate.className = "dateTask";
        modifyBtn.className = "modifyInput";

        h3Title.innerText = task.title;
        pDescription.innerText = task.description;
        pDate.innerText = task.lastDate;
        modifyBtn.innerText = "Modificar tarea";

        modifyBtn.addEventListener("click", modifyTask);

        div.appendChild(h3Title);
        div.appendChild(pDescription);
        div.appendChild(pDate);
        div.appendChild(modifyBtn);
        contentGrid.appendChild(div);


        return div;
    });
}




async function getTasks() {
    try {
        const response = await fetch("http://localhost:8080/task")
            // .then(response => response.json())
            // .then(data => {
            // console.log("data dentro del fetch:", data);
            // const tasks = data.msg;
            // console.log("task del fetch:", tasks);
            // printTaskData(tasks);
            // });
        const data = await response.json();

        console.log("Datos pedidos")
        return data;
    } catch (error) {
        throw "Datos no encontrados"
    }
}

// console.log("data fuera de getTasks:", data);
// getTasks();


getTasks().then(data => {
    const tasks = data.msg;
    printTaskData(tasks);
});