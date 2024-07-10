const express = require('express')
const app = express()
const port = 8080

//define Variable
var id = 65140322
var status = "single"

//Add Variable
var user_list = [
    {name: "pugun", address: "trang", birth_year: 2001},
    {name: "siean", address: "ranong", birth_year: 2002},
    {name: "kin", address: "nakorn", birth_year: 2004}
];

//Add Feature Bar Variable
var feature = [
    {
        img : "images/Programming.jpg",
        top : "Programming",
        buttom : "Enjoy Coding & playing HTML, Css, Javascript"
    },
    {
        img : "images/AIoT.jpg",
        top : "AIOT & ROBOTICS",
        buttom : "Enjoy Coding & Playing Python, Ros,MechanicsLEARN MORE"
    }
]

//Add Content Font Variable
var contentfont1 = "Online Creative Community"
var contentfont2 = "By Pugun Dev"

//Set & Call EJS
app.set('view engine','ejs')

//Connect public folder
app.use(express.static('public'))

//creating App --> Pointer(=>{object}) backend display
app.get("/hello",(req,res)=>{
    res.send("Hello NodeJS")
})
//frontend EJS show html display
app.get("/",(req,res)=>{
    res.render('index',{userid : id, status : status, object_user_list : user_list})
})

//Connect index2.ejs
app.get("/index2",(req,res) =>{
    res.render('index2',{contentfont1 : contentfont1, contentfont2 : contentfont2, obj_feature : feature})
})

//Open Server
app.listen(port,() => {
    console.log("Server is Listening on port",port)
})