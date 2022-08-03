const Joi = require("joi");
const JoiPasswordComplexity = require('joi-password-complexity')

const churchSchema = Joi.object({
    name:Joi.string().required(),
    serviceDays:Joi.array().items(Joi.string().valid("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")),
    bankName:Joi.string().required(),
    address:Joi.string().required(),
    accountNumber:Joi.string().required(),
    subAccountId:Joi.string().allow(null)
});

exports.signUpValidation = (req, res, next)=>{

    const userSchema = Joi.object({
        firstName:Joi.string().required(),
        lastName:Joi.string().required(),
        phoneNumber:Joi.string().min(10).max(22).allow(null),
        email:Joi.string().min(2).max(255).required().email(),
        occupation:Joi.string().allow(null).default(null),
        city:Joi.string().allow(null).default(null),
        churches:Joi.array().items(churchSchema),
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
        churches:Joi.array().items(churchSchema),
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
        currency:Joi.string().uppercase().required().valid("NGN","USD","EUR"),
        businessName:Joi.string().required(),
        businessAddress:Joi.string().required(),
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

exports.updatepasswordvalidation = (req,res, next)=>{
    const loginSchema = Joi.object({
        // password:JoiPasswordComplexity(complexityOptions).required()
        email:Joi.string().min(2).max(255).required().email(),
        password:Joi.string().min(7).required(),
        confirmPassword:Joi.string().min(7).required()
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


exports.churchValidation = (req,res, next)=>{
    const bank = Joi.object({
        id:Joi.number(),
        code:Joi.string().required(),
        name:Joi.string().required()

    })
    const churchSchema = Joi.object({
        bank:bank,
        name:Joi.string().required(),
        serviceDays:Joi.array().items(Joi.string().valid("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")),
        address:Joi.string().required(),
        accountName:Joi.string().required(),
        accountNumber:Joi.string().required(),
        country: Joi.string().required().valid("NG","GH","KE","UG","ZA","TZ")
    })
    const {error, value} = churchSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.status(400).json(error);
    }
    if(value){
        next();
    }
}