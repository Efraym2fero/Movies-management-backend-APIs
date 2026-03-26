import { prisma} from "../config/db.js";
import { buildUrl } from "../utils/buildURL.js";

const getWatchlist = async(req,res)=>{
    try {
        
        const {
            page = 1,
            limit = 5,
            status,
            rating,
            order = "desc",
            sortBy = "rating"
        }=req.query

        const curPage = parseInt(page)
        const take = parseInt(limit)
        const skip = (curPage - 1) * take

        const allowedFields = ["rating","status"]
        const sortFields = allowedFields.includes(sortBy)?sortBy:"rating"
        const sortOrder = order === "desc" ? "desc":"asc" 

        const where = {userID:req.user.id}

        if (status){
            where.status = status
        }

        if (rating){
            where.rating = parseInt(rating)
        }

        

        const watchlist = await prisma.watchlist.findMany({
            where,
            skip,
            take,
            orderBy:{
                [sortFields]:sortOrder
            },
            include:{movie:true}
        })

        if (!watchlist){
            return res.status(404).json({error:"watchlist not found"})
        }


        const totalwatchlists = await prisma.watchlist.count({where})
        const totalPages = Math.ceil(totalwatchlists/take)

        let nextPage = null
        let prevPage = null

        if(totalPages > curPage){
            nextPage = buildUrl(req,curPage+1,take)
        }

        if(curPage>1){
            prevPage = buildUrl(req,curPage-1,take)
        }
        
        res.status(200).json({
            data: {watchlist},
            pagination:{
                totalwatchlists,
                totalPages,
                page:curPage,
                limit:take,
                nextPage,
                prevPage
            }

        })       
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