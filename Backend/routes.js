var Router = require("express").Router;
var userDetails = require("./db.js");
var authRouter = new Router();
var bodyParser = require('body-parser');

authRouter.use(bodyParser.json());
authRouter.use(bodyParser.urlencoded({extended:true}));

// Route for Registering user
authRouter.post('/register', (req,res) => {
    var body = req.body;
    console.log(body);

    userDetails.create(body, (err,data) => {
        if(err){
            res.status(500).json({message:err})
        }else{
            res.send({message:"Registered Successfully"})
        }
    })

});

// Route for logging IN
authRouter.post('/login', async (req,res) => {
    var name = req.body.name;
    var password = req.body.password;
    var userType = req.body.userType;
    var address = req.body.address;

    try {
        var user = await  userDetails.find({name:name,address:address,password:password});
        // console.log('user; ', user)
        if (user.length) {
            if(user[0].name == name && user[0].password == password && user[0].address == address){
                if(userType == "moderator"){
                    res.send({message: 'userFound',userType:"moderator"})
                }else if(userType == "voter") {
                    res.send({message: 'userFound',userType:"voter"})
                }
            }           
             // res.send(user);
        } else {
            
            res.send({message: 'User not found'})
        }
    } catch (err) {
        console.log(err);
        res.send({ message: err});
    }
})






module.exports = authRouter;