import pool from '../config/db';
import { UserUpdates, IUser } from '../types/interfaces';

/**
 *
 *
 * @class User
 */
class User {
    /**
     *
     *
     * @static
     * @param {string} username
     * @param {string} email
     * @param {string} passwordHash
     * @return {*}  {Promise<IUser>}
     * @memberof User
     */
    static async create(username: string, email: string, passwordHash: string): Promise<IUser> {
        const newUser = await pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;`,
            [username, email, passwordHash]
        );
        return newUser.rows[0] as IUser;
    }

    /**
     *
     *
     * @static
     * @param {string} email
     * @return {*}  {(Promise<IUser | null>)}
     * @memberof User
     */
    static async findByEmail(email: string): Promise<IUser | null> {
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL;;`,
            [email]
        );
        if (result.rows.length > 0) {
            const user = result.rows[0] as IUser;
            return user;
        } else {
            return null;
        }
    }

    /**
     *
     *
     * @static
     * @param {number} userId
     * @return {*}  {(Promise<IUser | null>)}
     * @memberof User
     */
    static async findById(userId: number): Promise<IUser | null> {
        const result = await pool.query(
            `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL;;`,
            [userId]
        );
        if (result.rows.length > 0) {
            const user = result.rows[0] as IUser;
            return user;
        } else {
            return null;
        }
    }

    /**
     *
     *
     * @static
     * @param {number} userId
     * @param {UserUpdates} updates
     * @return {*}  {(Promise<IUser | null>)}
     * @memberof User
     */
    static async update(userId: number, updates: UserUpdates): Promise<IUser | null> {
        const setParts: string[] = [];
        const values: (string | number | undefined)[] = [];
        const allowedFields = ['username', 'email', 'passwordHash', 'tierId']
    
        // Dynamically build the SQL update statement
        Object.keys(updates).forEach((key, index) => {
            if (allowedFields.includes(key)) {
                setParts.push(`${key} = $${index + 2}`); 
                values.push(updates[key as keyof UserUpdates]);
            }
        });
    
        if (setParts.length > 0) {
            const result = await pool.query(
                `UPDATE users SET ${setParts.join(', ')} WHERE user_id = $1 RETURNING *;`,
                [userId, ...values]
            );
            if (result.rows.length > 0) {
                return result.rows[0] as IUser;
            }
            return null;
        }
        return null;
    }

    /**
     *
     *
     * @static
     * @param {number} userId
     * @return {*}  {(Promise<number | null>)}
     * @memberof User
     */
    static async delete(userId: number): Promise<number | null> {
        const result = await pool.query(
            `UPDATE users SET deleted_at = NOW() WHERE user_id = $1 AND deleted_at IS NULL;`,
            [userId]
        );
        return result.rowCount;
    }
}
export default User;