import express from "express"
import router from "./routes/movieRoutes.js";
const app = express();
const PORT = 3000;


app.use("/movies",router);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});


app.get("/",(req,res)=>{
    res.json({"message":"hello world"})
})

