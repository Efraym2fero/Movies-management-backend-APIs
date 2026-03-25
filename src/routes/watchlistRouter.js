import { addToWatchlist, deleteWLItem, getWatchlist, updateWL } from "../controllers/watchlistController.js";
import express  from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";

const watchlistRouter = express.Router()

watchlistRouter.use(authMiddleware)
watchlistRouter.post("/",addToWatchlist)
watchlistRouter.get("/user/:id",getWatchlist)
watchlistRouter.delete("/:id",deleteWLItem)
watchlistRouter.put("/:id",updateWL)
export default watchlistRouter;
