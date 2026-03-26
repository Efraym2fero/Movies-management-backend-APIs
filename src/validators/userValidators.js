
import { z } from "zod"

const addUserSchema = z.object({
    name :z.string("enter a name with min 3 char ").min(3),
    email:z.email("The email not correct"),
    password:z.string("You should enter password from 4 to 15 char").min(4).max(15)
})

const loginSchema = z.object({
    email:z.email("The email not correct"),
    password:z.string("You should enter password from 4 to 15 char").min(4).max(15)
})

export {addUserSchema,loginSchema}