import { addToWatchlist } from "../controllers/watchlistController.js";
import express  from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";

const watchlistRouter = express.Router()

watchlistRouter.use(authMiddleware)
watchlistRouter.post("/",addToWatchlist)

export default watchlistRouter;
