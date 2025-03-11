import { EyeColorEnum } from './../../node_modules/.prisma/client/index.d';
import express from "express";
import {TrainModel , GenerateImage , GenerateImageFromPack} from "common/types";
import { prismaClient } from "db";

const USER_ID = "123"

const PORT = process.env.PORT || 8080 ; 

const app = express();
app.use(express.json())

app.post("/ai/training",async (req , res ) => {
    const parsedBody = TrainModel.safeParse(req.body);


    if(!parsedBody.success){
        res.status(411).json({
            message : "Incorrect Input"
        })
        return 
    }
    const data = await prismaClient.model.create({
        data : {
            name : parsedBody.data.name ,
            type : parsedBody.data.type ,
            age : parsedBody.data.age  ,
            ethinicity : parsedBody.data.ethinicity ,
            eyeColor : parsedBody.data.eyeColor ,
            bald : parsedBody.data.bald,
            userId : USER_ID
        }
    })
    res.json({
        modelId : data.id 
    })
});

app.post("/ai/generate", (req , res ) => {

});

app.post("/pack/generate", (req , res ) => {

});

app.post("/pack/bulk", (req , res ) => {

});

app.get("/image", (req , res ) => {

});

app.listen(3000, () => {
  console.log("Server is running on port 8080");
});