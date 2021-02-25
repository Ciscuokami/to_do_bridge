/*
=====================================
    COMPONENTS PAINTERS
=====================================
*/

const body = document.querySelector("body");

//? Login Painter

function loginPainter() {
    const noNew = document.querySelector("#container");
    if (noNew) {
        noNew.remove();
    };
    // Declaración de elementos que van a componer la estructura
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
    const googleLoginBtn = document.createElement("button")
    const createAccount = document.createElement("p");
;

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
    loginBtn.addEventListener("click", loginApp);
    googleLoginBtn.id = "googleLoginBtn";
    googleLoginBtn.innerText = "Login con Google";
    googleLoginBtn.preventDefault;
    googleLoginBtn.addEventListener("click", googleLogin);
    createAccount.id = "createAccount";
    createAccount.innerHTML = `Don´t have an account? Register <a href="#" onclick="registerPainter()" >here</a>`;

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
    loginForm.appendChild(googleLoginBtn);
    contentLogin.appendChild(createAccount);

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
    const alreadyRegistered = document.getElementById("createAccount");;

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

function googleLogin() {
    fetch("https://localhost:8080/googleOauth", {
        credentials: "include"
    }).then(response => response.json()).then(data => {
        const {url} = data;
        console.log(url);
        localStorage.setItem("loginGoogle", true);
        window.location.href = url;
    });
}

if (localStorage.getItem("loginGoogle") === "true"){
    fetch(`https://localhost:8080/googleOauthCallback${window.location.search}`, {credentials: "include"}).then(res => res.json()).then(data => console.log(data));
    localStorage.clear("loginGoogle");
}

function loginApp() {
    const userNick = document.getElementById("nickname");
    const userPw = document.getElementById("password");
    fetch("https://localhost:8080/login", {
        method: "POST",
        body: JSON.stringify({
            "nickname": userNick.value,
            "password": userPw.value
        }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(getData).catch(e => console.error(e))
}

//? Register

function registerApp() {
    console.log("Ok, registered!");
}

//? Create users

async function createUser() {
    const userNick = document.getElementById("nickname");
    const userPw = document.getElementById("password");
    const userName = document.getElementById("name");
    const userEmail = document.getElementById("email");
    const response = await fetch("https://localhost:8080/user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
            "nickname": userNick.value,
            "password": userPw.value,
            "name": userName.value,
            "email": userEmail.value
        })
    });
};


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
    await fetch("https://localhost:8080/task", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(obj)
    })
}


//? Modificar Tarea

function modifyTask() {
    contentArea.remove();

    console.log("vamos a modificar la tarea:")
}

//? Pop Up Create Task

