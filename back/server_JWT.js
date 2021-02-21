// Configurando servidor
const express = require("express");
const base64 = require("base-64");
const crypto = require("crypto");

// Settings
const server = express();
const PORT = 8080;
//const SECRET = crypto.randomBytes(32).toString("hex");
const SECRET = "f2ac41f4dd36b5063ac14edc64c91d1728d7acde6b69acbc32566b2883247c64";

// Hashing SHA256
function hashString(string) {
    const hashedString = crypto.createHmac("sha256", SECRET).update(string).digest("base64");
    return hashedString;
};

// Base 64 URL functions
function parsebase64ToURL(base64String) {
    const parsedString = base64String.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_").toString("base64");
    return parsedString;
}

function encodeBase64(string) {
    const encodedString = base64.encode(string);
    const base64String = parsebase64ToURL(encodedString);
    return base64String;
};

function decodeBase64(base64String) {
    const decodedString = base64.decode(base64String);
    return decodedString;
};

// JWT functions

function generateJWT(payload) {
    const Header = {
        "alg": "HS256",
        "typ": "JWT"
    };
    const encodedheader = encodeBase64(JSON.stringify(Header));
    const encodedPayload = encodeBase64(JSON.stringify(payload));
    const signature = encodeBase64(hashString(`${encodedheader}.${encodedPayload}`));
    JWT = `${encodedheader}.${encodedPayload}.${signature}`;
    return JWT;
};

function verifyJWT(jwt) {
    const [Header, Payload, Signature] = jwt.split(".");
    const expectedSignature = encodeBase64(hashString(`${Header}.${Payload}`));
    if (Signature === expectedSignature)
        return JSON.parse(decodeBase64(Payload));
    return null;
};

server.get("/", (req, res) => {
    const JWT = generateJWT({
        username: "Miguel"
    });
    console.log(verifyJWT(JWT));
    res.send({ JWT })
});

/*
====
Aqui va el BU
===
*/
/*
==========================
    LISTEN PORT
==========================
*/

server.listen(PORT, () => {
    console.log(`listening on url: http://localhost:${PORT}`);
})