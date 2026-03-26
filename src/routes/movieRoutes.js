import express from 'express';
import { getMovies } from '../controllers/movieController.js';
import { validateQueryReq } from '../middleware/validatorsMiddleware.js';
import { getMoviesSchema } from '../validators/movieValidators.js';
import { movieLimiter } from '../middleware/rateLimiting.js';

const movieRouter = express.Router()
movieRouter.use(movieLimiter)
movieRouter.get("/",validateQueryReq(getMoviesSchema),getMovies)


export default movieRouter;