const Joi = require("joi");
const JoiPasswordComplexity = require('joi-password-complexity')
exports.signUpValidation = (req, res, next)=>{
    const userSchema = Joi.object({
        firstName:Joi.string().required(),
        lastName:Joi.string().required(),
        phoneNumber:Joi.string().min(10).max(22).allow(null),
        email:Joi.string().min(2).max(255).required().email(),
        occupation:Joi.string().allow(null).default(null),
        city:Joi.string().allow(null).default(null),
        church:Joi.string().allow(null).default(null),
        serviceDays:Joi.array().items(Joi.string()),
        country:Joi.string().allow(null).default(null),
        // password:JoiPasswordComplexity(complexityOptions).required(),
        password:Joi.string().min(7).required(),
        confirmPassword:Joi.string().required().valid(Joi.ref('password'))
    });
    const {error, value} = userSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.status(400).json(error);
    }
    if(value){
        next();
    }
}

exports.signInValidation = (req,res, next)=>{
    const loginSchema = Joi.object({
        email:Joi.string().min(2).max(255).required().email(),
        // password:JoiPasswordComplexity(complexityOptions).required()
        password:Joi.string().min(7).required()
    })

    const {error, value}=loginSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.status(400).json(error);
    }
    if(value){
        next();
    }
}

exports.updateValidation = (req, res, next)=>{
    const userSchema = Joi.object({
        firstName:Joi.string(),
        lastName:Joi.string(),
        phoneNumber:Joi.string().min(10).max(22).allow(null),
        occupation:Joi.string().allow(null).default(null),
        city:Joi.string().allow(null).default(null),
        church:Joi.string().allow(null).default(null),
        serviceDays:Joi.array().items(Joi.string()),
        country:Joi.string().allow(null).default(null),
        // password:JoiPasswordComplexity(complexityOptions).required(),
    });
    const {error, value} = userSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.status(400).json(error);
    }
    if(value){
        next();
    }
}

exports.incomeValidation = (req, res, next)=>{
    const incomeSchema = Joi.object({
        user_id:Joi.string().required(),
        type:Joi.string().valid('personal','corporate').required(),
        businessName:Joi.string().required(),
        amount:Joi.number().required(),
        description:Joi.string().allow(null),
        tithePercentage:Joi.number().min(10).max(100).required(),
        frequency:Joi.string().valid('daily','weekly','monthly','yearly','random').required()

    });
    const {error, value} = incomeSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.status(400).json(error.details[0].message);
    }
    if(value){
        next();
    }
}