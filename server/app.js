const express =require('express');
const mongoose= require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken');
const methodoverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors= require('cors');
const User= require('./models/user');
const app= express();

const DB= 'mongodb+srv://e_commerce:e_commerce@cluster0.rpu4heq.mongodb.net/?retryWrites=true&w=majority'
const SECRET_KEY="THISISMYKUSHAGRAPORWALOWNHISFANTASTICSECRET"
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('connection successfull');
}).catch((err)=> console.log(err));


app.use(methodoverride('_method'));
app.use(cookieParser());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:false}));

app.use(bodyParser.json());
app.use(cors());

const authenticate= async(req, res, next)=>{
    console.log("enter authenticate");
    try{
        const token= req.cookies.jwtoken;
        console.log("token is "+token);
        const verifytoken= jwt.verify(token, SECRET_KEY);
        const rootuser= await User.findOne({_id: verifytoken._id, "tokens.token": token});
        if(!rootuser){
            throw new Error('User not found')
        }
        req.token=token;
        req.rootuser=rootuser;
        req.userID=rootuser._id;
        console.log("exit authenticate");
        next();
    }
    catch(err){
        res.status(401).send('-2');
        console.log(err);
    }
}

app.get('/', async(req,res)=>{
    res.send('Hello ecommerce');
})

app.get('/:userid/info', authenticate, async(req,res)=>{
    console.log("first step");
    const author1 = await User.findById(req.params.userid);
    console.log("second step");
    res.send(author1);
})

app.get('/logout', async(req,res)=>{

    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send('User Logout');
})

app.post('/register', async(req,res)=>{
    console.log(req.body);
    const {username, name, email, password, cpassword}  = req.body;
    if(!username || !email || !name || !password || !cpassword){
        return res.status(422).json({error:"Please fill the field properly"});
    }

    try{
    const resp= await User.findOne({username: username})
    if(resp){
        return res.status(422).json({error:"Username already exist"});
    }
    else if(password!=cpassword){
        return res.status(422).json({error: "password are not matching"});
    }
    const user= new User({username, name, email, password, cpassword});
    const userregister= await user.save();
    if(userregister){
        res.status(201).json({message:"User register successfully"});
    }
    else{
        res.status(500).json({error:"Fail to register"});
    }
}
catch(err){
    res.send("-2");
    //console.log(err)
}
});

app.post('/login', async(req,res)=>{
    console.log(`${DB}`);
    console.log('welcome to login');
    try{
        let token;
        console.log(req.body);
    const {email, password}  = req.body;
    console.log("email "+email);
    console.log("password "+password);
    if(!email || !password){
        return res.status(400).json({error:"Please fill the data"});
    }

    const resp= await User.findOne({email: email});
    console.log("resp is")
    console.log(resp);
    if(!resp){
        res.status(400).json({error: "Invalid Credentials"});
        console.log("one");
    }
    else{
        const match= await bcrypt.compare(password, resp.password);
        if(!match){
            res.status(400).json({error: "Invalid Credentials"});
            console.log("two");
        }
        else{
        token= await resp.generateAuthToken();
        console.log("token "+token);

        res.cookie("jwtoken", token,{
            expires: new Date(Date.now()+ 3600000),
            sameSite :'none',
            secure:true
        });
        const userid= resp._id
        console.log("token cookie is "+res.cookie);
        res.json({message: userid});
        authorid= userid;
    }
    }
}
catch(err){
    console.log(err);
}
});

app.put('/update/:id', async(req, res) =>{

    const ad=await User.findById(req.params.id);
    await User.findByIdAndUpdate(req.params.id, {"name":req.body.name, "email": req.body.email});
    res.send(ad);
    
});

app.listen(8000, ()=>{
    console.log(`Server running at port 8000`);
})