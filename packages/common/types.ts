
import {z} from "zod" ;

const TrainModel = z.object({
    name : z.string(),
    type : z.enum(["Man", "Woman" , "Other"]), 
    age : z.number()
})