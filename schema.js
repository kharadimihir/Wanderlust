import joi from "joi";

const listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description:  joi.string().required(),
        country:  joi.string().required(),
        location:  joi.string().required(),
        image:  joi.string().allow("", null),
        price: joi.number().min(0),
    }).required(),
});

export default listingSchema;

