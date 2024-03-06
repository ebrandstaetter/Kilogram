"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DATAPATH = __dirname + '/../data/posts.json';
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.use(express_1.default.static(__dirname + '/../public'));
app.use(express_1.default.json());
app.listen(port, () => {
    console.log("\n");
    console.log('*********** Server started **********');
    console.log(`Available at http://localhost:${port}`);
    console.log(`*************************************`);
});
app.post("/addPost", upload.single('img'), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    fs_1.default.readFile(DATAPATH, 'utf-8', (err, data) => {
        if (err)
            throw err;
        let json = JSON.parse(data);
        let newPost = {
            id: json.posts.length + 1,
            title: req.body.title,
            date: new Date().toISOString().slice(0, 10),
            imgLink: req.file ? req.file.filename : '',
            ingredients: req.body.ingredients.split(","),
            tags: req.body.tags.split(","),
            description: req.body.description,
            preparation: req.body.preparation
        };
        json.posts.push(newPost);
        fs_1.default.writeFile(DATAPATH, JSON.stringify(json, null, 2), 'utf-8', (err) => {
            if (err)
                throw err;
            console.log('New post added');
            res.redirect('/index.html');
        });
    });
});
app.post("/updatePost", (req, res) => {
    let newPost = req.body;
    console.log(newPost);
    fs_1.default.readFile(DATAPATH, 'utf-8', (err, data) => {
        if (err)
            throw err;
        let json = JSON.parse(data);
        for (let i = 0; i < json.posts.length; i++) {
            if (json.posts[i].id == newPost.id) {
                newPost.id = json.posts[i].id;
                json.posts[i] = newPost;
            }
        }
        fs_1.default.writeFile(DATAPATH, JSON.stringify(json, null, 2), 'utf-8', (err) => {
            if (err)
                throw err;
            console.log('new Post added');
            res.send({ 'success': true });
        });
    });
});
app.get("/getAllPosts", (req, res) => {
    fs_1.default.readFile(DATAPATH, 'utf-8', (err, data) => {
        if (err)
            throw err;
        res.send(data);
    });
});
app.get("/getPost/:id", (req, res) => {
    let id = parseInt(req.params.id);
    fs_1.default.readFile(DATAPATH, 'utf-8', (err, data) => {
        if (err)
            throw err;
        let json = JSON.parse(data);
        let post = json.posts[id - 1];
        res.send(post);
    });
});
