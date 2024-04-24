import pool from '../config/db';
import { UserUpdates, IUser, UpdateKeys, FieldMappings } from '../types/interfaces';
import { toCamelCase } from '../helpers/dbUtils';

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
        return toCamelCase(newUser.rows[0]) as IUser;
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
            `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL;`,
            [email]
        );
        if (result.rows.length > 0) {
            const user = toCamelCase(result.rows[0]) as IUser;
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
            `SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL;`,
            [userId]
        );
        if (result.rows.length > 0) {
            const user = toCamelCase(result.rows[0]) as IUser;
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const values: any[] = [userId]; 
	
		const fieldMappings: FieldMappings = {
			username: 'username',
			email: 'phone_number',
			passwordHash: 'password_hash',
			tierId: 'tier_id',
		};
    
        // Dynamically build the SQL update statement
        Object.entries(updates).forEach(([key, value]) => {
			if (fieldMappings[key as UpdateKeys]) {
				setParts.push(`${fieldMappings[key as UpdateKeys]} = $${values.length + 1}`);
				values.push(value);
			}
		});
    
        if (setParts.length > 0) {
			const queryString = `UPDATE users SET ${setParts.join(', ')} WHERE user_id = $1 RETURNING *;`;
			try {
				const result = await pool.query(queryString, values);
				if (result.rows.length > 0) {
					return toCamelCase(result.rows[0]) as IUser;
				}
				return null;
			} catch (error) {
				console.error('SQL Error:', error);
			}
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