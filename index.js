const express=require("express");
const jwt=require("jsonwebtoken");
const cors = require("cors"); 
const app=express();
app.use(express.json());
app.use(cors());

let JWT_SECRET="badjbfurntvajkjbeal";
let users=[];
app.post("/signup",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    users.push({username:username,password:password});
    res.json({msg:"signup succesful"});

})
app.post("/signin",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    let founduser=null;
    for(let i=0;i<users.length;i++)
    {
        if(username==users[i].username && password ==users[i].password){founduser=users[i];}
    }
    if(!founduser)
    {
        return res.json({msg:"invalid Credentials"})
    }
    else{
        const token=jwt.sign({username:username},JWT_SECRET);
        res.json({token :token ,msg:"sign in succesful jwt generated"})
    }

})

function middleware(req,res,next)
{
    let token=req.headers.token;
    let decodedinforrmation=jwt.verify(token,JWT_SECRET);

    if(decodedinforrmation.username){
        req.username=decodedinforrmation.username;
        next();
    }//if token is invalid it crashes or err}
    else
    {
        res.json({msg:"you are not logged in "})
    }
    
}
app.get("/me",middleware,function(req,res){
    let founduser=null;
    for(let i=0;i<users.length;i++)
    {
        if(req.username==users[i].username)founduser=users[i];
    }
    res.json({
        username:founduser.username,password:founduser.password
    })
})
app.listen(3001);