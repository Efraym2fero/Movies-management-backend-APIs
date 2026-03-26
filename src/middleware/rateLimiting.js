import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
    windowMs: 1000 * 60 ,
    max:5,
    message:{
        error:"Too many requests, please try again later."
    },
    standardHeaders:true,
    legacyHeaders:false
})

const movieLimiter = rateLimit({
    windowMs: 1000 * 60 * 60 ,
    max:1000,
    message:{
        error:"Too many requests, please try again later."
    },
    standardHeaders:true,
    legacyHeaders:false
})

const watchlistLimiter = rateLimit({
    windowMs: 1000 * 60 * 60 ,
    max:500,
    message:{
        error:"Too many requests, please try again later."
    },
    standardHeaders:true,
    legacyHeaders:false
})

export {authLimiter,movieLimiter,watchlistLimiter}