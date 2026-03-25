import express from 'express';
import { getMovies } from '../controllers/movieController.js';

const movieRouter = express.Router()

movieRouter.get("/",getMovies)
//movieRouter.post("/")
//movieRouter.put("/")
//movieRouter.delete("/")

export default movieRouter;