import { prisma} from "../config/db.js";

const getWatchlist = async(req,res)=>{
    try {
        const watchlist = await prisma.watchlist.findMany({where:{
            userID:req.user.id
        }})

        if (!watchlist){
            return res.status(404).json({error:"watchlist not found"})
        }
        res.status(200).json({data:{watchlist}})       
    } catch (error) {
        return res.status(500).json({error:"faild to get"})
    }
}

const addToWatchlist = async(req,res)=>{
    try {
        const {movieID,status,rating,notes} = req.body

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
                rating,
                notes
            }
        })
        res.status(200).json({
            status:"success",
            data:{
                watchlist
            }
        })
    } catch (error) {
        return res.status(500).json({error:"faild to add"})
    }

}

const updateWL = async(req,res)=>{
    try {

        const {status,rating,notes} = req.body
        const updatedItem = await prisma.watchlist.update({
            where:{
                id:req.params.id
            },
            data:{
                ...(status !== undefined && {status}),
                ...(rating !== undefined && {rating}),
                ...(notes !== undefined && {notes}),
                updatedAt:new Date()
            }
        })

        if (!updatedItem){
            return res.status(400).json({error:"the item not updated"})
        }

        res.status(200).json({data:{updatedItem}})

    } catch (error) {
        return res.status(500).json({error:"faild to update"})
    }

}

const deleteWLItem = async(req,res)=>{
    try {
        const watchlistItem = await prisma.watchlist.findUnique({where:{
            id:req.params.id
        }})

        if (!watchlistItem){
            return res.status(404).json({error:"movie not found in the watchlist"})
        }

        if (req.user.id !== watchlistItem.userID){
            return res.status(403).json({error:"You are not allowed to delete"})
        }

        await prisma.watchlist.delete({where:
            {
                id:req.params.id
            }
        })

        res.status(200).json({
        status:"deleted successfully"
    })
    } catch (error) {
        return res.status(500).json({error:"faild to delete"})
    }
}

export {addToWatchlist,getWatchlist,deleteWLItem,updateWL};