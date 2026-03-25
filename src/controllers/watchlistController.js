import { prisma} from "../config/db.js";

const addToWatchlist = async(req,res)=>{
    const {movieID,status,rating} = req.body

    const movie = await prisma.movie.findUnique({where:{id:movieID}})
    if(!movie){
        return res.status(404).json({error:"movie not found"})
    }

    const existInWatchlist = await prisma.watchlist.findUnique(
        {
            where:{
                movieID_userID:{
                    movieID:movieID,
                    userID:req.user.id
                }
            }
        })

    if(existInWatchlist){
        return res.status(400).json({error:"movie already in the watchlist"})
    }

    const watchlist = await prisma.watchlist.create({
        data:{
            userID:req.user.id,
            movieID,
            status,
            rating
        }
    })
    res.status(200).json({
        status:"success",
        data:{
            watchlist
        }
    })
}
export {addToWatchlist};