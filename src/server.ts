const DATAPATH = __dirname + '/../data/posts.json';

import fs from 'fs';
import express from 'express';
const app = express();
const port = 3000;

app.post("addPost", (req,res)=>{
    let newPost = req.body;
    console.log(newPost);

    fs.readFile(DATAPATH, 'utf-8', (err,data )=>{
        if (err) throw err;
        let json = JSON.parse(data);

        json.posts.push(newPost);

        fs.writeFile(DATAPATH, JSON.stringify(json,null,2), 'utf-8', (err)=>{
            if (err) throw err;
            console.log('new Post added');
            res.send({'success':true})
        })
    })
})

app.get("getAllPosts",(req,res) =>{
    fs.readFile(DATAPATH, 'utf-8', (err,data)=>{
        if(err) throw err;
        return data;
    })
})