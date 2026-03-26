import {z} from "zod"


const getMoviesSchema = z.object({
    page:z.coerce.number("enter page num starts from 1").min(1).optional(),
    limit:z.coerce.number("enter limit starts from 1").min(1).optional() ,
    genre:z.string("You should enter genre like Action").min(4).optional() ,
    year:z.coerce.number("enter a year").min(1900).optional(),
    search:z.string("You should enter movie title").optional() ,
    sortBy :z.enum(["realeseYear","genre","title","runtime"],{error:()=>{
        message:"You should enter one of these [realeseYear,genre,title,runtime]"
    }}).optional(),
    order : z.enum(["asc","desc"],{error:()=>{
        message:"You should enter one of these [asc,desc]"
    }}).optional()
})

export {getMoviesSchema}