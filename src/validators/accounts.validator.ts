import Joi from 'joi';

export default {
  createUser: Joi.object({
    email: Joi.string().email().required().label('Email'),
    firstName: Joi.string().min(1).required().label('First name'),
    lastName: Joi.string().min(1).required().label('Last name'),
    password: Joi.string().min(8).max(15).required()
      .label('Password'),
    passwordAgain: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Password (again)')
      .messages({ 'any.only': "Error: Your passwords didn't match." }),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required(),
  }),
  changePassword: Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(8).max(15).required()
      .label('Password'),
    passwordAgain: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Password (again)')
      .messages({ 'any.only': "Error: Your passwords didn't match." }),
  }),
};
