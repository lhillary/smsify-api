import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import { PassportStatic } from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

/**
 *
 *
 * @export
 * @param {PassportStatic} passport
 */
export function initialize(passport: PassportStatic) {
    // Local strategy for initial authentication
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findByEmail(email);
			console.log('LOGGING USER', user);
            if (!user) {
                return done(null, false, { message: 'That email is not registered' });
            }
    
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (err) {
            console.error("Error during authentication:", err);
            return done(err);
        }
    }));

    // JWT strategy for handling JWT in headers
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET! // Make sure this secret is securely managed
    }, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
			console.log('LOGGING USER', user);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: "User not found" });
            }
        } catch (error) {
            console.error("JWT Strategy Error:", error);
            return done(error, false);
        }
    }));
    
};