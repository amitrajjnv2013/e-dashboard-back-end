const express=require('express');
const cors = require("cors");
require('./db/config');
const User =require("./db/User");
const Product= require('./db/Product');
const mongoose= require('mongoose');
const Jwt = require("jsonwebtoken");
const jwtKey='e-comm';

const app=express();

app.use(express.json());
app.use(cors());
// const MONGO_URI="mongodb+srv://amitrajjnv2013:2002@AmanKumar@atlascluster.0jupqqk.mongodb.net/e-comm?retryWrites=true&w=majority"

// app.post("/register", (req,res)=>{

// })

// const connectDB= async ()=>{
//     mongoose.connect(MONGO_URI, {
//         useCreateIndex:true,
//         useNewUrlParser:true,
//         useUnifiedTopology:true
//     }).then(()=>{
//         console.log("connection successful");
//     }).catch((e)=>{
//         console.log(e);
//     })
//     const productSchema= new mongoose.Schema({});
//     const product= mongoose.model('product',productSchema);
//     const data= await product.find();
//     console.log(data);
// }

// connectDB();

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({result}, jwtKey, {expiresIn:"2h"},(err,token)=>{
        if(err){
            resp.send("Something went wrong")  
        }
        resp.send({result,auth:token})
    })
})

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({user}, jwtKey, {expiresIn:"2h"},(err,token)=>{
                if(err){
                    resp.send("Something went wrong")  
                }
                resp.send({user,auth:token})
            })
        } else {
            resp.send({ result: "No User found" })
        }
    } else {
        resp.send({ result: "No User found" })
    }
});
// app.post("/register",async (req,resp)=>{
//     let user= new User(req.body);
//     let result= await user.save();
//     resp.send(result);
// });

app.post("/add-product", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

app.get("/",(req,resp)=>{
    resp.send("hello")
});

app.get("/products", async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: "No Product found" })
    }
});

app.get("/product/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }
});

app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        "$or": [     //$or use karke ek se jyada field me search karte hai.....
            {
                name: { $regex: req.params.key }  
            },
            {
                company: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            }
        ]
    });
    resp.send(result);
})

app.put("/product/:id", async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});

app.delete("/product/:id", async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
});

app.listen(5000);