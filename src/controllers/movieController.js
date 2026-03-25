import {prisma} from "../config/db.js"
import { buildUrl} from "../utils/buildURL.js"


const getMovies = async(req,res)=>{
    try {
        const {
            page = 1,
            limit = 5,
            genre,
            year,
            search
        } = req.query

        
        const where = {}

        if (genre){
            where.genre={
                has:genre            }
        }

        if (year){
            where.realeseYear= parseInt(year)
        }

        if (search){
            where.title = {
                contains:search,
                mode:"insensitive"
            }
        }
        const take = parseInt(limit)
        const skip = (parseInt(page) - 1) * take

        const movies = await prisma.movie.findMany({
            where,
            skip,
            take
        })
        
        if (!movies){
            return res.status(404).json({error:"movies not found"})
        }
        
        const totalMovies = await prisma.movie.count()
        const totalPages = Math.ceil(totalMovies/take)
        const curPage = parseInt(page)

        let nextPage = null
        let prevPage = null

        if(curPage < totalPages){
            nextPage = buildUrl(req,curPage+1,limit) 
        }
        
        if (curPage > 1){
            prevPage = buildUrl(req,curPage-1,limit)
        }
        

        res.status(200).json({
            data:{movies},
            pagination: {
                totalMovies,
                page: curPage,
                limit: take,
                totalPages,
                nextURL: nextPage,
                prevURL: prevPage}
        })
    } catch (error) {
        return res.status(500).json({error:"failed"})
    }
}


export {getMovies};