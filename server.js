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

//? Endpoint Create User
server.post("/createUser", (req, res) => {
    const { nickname, name, email, password } = req.body;
    if (usersRef.child(nickname)) {
        res.send({ "error": `El usuario ${nickname} ya existe` });
    } else {
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
    };
})

server.listen(port, () => {
    console.log(`listening on url: http://localhost:${port}`);
})