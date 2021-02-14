import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import Cors from "cors";
import mongoMessages from "./dbModel.js";
import dotenv from 'dotenv';
dotenv.config();

//app config
const app = express();
const port = process.env.Port || 8080;
const secret = process.env.SECRET_KEY;
const pusher = new Pusher({
    appId: "1154069",
    key: "efc57b210ee48de83337",
    secret: secret,
    cluster: "ap2",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(Cors());

//DB config
const password = process.env.PASSWORD;
const connection_url=`mongodb+srv://admin:${password}@cluster0.hsoyw.mongodb.net/<dbname>?retryWrites=true&w=majority`
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

mongoose.connection.once("open",()=>{
    console.log("DB Connected");

    const changeStream=mongoose.connection.collection("messages").watch();
    changeStream.on("change",(change)=>{
        pusher.trigger("messages", "newMessages", {
            "change": change
          });
    })
});

//real time 

//api routes
app.get("/",(req, res) => {res.status(200).send("hello")})

app.post("/save/messages",(req, res) => {
    const dbMessage =req.body;
    mongoMessages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data)
        }
    })
})

app.get("/retrieve/conversation",(req, res) => {
    mongoMessages.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            data.sort((b,a)=>{
                return a.timestamp-b.timestamp
            })
            res.status(200).send(data)
        }
    })
})

//listener
app.listen(port,()=>console.log(`listening to port ${port}`));