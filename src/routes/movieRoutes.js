import express from 'express';
import { getMovies } from '../controllers/movieController.js';
import { validateQueryReq } from '../middleware/validatorsMiddleware.js';
import { getMoviesSchema } from '../validators/movieValidators.js';

const movieRouter = express.Router()

movieRouter.get("/",validateQueryReq(getMoviesSchema),getMovies)


export default movieRouter;