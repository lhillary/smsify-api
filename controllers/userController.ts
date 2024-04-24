import bcrypt from 'bcryptjs';
import User from '../models/User';
import { Request, Response } from "express";
import { IUser } from '../types/interfaces';
import { generateToken } from '../helpers/authHelpers';
import passport from 'passport';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = await User.create(username, email, passwordHash);

        const token = generateToken(newUser.userId);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const loginUser = (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate('local', { session: false }, (err: any, user: IUser, info: any) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (!user) {
            return res.status(401).json({ message: info?.message || 'Login failed' });
        }
        const token = generateToken(user.userId);
		const userForClient = {
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
			tierId: user.tierId,
        };
        res.json({ message: 'Logged in successfully', token, user: userForClient });
    })(req, res);
};

export const getUser = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving user");
    }
};

export const updateUser = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    const updates = req.body;

    try {
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No update data provided' });
        }
        const updatedUser = await User.update(userId, updates);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while updating campaign");
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    try {
        const deletedCount = await User.delete(userId);
        if (deletedCount && deletedCount > 0) {
            res.status(204).send("User deleted successfully");
        } else {
            res.status(404).send("No user found or already deleted");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};