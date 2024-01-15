import type { Document } from 'mongoose';

export interface ChangePassword {
  email: string;
  password: string;
  passwordAgain: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Token {
  key: string;
  created?: Date;
}

export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordAgain: string;
}

export interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  dateJoined: Date;
  lastLogin?: Date;
  token?: Token;
  validatePassword(confirmPassword: string): boolean;
}

export interface Detail {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  dateJoined: Date;
}
