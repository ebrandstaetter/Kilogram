const DATAPATH = __dirname + '/../data/posts.json';

import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';

const app = express();
const port = 3000;

// Configure multer to use disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop(); 
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`); 
  }
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname + '/../public'));
app.use(express.json());

app.listen(port, () => {
    console.log("\n");
    console.log('*********** Server started **********');
    console.log(`Available at http://localhost:${port}`);
    console.log(`*************************************`);
});

// Handle form submission
app.post("/addPost", upload.single('img'), function (req: Request, res: Response) {
    console.log(req.body); 
    console.log(req.file); 

    fs.readFile(DATAPATH, 'utf-8', (err, data) => {
        if (err) throw err;
        let json = JSON.parse(data);

        let newPost = {
            id: json.posts.length+1,
            title: req.body.title,
            date: new Date().toISOString().slice(0,10),
            imgLink: req.file ? req.file.filename : '',  
            ingredients: req.body.ingredients.split(","),
            tags: req.body.tags.split(","),
            description: req.body.description,
            preparation: req.body.preparation
        };

        json.posts.push(newPost);

        fs.writeFile(DATAPATH, JSON.stringify(json, null, 2), 'utf-8', (err) => {
            if (err) throw err;
            console.log('New post added');
            res.redirect('/index.html');
        });
    });
});



app.get("/getAllPosts",(req,res) =>{
    fs.readFile(DATAPATH, 'utf-8', (err,data)=>{
        if(err) throw err;
        res.send(data);
    })
})

app.get("/getPost/:id",(req,res) =>{
    let id = parseInt(req.params.id);
    fs.readFile(DATAPATH, 'utf-8', (err,data)=>{
        if(err) throw err;
        let json = JSON.parse(data);
        let post = json.posts[id - 1];
        res.send(post);
    })
})

