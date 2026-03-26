import { addToWatchlist, deleteWLItem, getWatchlist, updateWL } from "../controllers/watchlistController.js";
import express  from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateQueryReq, validateReq } from "../middleware/validatorsMiddleware.js";
import { addTOWLSchema, updateWLSchema } from "../validators/watchlistValidators.js";
import { watchlistLimiter } from "../middleware/rateLimiting.js";

const watchlistRouter = express.Router()
watchlistRouter.use(watchlistLimiter)
watchlistRouter.use(authMiddleware)
watchlistRouter.post("/",validateReq(addTOWLSchema),addToWatchlist)
watchlistRouter.get("/",validateQueryReq(updateWLSchema),getWatchlist)
watchlistRouter.delete("/:id",deleteWLItem)
watchlistRouter.put("/:id",validateReq(updateWLSchema),updateWL)

export default watchlistRouter;
