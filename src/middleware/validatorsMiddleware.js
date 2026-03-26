
export const validateReq = (schema)=>{
    return (req,res,next)=>{
        const result = schema.safeParse(req.body)
        if (!result.success){
            const formated = result.error.format()
            const flatError = Object.values(formated).flat().filter(Boolean).map((err)=> err._errors).flat()

            return res.status(400).json({message:flatError.join(", ")})
        }
        next()
    }
}

export const validateQueryReq = (schema)=>{
    return (req,res,next)=>{
        const result = schema.safeParse(req.query)
        if (!result.success){
            const formated = result.error.format()
            const flatError = Object.values(formated).flat().filter(Boolean).map((err)=> err._errors).flat()

            return res.status(400).json({message:flatError.join(", ")})
        }
        next()
    }
}