const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const { log } = require('console');

app.set('view engine', 'ejs'); // setting ejs as view engine , backend renders ejs pages

//making parsers for forms
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname, 'public')));//all static files(img, vid, scripts) are in public folder 

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index", {files: files});
  });
})
//for reading file
//reading file in app
app.get("/file/:filename", (req, res)=> {
  //readfile utf-8 to read file in english otherwise it reads in 
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata)=>{
    if (err) console.log(err);
    res.render("showfile", {fileName: req.params.filename, fileData: filedata});
  });
})

app.get("/edit/:filename", (req, res) => {
  res.render('rename', {fileName: req.params.filename});
});

app.post("/edit", (req, res) => {
  const previousFileName = req.body.PrevFileName.trim();
  const newFileName = req.body.NewFileName.trim();
  //feeding req.body.PrevFileName yields to an error as extra space is there at trailing part 
  fs.rename(`./files/${previousFileName}`, `./files/${newFileName}`, (err) => {
    console.log(err); 
    res.redirect("/");
  })
})

//dynamic routing
/*
profile/harsh
profile/amit
//use colons  to make dynamic routing
"profile/:name" name -> variable(dynamic part)
*/

app.post("/create", (req, res) => {
  //req.params is an object that contains all the dynamic parts of the url
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
})


app.listen(3000, ()=>{
  console.log("Server is running on port 3000");
});
