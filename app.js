const U2F        = require("u2f");
const Express    = require("express");
const BodyParser = require("body-parser");
const Cors       = require("cors");
const HTTPS      = require("https");
const FS         = require("fs");
const path       = require("path")
const session    = require("express-session");
const config     = require("./config.json");

const APP_ID = config.appID;

const app  = Express();
const port = config.port;

app.use(session({ secret: config.cookeyKey, cookie: { secure: true, maxAge: 60000 }, saveUninitialized: true, resave: true }));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(Cors({ origin: [APP_ID], credentials: true }));

var users = {}

app.use(Express.static(path.join(__dirname, 'public'))); //Serves resources from public folder


app.post("/register/init", (request, response, next) => {
    if (!request.body.username) {
        return response
        .status(500)
        .json({
            status: "failed",
            error:  "Missing username"
        });
    }

    console.log(request.session.u2fchallenge);
    console.log(request.body.username);

    request.session.u2fchallenge = U2F.request(APP_ID);
    request.session.username     = request.body.username

    return response.json({
        status: "ok",
        challenge: request.session.u2fchallenge
    });
})

app.post("/register/response", (request, response, next) => {
    if (!request.body.registerResponse) {
        return response
        .status(500)
        .json({
            status: "failed",
            error:  "Missing registerResponse"
        });
    }

    console.log("request.session.u2fchallenge", request.session.u2fchallenge);
    console.log("request.body.registerResponse", request.body.registerResponse);

    var registration = U2F.checkRegistration(request.session.u2f, request.body.registerResponse);

    console.log("registration", registration);

    if (!registration.successful) {
        return response
        .status(500)
        .json({
            status: "failed",
            error:  "Failed to verify register response!"
        });
    }

    users[request.session.username] = registration;

    return response.json({
        status: "ok",
    });
})

app.post("/sign/init", (request, response, next) => {
    if (!request.body.username) {
        return response
        .status(500)
        .json({
            status: "failed",
            error:  "Missing username"
        });
    }

    request.session.u2fchallenge = U2F.request(APP_ID, users[request.body.username].keyHandle);
    request.session.username     = request.body.username

    return response.json({
        status: "ok",
        challenge: request.session.u2fchallenge
    });
})

app.post("/sign/response", (request, response, next) => {
    var success = U2F.checkSignature(request.session.u2fchallenge, request.body.loginResponse, users[request.session.username].publicKey);

    return response.json({
        status: "ok"
    });
})


app.listen(port);
console.log(`Started app on port ${port}`);

module.exports = app;