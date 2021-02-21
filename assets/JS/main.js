/*
=====================================
    COMPONENTS PAINTERS
=====================================
*/

//? Login Painter

function loginPainter() {
    const noNew = document.querySelector("#container");
    if (noNew) {
        noNew.remove();
    };
    // Declaración de elementos que van a componer la estructura
    const body = document.querySelector("body");
    const container = document.createElement("div");
    const contentLogin = document.createElement("div");
    const loginHeader = document.createElement("h1");
    const loginIntro = document.createElement("p");
    const loginForm = document.createElement("form");
    const registerSpace = document.createElement("span");
    const userLabel = document.createElement("label");
    const userField = document.createElement("input");
    const pwLabel = document.createElement("label");
    const pwField = document.createElement("input");
    const viewPw = document.createElement("span");
    const loginBtn = document.createElement("button");
    const forgetLink = document.createElement("p");

    // Asignación de propiedades a los elementos
    container.id = "container";
    contentLogin.id = "contentLoginDiv";
    loginHeader.innerText = "Hey, Dude, welcome again to To Do Bridge";
    loginIntro.id = "loginIntro";
    loginIntro.innerText = "The list app to help you forget everything you want to forget";
    registerSpace.id = "registerSpace";
    userLabel.innerText = "Nickname *";
    userField.id = "nickname";
    userField.required = "required";
    pwLabel.innerText = "Password";
    pwField.type = "password";
    pwField.required = "required";
    pwField.id = "password";
    viewPw.id = "viewPw";
    viewPw.innerHTML = `<a href ="#">Show</a>`;
    viewPw.className = "Show";
    viewPw.preventDefault;
    viewPw.addEventListener("click", showHidePw);
    loginBtn.id = "loginBtn";
    loginBtn.innerText = "Login";
    loginBtn.preventDefault;
    loginBtn.addEventListener("click", getTasks);
    forgetLink.id = "forgetLink";
    forgetLink.innerHTML = `Don´t have an account? Register <a href="#" onclick="registerPainter()" >here</a>`;

    // Pintando formulario
    body.appendChild(container);
    container.appendChild(contentLogin);
    contentLogin.appendChild(loginHeader);
    contentLogin.appendChild(loginIntro);
    contentLogin.appendChild(loginForm);
    loginForm.appendChild(registerSpace);
    loginForm.appendChild(userLabel);
    loginForm.appendChild(userField);
    loginForm.appendChild(pwLabel);
    loginForm.appendChild(pwField);
    loginForm.appendChild(viewPw);
    loginForm.appendChild(loginBtn);
    contentLogin.appendChild(forgetLink);

    // Return para pintar
    return container;
}

function registerPainter() {
    // Declaración de elementos que hay que añadir a la estructura de login
    const registerHeader = document.querySelector("h1");
    const registerIntro = document.getElementById("loginIntro");
    const registerForm = document.querySelector("form");
    const registerSpace = document.getElementById("registerSpace");
    const usernameLabel = document.createElement("label");
    const usernameField = document.createElement("input");
    const userEmailLabel = document.createElement("label");
    const userEmailField = document.createElement("input");
    const viewPw = document.getElementById("viewPw");
    const registerBtn = document.getElementById("loginBtn");
    const alreadyRegistered = document.getElementById("forgetLink");;

    // Asignación de propiedades a los elementos
    registerHeader.innerText = "Your very first time at To Do Bridge?";
    registerIntro.innerText = "Create an account and start to forget everything you want to forget";
    registerForm.id = "createUserForm";
    usernameLabel.innerText = "Name *";
    usernameField.id = "name";
    usernameField.required = "required";
    userEmailLabel.innerText = "Email *";
    userEmailField.id = "email";
    userEmailField.required = "required";
    viewPw.innerHTML = `<a href ="#">Show</a>`;
    viewPw.className = "Show";
    viewPw.addEventListener("click", showHidePw);
    registerBtn.innerText = "Register";
    registerBtn.removeEventListener("click", loginApp);
    registerBtn.addEventListener("click", createUser);
    alreadyRegistered.innerHTML = `Already have an account? Login <a href="#" onclick="loginPainter()" >here</a>`;

    // Pintando cambios en formulario
    registerSpace.appendChild(usernameLabel);
    registerSpace.appendChild(usernameField);
    registerSpace.appendChild(userEmailLabel);
    registerSpace.appendChild(userEmailField);

    // Return para pintar
    return registerHeader;
}

//? Mostrar / ocultar contraseña

function showHidePw(e) {
    const pwField = document.getElementById('password');
    if (e.target.className === "Show") {
        e.target.className = "Hide";
        e.target.innerText = 'Hide';
        pwField.type = "text";
    } else {
        e.target.className = "Show";
        e.target.innerText = "Show";
        pwField.type = "password";
    }
}

function logRegErrors() {
    const errorContainer = document.createElement("div");
    const errorTxt = document.createElement("p");
}


/*
=====================================
  USERS
=====================================
*/

//? Login

function loginApp() {

}

//? Register

function registerApp() {
    console.log("Ok, registered!");
}

//? Create users

async function createUser() {
    const form = document.getElementById("createUserForm");
    var obj = {};
    for (var i = 0; i < form.elements.length; i++) {
        var item = form.elements.item(i);
        obj[item.id] = item.value;
    }
    const response = await fetch("http://localhost:8080/user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
}


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
    const noNew = document.querySelector("#container");
    if (noNew) {
        noNew.remove();
    };
    const body = document.querySelector("body");
    const container = document.createElement("div");
    const contentGrid = document.createElement("div");
    const headerTasks = document.createElement("header");
    const titleTasks = document.createElement("h1");

    container.id = "container";
    headerTasks.id = "headerTasks";
    titleTasks.id = "tituloTareas";
    contentGrid.id = "viewerGrid";

    titleTasks.innerText = "Tareas";

    body.appendChild(container);
    container.appendChild(headerTasks);
    headerTasks.appendChild(titleTasks);
    container.appendChild(contentGrid);

    const listElements = tareas.map((task) => {
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
        const response = await fetch("http://localhost:8080/task");
        const data = await response.json()
        return data;
    } catch (error) {
        throw "Datos no encontrados"
    }
};


function getData() {
    getTasks().then(data => {
        const tasks = data.msg;
        printTaskData(tasks);
    })
};