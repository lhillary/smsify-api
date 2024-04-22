import { toCamelCase } from '../helpers/dbUtils';
import pool from '../config/db';
import { ISubscriptionTier } from '../types/interfaces';

/**
 *
 *
 * @class SubscriptionTier
 */
class SubscriptionTier {
    /**
     *
     *
     * @static
     * @param {string} name
     * @param {string} description
     * @param {number} price
     * @return {*}  {Promise<ISubscriptionTier>}
     * @memberof SubscriptionTier
     */
    static async create(name: string, description: string, price: number): Promise<ISubscriptionTier> {
        const result = await pool.query(
            `INSERT INTO subscription_tiers (tier_name, description, price) VALUES ($1, $2, $3) RETURNING *;`,
            [name, description, price]
        );
        return toCamelCase(result.rows[0]) as ISubscriptionTier; 
    }

    /**
     *
     *
     * @static
     * @return {*}  {(Promise<ISubscriptionTier[] | null>)}
     * @memberof SubscriptionTier
     */
    static async findAll(): Promise<ISubscriptionTier[] | null> {
        const result = await pool.query(`SELECT * FROM subscription_tiers WHERE deleted_at IS NULL;`);
        return toCamelCase(result.rows) as ISubscriptionTier[];
    }

    /**
     *
     *
     * @static
     * @param {number} tierId
     * @return {*}  {(Promise<ISubscriptionTier | null>)}
     * @memberof SubscriptionTier
     */
    static async findById(tierId: number): Promise<ISubscriptionTier | null> {
        const result = await pool.query(`SELECT * FROM subscription_tiers WHERE tier_id = $1 AND deleted_at IS NULL;`, [tierId]);
        return toCamelCase(result.rows[0]) as ISubscriptionTier;
    }

    /**
     *
     *
     * @static
     * @param {number} tierId
     * @param {string} name
     * @param {string} description
     * @param {number} price
     * @return {*}  {(Promise<ISubscriptionTier | null>)}
     * @memberof SubscriptionTier
     */
    static async update(tierId: number, name: string, description: string, price: number): Promise<ISubscriptionTier | null> {
        const result = await pool.query(
            `UPDATE subscription_tiers SET tier_name = $2, description = $3, price = $4 WHERE tier_id = $1 AND deleted_at IS NULL RETURNING *;`,
            [tierId, name, description, price]
        );
        return toCamelCase(result.rows[0]) as ISubscriptionTier;
    }

    /**
     *
     *
     * @static
     * @param {number} tierId
     * @return {*}  {(Promise<number | null>)}
     * @memberof SubscriptionTier
     */
    static async delete(tierId: number): Promise<number | null> {
        const result = await pool.query(
            `UPDATE subscription_tiers SET deleted_at = NOW() WHERE tier_id = $1 AND deleted_at IS NULL;`,
            [tierId]
        );
        return result.rowCount;
    }
}

export default SubscriptionTier;