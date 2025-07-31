"use strict";
//console.log("hello world");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
don't use nodemon for production, use it for testing puropose,dev
for prod , no nodemon,
*/
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./route/user"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config(); // let' the .env files be fetched
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json({
        "message": "your api is runnig bruv! LOL <$>"
    });
});
// connecting to the DB and schema/model defining
(0, db_1.db)();
app.use("/api/v1", user_1.default);
app.listen(3000, () => {
    console.log("greetings we are listening to u, at port 3000");
});
