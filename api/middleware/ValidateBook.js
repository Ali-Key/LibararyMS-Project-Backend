import {check, validationResult} from 'express-validator'

const validateBook = async (req, res, next) => {
    await check("title", "Title is required").notEmpty().run(req)
    await check("image", "Image is required").notEmpty().run(req)
    await check("price", "Price is required").notEmpty().run(req)

    
 

    const errors = validationResult(req)
    const errorMessage = errors.array().map((error) => error.msg)

    if(errors.isEmpty()) {
        next()
    } else {
        res.status(400).json({status: 400, message: errorMessage[0]})
    }
}

export default validateBook