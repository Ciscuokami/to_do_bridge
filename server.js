// Configurando servidor
const express = require("express");

// Settings
const server = express();
const port = 8080;

server.use(express.json());

// Config DB
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://todobridgeok-default-rtdb.europe-west1.firebasedatabase.app/"
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

//? Create Task


//? Delete Task


//? Modify Task

server.listen(port, () => {
    console.log(`listening on url: http://localhost:${port}`);
})