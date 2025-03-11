import express from "express";
import {TrainModel , GenerateImage , GenerateImageFromPack} from "common/types";
import { prismaClient } from "db";

const USER_ID = "123"

const PORT = process.env.PORT || 8080 ; 

const app = express();
app.use(express.json())

// For training a model 

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

// For generating a single image

app.post("/ai/generate", async (req , res ) => {
    const parsedBody = GenerateImage.safeParse(req.body)

    if(!parsedBody.success){
        res.status(411).json({

        })
        return;
    }
    const data = await prismaClient.outputImages.create({
        data : {
            prompt : parsedBody.data.prompt , 
            userId : USER_ID , 
            modelId : parsedBody.data.modelId , 
            imageUrl : ""
        }
    })
    res.json({
        imageId : data.id
    })
});

// Generating a bunch of image

app.post("/pack/generate", async (req , res ) => {
    const parsedBody = GenerateImageFromPack.safeParse(req.body);

    if(!parsedBody.success){
        res.status(411).json({
            message : "Input incorrect"
        }); 
        return ; 
    }
    const prompt = await prismaClient.packPrompts.findMany({
        where : {
            packId : parsedBody.data.packId
        }
    })

    const images = await prismaClient.outputImages.createManyAndReturn({
        data : prompt.map(prompt => {
            return {
                prompt : prompt.prompt , 
                userId : USER_ID , 
                modelId : parsedBody.data.modelId , 
                imageUrl : ""
            }
        })
    })
    res.json({
        images : images.map((image) => {
            image.id
        })
    })

});



app.get("/pack/bulk", async (req , res ) => {
    const packs = await prismaClient.packs.findMany({
        
    })
    res.json({
        packs
    })
});


app.get("/image/bulk", async (req , res ) => {
    const images = req.query.images as string[];
    const limit = req.query.limit as string;
    const offset = req.query.offset as string;

    console.log("hi there");

    const imagesData = await prismaClient.outputImages.findMany({
        where : {
            id : {
                in : images
            },
            userId : USER_ID
        }, 
        skip : parseInt(offset) ,
        take : parseInt(limit)

   })
   res.json({
    images : imagesData
   })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});