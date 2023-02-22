"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var AuthController_1 = require("./controllers/AuthController");
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
var app = (0, express_1.default)();
var port = process.env.BACKEND_PORT;
require("./lib/passport");
app.use(body_parser_1.default.json());
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.post.apply(app, __spreadArray(["/api/auth/register"], AuthController_1.register, false));
app.post.apply(app, __spreadArray(["/api/auth/login"], AuthController_1.login, false));
app.post.apply(app, __spreadArray(["/api/auth/protected"], AuthController_1.protectedRoute, false));
app.listen(port, function () {
    return console.log("Express is listening at http://localhost:".concat(port));
});
//# sourceMappingURL=server.js.map