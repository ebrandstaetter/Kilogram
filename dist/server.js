"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DATAPATH = __dirname + '/../data/posts.json';
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.post("addPost", (req, res) => {
    let newPost = req.body;
    console.log(newPost);
    fs_1.default.readFile(DATAPATH, 'utf-8', (err, data) => {
        if (err)
            throw err;
        let json = JSON.parse(data);
        json.posts.push(newPost);
        fs_1.default.writeFile(DATAPATH, JSON.stringify(json, null, 2), 'utf-8', (err) => {
            if (err)
                throw err;
            console.log('new Post added');
            res.send({ 'success': true });
        });
    });
});
app.get("getAllPosts", (req, res) => {
    fs_1.default.readFile(DATAPATH, 'utf-8', (err, data) => {
        if (err)
            throw err;
        return data;
    });
});