function popUpCreaTask() {
    const popUpWrapper = document.createElement("div");
    const popUp = document.createElement("div");
    const popUpClose = document.createElement("div");
    const popUpContent = document.createElement("div");
    const popUpTitle = document.createElement("h3");
    const popUpForm = document.createElement("form");
    const popUpLabelTitle = document.createElement("label");
    const popUpInputTitle = document.createElement("input");
    const popUpInputCheck = document.createElement("input");
    const popUpLabelDate = document.createElement("label");
    const popUpInputDate = document.createElement("input");
    const popUpLabelPriority = document.createElement("label");
    const popUpSelectPriotiry = document.createElement("select");

    const popUpLabelDescription = document.createElement("label");
    const popUpTextArea = document.createElement("textarea");
    const popUpBtnCrea = document.createElement("button");
    const popUpBtnEdit = document.createElement("button");
    const popUpBtnDelete = document.createElement("button");

    popUpWrapper.className = "popup-wrapper";
    popUp.className = "popup";
    popUpClose.className = "popup-close";
    popUpContent.className = "popup-content";
    popUpForm.id = "createTask";

    popUpClose.innerText = "x";
    popUpTitle.innerText = "Create a new Task";
    popUpLabelTitle.innerText = "Título";
    popUpLabelDate.innerText = "Fecha Límite";
    popUpLabelPriority.innerText = "Prioridad";
    popUpLabelDescription.innerText = "Descripción";
    popUpBtnCrea.innerText = "Crear tarea";
    popUpBtnEdit.innerText = "Editar tarea";
    popUpBtnDelete.innerText = "Eliminar tarea";

    popUpBtnCrea.addEventListener("click", createTask);
    popUpBtnEdit.addEventListener("click", modifyTask);
    // popUpBtnDelete.addEventListener("click", deleteTask);

    popUpContent.appendChild(popUpTitle);
    popUpContent.appendChild(popUpForm);
    popUpForm.appendChild(popUpLabelTitle);
    popUpForm.appendChild(popUpInputTitle);
    popUpForm.appendChild(popUpInputCheck);
    popUpForm.appendChild(popUpLabelDate);
    popUpForm.appendChild(popUpInputDate);
    popUpForm.appendChild(popUpLabelPriority);
    popUpForm.appendChild(popUpSelectPriotiry);
    popUpForm.appendChild(popUpLabelDescription);
    popUpForm.appendChild(popUpTextArea);
    popUpForm.appendChild(popUpBtnCrea);
    popUpForm.appendChild(popUpBtnEdit);
    popUpForm.appendChild(popUpBtnDelete);
    popUp.appendChild(popUpContent);
    popUp.appendChild(popUpClose);
    popUpWrapper.appendChild(popUp);
    body.appendChild(popUpWrapper);

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

    const title = document.createElement("h2");
    const createTaskBtn = document.createElement("button");
    const searchTask = document.createElement("div");
    const labelInput = document.createElement("label");
    const inputName = document.createElement("input");
    const searchBtn = document.createElement("button");
    const searchOnGoing = document.createElement("button");
    const searchGoingLate = document.createElement("button");
    const searchDone = document.createElement("button");
    const container = document.createElement("div");
    const contentGrid = document.createElement("div");
    const headerTasks = document.createElement("header");
    const titleTasks = document.createElement("h1");

    container.id = "container";
    headerTasks.id = "headerTasks";
    titleTasks.id = "tituloTareas";
    contentGrid.id = "viewerGrid";

    title.innerText = "Lista de Tareas";
    title.className = "title";
    searchTask.id = "searchBox";
    labelInput.innerText = "Buscador de Tareas";
    inputName.placeholder = "Indica un nombre"
    searchBtn.innerText = "Buscar";
    searchOnGoing.innerText = "On Going";
    searchGoingLate.innerText = "Going Late";
    searchDone.innerText = "Done";
    searchBtn.id = "search";
    searchOnGoing.id = "onGoing";
    searchGoingLate.id = "goingLate";
    searchDone.id = "done";
    createTaskBtn.innerText = "+";
    createTaskBtn.id = "createTaskBtn"
    searchBtn.preventDefault;
    createTaskBtn.preventDefault;
    titleTasks.innerText = "Tareas";

    body.appendChild(container);
    container.appendChild(headerTasks);
    headerTasks.appendChild(titleTasks);
    container.appendChild(contentGrid);

    searchBtn.addEventListener("click", getFilterData);
    searchOnGoing.addEventListener("click", getFilterDataOnGoing);
    searchGoingLate.addEventListener("click", getFilterDataGoingLate);
    searchDone.addEventListener("click", getFilterDataDone);
    createTaskBtn.addEventListener("click", popUpCreaTask);

    contentGrid.appendChild(title);
    contentGrid.appendChild(searchTask);
    searchTask.appendChild(labelInput);
    searchTask.appendChild(inputName);
    searchTask.appendChild(searchBtn);
    searchTask.appendChild(searchOnGoing);
    searchTask.appendChild(searchGoingLate);
    searchTask.appendChild(searchDone);
    titleTasks.appendChild(createTaskBtn);


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
        const response = await fetch("https://localhost:8080/task", {credentials: "include"});
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

//? Filtrar Tasks

function filterTask(a) {
    const task = document.querySelector("input");
    const taskValue = task.value;
    console.log("tasks.value:", taskValue)
    const tasks = Object.entries(a).map(([key, value]) => {
        return { id: key, ...value }
    }).filter((task) => task.description?.toLowerCase().includes(taskValue.toLowerCase())  || task.title?.toLowerCase().includes(taskValue.toLowerCase()));

    console.log("tasks:", tasks);

    printTaskData(tasks);
    const cleanerBtn = document.querySelector("#clean");
    if (!cleanerBtn) {

        const cleanBtn = document.createElement("button");
        cleanBtn.id = "clean";
        cleanBtn.innerText = "Limpiar búsqueda";
        cleanBtn.preventDefault;
        cleanBtn.addEventListener("click", getData);
        container.appendChild(cleanBtn);
    }

}


//? Filtrar Tasks On Going

function filterOnGoing(a) {

    const tasks = Object.entries(a).map(([key, value]) => {
        return { id: key, ...value }
    }).filter((task) => task.status === ("on going"));

    printTaskData(tasks);
    const cleanerBtn = document.querySelector("#clean");
    if (!cleanerBtn) {

        const cleanBtn = document.createElement("button");
        cleanBtn.id = "clean";
        cleanBtn.innerText = "Limpiar búsqueda";
        cleanBtn.preventDefault;
        cleanBtn.addEventListener("click", getData);
        container.appendChild(cleanBtn);
    }
}

//? Filtrar Tasks Going Late

function filterGoingLate(a) {

    const tasks = Object.entries(a).map(([key, value]) => {
        return { id: key, ...value }
    }).filter((task) => task.status === ("going late"));

    printTaskData(tasks);
    const cleanerBtn = document.querySelector("#clean");
    if (!cleanerBtn) {

        const cleanBtn = document.createElement("button");
        cleanBtn.id = "clean";
        cleanBtn.innerText = "Limpiar búsqueda";
        cleanBtn.preventDefault;
        cleanBtn.addEventListener("click", getData);
        container.appendChild(cleanBtn);
    }
}

//? Filtrar Tasks On Done

function filterDone(a) {

    const tasks = Object.entries(a).map(([key, value]) => {
        return { id: key, ...value }
    }).filter((task) => task.status === ("done"));

    printTaskData(tasks);
    const cleanerBtn = document.querySelector("#clean");
    if (!cleanerBtn) {
        const cleanBtn = document.createElement("button");
        cleanBtn.id = "clean";
        cleanBtn.innerText = "Limpiar búsqueda";
        cleanBtn.preventDefault;
        cleanBtn.addEventListener("click", getData);
        container.appendChild(cleanBtn);
    }
}

//? Trae los datos para filtrar

async function getFilterTasks() {
    try {
        const response = await fetch("https://localhost:8080/task",{credentials: "include"});
        const data = await response.json()
        return data;
    } catch (error) {
        throw "Datos no encontrados"
    }
};


function getFilterData() {
    getFilterTasks().then(data => {
        const filterTasks = data.msg;
        filterTask(filterTasks);
    })
};

function getFilterDataOnGoing() {
    getFilterTasks().then(data => {
        const filterTasks = data.msg;
        filterOnGoing(filterTasks);
    })
};

function getFilterDataGoingLate() {
    getFilterTasks().then(data => {
        const filterTasks = data.msg;
        filterGoingLate(filterTasks);
    })
};

function getFilterDataDone() {
    getFilterTasks().then(data => {
        const filterTasks = data.msg;
        filterDone(filterTasks);
    })
};

// Esto es para probar el filter, luego borrar y descomentar todo

// function loginPainter(){ //aqui va el datalist.results
//     getData();
//     // getFilterData();

// }

// loginPainter();