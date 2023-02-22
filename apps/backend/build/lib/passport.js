"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var passport_jwt_1 = require("passport-jwt");
var bcrypt_1 = __importDefault(require("bcrypt"));
var db_1 = require("./db");
passport_1.default.use("signup", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, function (email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, error_1;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                _b = (_a = db_1.prisma.user).create;
                _c = {};
                _d = {
                    email: email
                };
                return [4, bcrypt_1.default.hash(password, 10)];
            case 1: return [4, _b.apply(_a, [(_c.data = (_d.password = _e.sent(),
                        _d),
                        _c)])];
            case 2:
                user = _e.sent();
                return [2, done(null, user)];
            case 3:
                error_1 = _e.sent();
                done(error_1);
                return [3, 4];
            case 4: return [2];
        }
    });
}); }));
passport_1.default.use("login", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, function (email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, validate, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, db_1.prisma.user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2, done(null, false, { message: "User not found" })];
                }
                return [4, bcrypt_1.default.compare(password, user.password)];
            case 2:
                validate = _a.sent();
                if (!validate) {
                    return [2, done(null, false, { message: "Wrong Password" })];
                }
                return [2, done(null, user, { message: "Logged in Successfully" })];
            case 3:
                error_2 = _a.sent();
                return [2, done(error_2)];
            case 4: return [2];
        }
    });
}); }));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, function (token, done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2, done(null, token.user)];
        }
        catch (error) {
            done(error);
        }
        return [2];
    });
}); }));
//# sourceMappingURL=passport.js.map