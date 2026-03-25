import "dotenv/config"
import express from "express"
import movieRouter from "./routes/movieRoutes.js";
import authRouter from "./routes/authRoutes.js"
import watchlistRouter from "./routes/watchlistRouter.js";
import { connectDB,disconnectDB } from "./config/db.js";


connectDB()


const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/movies",movieRouter);
app.use("/auth",authRouter)
app.use("/watchlist",watchlistRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});


app.get("/",(req,res)=>{
    res.json({"message":"hello world"})
})

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});