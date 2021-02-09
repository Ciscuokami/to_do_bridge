// Configurando servidor
const express = require("express");

// Settings
const server = express();
const port = 8080;

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

//Vamos a hacer una consultilla
usersRef.once("value", (snapshot) => {
    console.log(snapshot.val());
})


/* Consultamos tareas por usuario
tasksRef.orderByChild("owner").equalTo("matimandelman").once("value", snapshot => {
    const snapshotVal = snapshot.val();
    if (snapshotVal == null) {
        console.log("No se ha encontrado nada");
    } else {
        console.log(snapshotVal);
    }
});


usersRef.child("miguelez").set({
    name: "Miguel",
    email: "miguelez@gmail.com",
    password: "ilovegit"
});
*/