import { Request, Response, NextFunction } from "express";
/**
 *
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).send("Access Denied");
        return;
    }
    next();
}

/**
 * Allows Twilio-backed endpoints (buying numbers, sending SMS) only for
 * users who have connected their own Twilio account via Twilio Connect.
 */
export function canUseTwilio(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
    }
    if (!req.user.connectedAccountSid) {
        res.status(403).json({ message: 'Connect your Twilio account to use SMS features' });
        return;
    }
    next();
}

/**
 * Blocks new user registration unless ALLOW_REGISTRATION=true.
 * Lets the app stay deployed publicly without open signup.
 */
export function registrationAllowed(req: Request, res: Response, next: NextFunction) {
    if (process.env.ALLOW_REGISTRATION !== 'true') {
        res.status(403).json({ message: 'Registration is currently closed' });
        return;
    }
    next();
}
