import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import Cors from "cors";
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
});

//real time 

//api routes
app.get("/",(req, res) => {res.status(200).send("hello")})

//listener
app.listen(port,()=>console.log(`listening to port ${port}`));