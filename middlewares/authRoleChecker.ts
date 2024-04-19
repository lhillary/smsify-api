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
