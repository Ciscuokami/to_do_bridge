// Configurando servidor
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const jwt = require("jwt-simple");

// Settings
const PORT = 8080;
const SECRET = "f2ac41f4dd36b5063ac14edc64c91d1728d7acde6b69acbc32566b2883247c64";
const server = express();
const users = {};

// Middlewares

server.use(express.json());
server.use(cors());
server.use(cookieParser());

server.use((req, res, next))


//? Hashing Pw
function hashString(string, secret = SECRET) {
    const hashedString = crypto.createHmac("sha256", secret).update(string).digest("hex");
    return hashedString;
};

function saltPepperPw(password, salt = crypto.randomBytes(16).toString("hex")) {
    let hash = hashString(hashString(password), salt);
    return { password: hash, salt };
};


//? Crear usuario

server.post("/user", (req, res) => {
    const { username, password } = req.body;
    const passwordPattern = /^[A-Z][a-zA-Z0-9]/;
    if (username && password) {
        if (passwordPattern.test(password)) {
            res.send({ msg: "User created" });
            users[username] = {
                username,
                password: saltPepperPw(password)
            }
            console.log(users);
        } else {
            res.send({ "error": "The password must contain numbers, upper and lower case letters." });
        }
    } else {
        res.send({ "error": "A username and a password must be provided" });
    }
});

server.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const user = users[username];
        if (user) {
            if (verifyPw(password, user.password)) {
                res.cookie("jwt", jwt.encode({
                    "iat": new Date(),
                    "sub": username
                }, SECRET));
                res.send({ "msg": "You have loggedin" });
            } else {
                res.send({ "error": "The user or the password is not ok" });
            }
        } else {
            res.send({ "error": "No such user registered" });
        }
    } else {
        res.send({ "error": "A username and a password must be provided" });
    }
})

function verifyPw(password, originalPassword) {
    const hashedPw = saltPepperPw(password, originalPassword.salt);
    return hashedPw.password === originalPassword.password;

}


/*
==========================
    LISTEN PORT
==========================
*/

server.listen(PORT, () => {
    console.log(`listening on url: http://localhost:${PORT}`);
})