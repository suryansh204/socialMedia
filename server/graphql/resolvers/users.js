import { UserInputError } from "apollo-server-express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import User from '../../models/User.js';
import Profile from '../../models/Profile.js';
import { validateRegisterInput, validateLoginInput } from '../../utils/validators.js';
import 'dotenv/config';

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, process.env.SECRET_KEY, { expiresIn: "1h" })
}

export default {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const user = await User.findOne({ username: username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError("User not found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Incorrect password"
                throw new UserInputError("Incorrect password", { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }

        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            // Validate user data
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);

            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            // const capitalizedUsername = _.upperFirst(username);

            // Make sure user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is taken"
                    }
                });
            }

            /* CREATE PROFILE */

            const newProfile = new Profile({
                username,
                email,
                phone: '',
                school: '',
                location: '',
                bio: '',
                birthDate: '',
                relationship: '',
                picture: ''
            })

            const profile = await newProfile.save();

            // Hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString(),
                profile: profile._id
            });

            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}