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