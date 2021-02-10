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
*/

/*
==========================
    USERS
==========================
*/


// ? Modify user (put)

server.put("/user/:nickname", (req, res) => {
    let {name, email, password} = req.body;
    let {nickname} = req.params;
    if(!name && !email && !password)
        res.send({"msg": "You must provide any of the user data"});
    else {
        usersRef.child(nickname).once("value", snapshot => {
            if(snapshot.val() === null)
                res.send({"error": "Invalid userId"})
            else {
                const newData = {};
                if(name)
                    newData.name = name;
                if(email)
                    newData.email = email;
                if(password)
                    newData.password = password;
                usersRef.child(nickname).update(newData);
                res.send({"msg": "Se ha actualizado correctamente"});

            }
        })
    }
});

// usersRef.child("miguelez").update({
//     email: "miguel@batin.com"
// });


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

server.delete("/users/:id", (req, res) => {
	const {id} = req.params;
    usersRef.child(id).remove();
	res.send({"msg": `User ${id} deleted`});
    
});