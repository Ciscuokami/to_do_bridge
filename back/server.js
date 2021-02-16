// Configurando servidor
const express = require("express");

// Settings
const server = express();
const port = 8080;
const cors = require('cors')
const bodyParser = require('body-parser');
server.use(cors());
server.options('*', cors());
server.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000, type: 'application/x-www-form-urlencoded' }));

// Config DB
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://todobridge-1ae8b-default-rtdb.europe-west1.firebasedatabase.app/"
        //databaseURL: "https://todobridgeok-default-rtdb.europe-west1.firebasedatabase.app/"
});

const db = firebase.database();

const ref = db.ref("/");
const usersRef = db.ref("/users");
const tasksRef = db.ref("/tasks");

/*
==========================
    USERS
==========================
*/

//? Endpoint Create User

server.post("/user", (req, res) => {
    const { nickname, name, email, password } = req.body;
    usersRef.child(nickname).once("value", snapshot => {
        if (snapshot.val() === null) {
            usersRef.child(nickname).set({
                name,
                email,
                password
            }, (error) => {
                if (error) {
                    res.send({ msg: `No ha sido posible crear el usuario ${nickname}` });
                } else {
                    res.send({ msg: `Se ha creado el usuario ${nickname}` });
                }
            });
        } else {
            res.send({ "error": `El usuario ${nickname} ya existe` });
        }
    });
});

// ? Modify user (put)

server.put("/user/:nickname", (req, res) => {
    let { name, email, password } = req.body;
    let { nickname } = req.params;
    if (!name && !email && !password)
        res.send({ "msg": "You must provide any of the user data" });
    else {
        usersRef.child(nickname).once("value", snapshot => {
            if (snapshot.val() === null)
                res.send({ "error": "Invalid userId" })
            else {
                const newData = {};
                if (name)
                    newData.name = name;
                if (email)
                    newData.email = email;
                if (password)
                    newData.password = password;
                usersRef.child(nickname).update(newData);
                res.send({ "msg": "Se ha actualizado correctamente" });

            }
        });
    }
});

// ? Delete user

server.delete("/user/:id", (req, res) => {
    const { id } = req.params;
    usersRef.child(id).remove();
    res.send({ "msg": `User ${id} deleted` });
});


/*
==========================
    TASKS
==========================
*/

//? List Tasks
server.get("/task", (req, res) => {
    tasksRef.once("value", snapshot => {
        const snapshotVal = snapshot.val()
        if (snapshotVal == null) {
            res.send({ "error": "no hay tareas" })
        } else {
            res.send({ "msg": snapshotVal });
        }
    });
});


//? Create Task
server.post("/task", (req, res) => {
    const { description, lastDate, priority, status, title } = req.body;
    console.log(req.body);
    if (!title) {
        res.status(400).json({ "error": "You must provide a title" });
    } else {
        tasksRef.push({
            description,
            lastDate,
            priority,
            status,
            title
        }, (error) => {
            if (error) {
                res.json({ msg: `The task ${title} can´t be created` });
            } else {
                res.json({ msg: `The task ${title} has been created ` });
            }
        });
    }
});


//? Delete Task

server.delete("/task/:id", (req, res) => {
    const { id } = req.params;
    tasksRef.child(id).remove();
    res.send({ "msg": `Task ${id} deleted` });
});

//? Modify Task
server.put("/task/:id", (req, res) => {
    let { title, description, lastDate, priority, status } = req.body;
    let { id } = req.params;
    if (!title && !description && !lastDate && !priority && !status) {
        res.send({ "msg": "You must provide any of the task data" });
    } else {
        if (title)
            newData.title = title;
        if (description)
            newData.description = description;
        if (lastDate)
            newData.lastDate = lastDate;
        if (priority)
            newData.priority = priority;
        if (status)
            newData.status = status;
        tasksRef.child(id).update(newData);
        res.send({ "msg": "the task has been successfully updated" });
    }
});

//? Modify Task Status
server.put("/task/:id", (req, res) => {
    let { status } = req.body;
    let { id } = req.params;
    tasksRef.child(id).once("value", snapshot => {
        if (snapshot.val() === null)
            res.send({ "error": "Invalid taskId" })
        else {
            const newData = {};
            if (status)
                newData.status = status;
            tasksRef.child(id).update(newData);
            res.send({ "msg": "Se ha actualizado correctamente" });
        }
    });
});


/*
==========================
    LISTEN PORT
==========================
*/

server.listen(port, () => {
    console.log(`listening on url: http://localhost:${port}`);
})