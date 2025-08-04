"use strict";
// connect to a MONGODB STRING
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usermodel = exports.blogmodel = exports.db = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const db = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_2.default.connect(`${process.env.MONGO_DB_URL}`);
        console.log("database is connected successfully!");
    }
    catch (err) {
        console.log(err);
    }
});
exports.db = db;
const userschema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    publishedDate: {
        type: Date,
        default: Date.now,
    },
    // The new tags field is added here as an array of strings
    tags: {
        type: [String],
        default: [],
    },
});
exports.blogmodel = mongoose_2.default.model("blogs", blogSchema);
exports.usermodel = mongoose_2.default.model("users", userschema);
