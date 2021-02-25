// Configurando servidor
const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const JWT = require("jwt-simple");
const bodyParser = require('body-parser');
const {google} = require('googleapis');

// Import .env configuration
require("dotenv").config({path: __dirname + "/.env"});
const SECRET = process.env.SECRET;
const GOOGLEIDCLIENTE = process.env.GOOGLEIDCLIENTE;
const GOOGLESECRET = process.env.GOOGLESECRET;
const GOOGLEREDIRECT = process.env.GOOGLEREDIRECT;
const PORT = process.env.PORT || 8080;

// Settings Google
const oauth2Client = new google.auth.OAuth2(
    GOOGLEIDCLIENTE,
    GOOGLESECRET,
    GOOGLEREDIRECT
  );

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

// Settings
const server = express();
const httpsServer = https.createServer({
    key: fs.readFileSync(__dirname + "/cert/todobridge.key"),
    cert: fs.readFileSync(__dirname + "/cert/todobridge.cert")
}, server);
const excludedPaths = ["/user POST", "/login POST", "/googleOauth GET", "/googleOauthCallback GET"];

// Middlewares
server.use(express.json());
server.use(cors({
    credentials: true,
    origin: ["http://127.0.0.1:5500"]
}));
server.use(cookieParser());
server.use(bodyParser.json({
    limit: '50mb',
    type: 'application/json'
}));
server.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
    type: 'application/x-www-form-urlencoded'
}));


// Config DB
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const { response } = require("express");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://todobridge-1ae8b-default-rtdb.europe-west1.firebasedatabase.app/"
});

const db = firebase.database();

const ref = db.ref("/");
const usersRef = db.ref("/users");
const tasksRef = db.ref("/tasks");

/*
==========================
    AUTHENTICATON
==========================
*/

//? Hashing Pw
function hashString(string, secret = SECRET) {
    const hashedString = crypto.createHmac("sha256", secret).update(string).digest("hex");
    return hashedString;
};

function saltPepperPw(password, salt = crypto.randomBytes(16).toString("hex")) {
    let hash = hashString(hashString(password), salt);
    return {
        password: hash,
        salt
    };
};

//? Funcion que verifica el Path
function checkPath(pathname, method) {
    const endpoint = `${pathname} ${method}`;
    return excludedPaths.includes(endpoint);
}

server.use((req, res, next) => {
    if (!checkPath(req.path, req.method)) {
        const {
            jwt
        } = req.cookies;
        let payload;
        try {
            if (jwt) {
                payload = JWT.decode(jwt, SECRET);
                if (payload) {
                    req.user = payload;
                    next();
                } else {
                    throw "No valid JWT";
                }
            } else {
                throw "No payload";
            }
        } catch (e) {
            res.status(403).send({
                error: "You must be logged in"
            });
        }
    } else {
        next();
    }
});

//? Endpoint Login User

//Login con Google
server.get("/googleOauth", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.send({url});
});

//Google OAuth Callback
server.get("/googleOauthCallback", async(req,res) => {
    const {code} = req.query;
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({auth: oauth2Client, version:"v2"});
    oauth2.userinfo.get((error, result) =>{
        if(error){console.log(error)}
        else{console.log(result)}
    } )
});


server.post("/login", (req, res) => {
    const {
        nickname,
        password
    } = req.body;
    console.log(req.body);
    if (nickname && password) {
        usersRef.orderByChild("nickname").equalTo(nickname).once("value", (snapshot) => {
            if (snapshot.val()) {
                const user = Object.values(snapshot.val())[0];
                console.log(user);
                console.log(user.salt);
                if (user) {
                    if (verifyPw(password, {
                            password: user.password,
                            salt: user.salt
                        })) {
                        res.cookie("jwt", JWT.encode({
                            "iat": new Date(),
                            "sub": user
                        }, SECRET), {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none"
                        });
                        res.send({
                            "msg": "You have loggedin"
                        });
                    } else {
                        res.send({
                            "error": "The user or the password is not ok"
                        });
                    }
                } else {
                    res.send({
                        "error": "No such user registered"
                    });
                }
            }
        });
    } else {
        res.send({
            "error": "A username and a password must be provided"
        });
    }
});

function verifyPw(password, originalPassword) {
    const hashedPw = saltPepperPw(password, originalPassword.salt);
    console.log(hashedPw);
    return hashedPw.password === originalPassword.password;

}

