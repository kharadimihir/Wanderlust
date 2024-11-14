import Joi  from "joi";

const listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description:  Joi.string().required(),
        country:  Joi.string().required(),
        location:  Joi.string().required(),
        image:  Joi.string().allow("", null),
        price: Joi.number().min(0),
    }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});



export  {
    listingSchema,
    reviewSchema
}

