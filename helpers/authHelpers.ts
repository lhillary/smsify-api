import jwt from 'jsonwebtoken';

/**
 *
 *
 * @export
 * @param {number} userId
 * @return {*} 
 */
export function generateToken(userId: number) {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });
}