//Check loggedIn

server.get("/user", (req, res) => {
    res.send({
        "msg": "You are logged in",
        "user": req.user
    });
});


//Logout

server.get("/logout", (req, res) => {
    res.clearCookie("jwt").send({
        "msg": "cookie deleted"
    });
})

/*
==========================
    USERS
==========================
*/

//? Endpoint Create User

server.post("/user", (req, res) => {
    let {
        nickname,
        name,
        email,
        password
    } = req.body;
    console.log(req.body);
    const passwordPattern = /[a-zA-Z0-9]/;
    usersRef.orderByChild("nickname").equalTo(nickname).once("value", snapshot => {
        if (snapshot.val() === null) {
            if (nickname && name && email && password) {
                if (passwordPattern.test(password)) {
                    password = saltPepperPw(password);
                    usersRef.push({
                            nickname,
                            name,
                            email,
                            ...password
                        },
                        (error) => {
                            if (error) {
                                res.send({
                                    msg: `The user ${nickname} cannot be created`
                                });
                            } else {
                                res.send({
                                    msg: `The user ${nickname} has been created`
                                });
                            }
                        });
                } else {
                    res.send({
                        "error": "The password must contain numbers, upper and lower case letters."
                    });
                }
            } else {
                res.send({
                    "error": "All fields are required"
                });
            }
        } else {
            res.send({
                "error": `The user ${nickname} already exists`
            });
        }
    });
});


// ? Modify user (put)

server.put("/user/:nickname", (req, res) => {
    let {
        name,
        email,
        password
    } = req.body;
    let {
        nickname
    } = req.params;
    if (!name && !email && !password)
        res.send({
            "msg": "You must provide any of the user data"
        });
    else {
        usersRef.child(nickname).once("value", snapshot => {
            if (snapshot.val() === null)
                res.send({
                    "error": "Invalid userId"
                })
            else {
                const newData = {};
                if (name)
                    newData.name = name;
                if (email)
                    newData.email = email;
                if (password)
                    newData.password = password;
                usersRef.child(nickname).update(newData);
                res.send({
                    "msg": "Se ha actualizado correctamente"
                });

            }
        });
    }
});

// ? Delete user

server.delete("/user/:id", (req, res) => {
    const {
        id
    } = req.params;
    usersRef.child(id).remove();
    res.send({
        "msg": `User ${id} deleted`
    });
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
            res.send({
                "error": "no hay tareas"
            })
        } else {
            res.send({
                "msg": snapshotVal
            });
        }
    });
});


//? Create Task
server.post("/task", (req, res) => {
    const {
        description,
        lastDate,
        priority,
        status,
        title
    } = req.body;
    console.log(req.body);
    if (!title) {
        res.status(400).json({
            "error": "You must provide a title"
        });
    } else {
        tasksRef.push({
            description,
            lastDate,
            priority,
            status,
            title
        }, (error) => {
            if (error) {
                res.json({
                    msg: `The task ${title} can´t be created`
                });
            } else {
                res.json({
                    msg: `The task ${title} has been created `
                });
            }
        });
    }
});


//? Delete Task

server.delete("/task/:id", (req, res) => {
    const {
        id
    } = req.params;
    tasksRef.child(id).remove();
    res.send({
        "msg": `Task ${id} deleted`
    });
});

//? Modify Task
server.put("/task/:id", (req, res) => {
    let {
        title,
        description,
        lastDate,
        priority,
        status
    } = req.body;
    let {
        id
    } = req.params;
    if (!title && !description && !lastDate && !priority && !status) {
        res.send({
            "msg": "You must provide any of the task data"
        });
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
        res.send({
            "msg": "the task has been successfully updated"
        });
    }
});

//? Modify Task Status
server.put("/task/:id", (req, res) => {
    let {
        status
    } = req.body;
    let {
        id
    } = req.params;
    tasksRef.child(id).once("value", snapshot => {
        if (snapshot.val() === null)
            res.send({
                "error": "Invalid taskId"
            })
        else {
            const newData = {};
            if (status)
                newData.status = status;
            tasksRef.child(id).update(newData);
            res.send({
                "msg": "Se ha actualizado correctamente"
            });
        }
    });
});

/*
==========================
    LISTEN PORT
==========================
*/

httpsServer.listen(PORT, () => {
    console.log(`listening on url: https://localhost:${PORT}`);
})