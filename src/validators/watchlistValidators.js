import {z} from "zod"


const addTOWLSchema = z.object({
    movieID :z.string().uuid(),
    status:z.enum(["PLANNED","WATCHING","COMPLETED","DROPED"],{error:()=>{
        message:"You should enter one of these [PLANNED, WATCHING, COMPLETED, DROPED]"
    }}).optional(),
    rating:z.coerce.number().int("You should enter an integer num").min(1,"Enter num between 1 to 10").max(10,"Enter num between 1 to 10").optional(),
    notes:z.string().optional()
})

const updateWLSchema = z.object({
    status:z.enum(["PLANNED","WATCHING","COMPLETED","DROPED"],{error:()=>{
        message:"You should enter one of these [PLANNED, WATCHING, COMPLETED, DROPED]"
    }}).optional(),
    rating:z.coerce.number().int("You should enter an integer num").min(1,"Enter num between 1 to 10").max(10,"Enter num between 1 to 10").optional(),
    notes:z.string().optional()  
})

export {addTOWLSchema,updateWLSchema};