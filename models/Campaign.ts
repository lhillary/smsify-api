import { toCamelCase } from 'helpers/dbUtils';
import pool from '../config/db';
import { ICampaign, CampaignUpdates } from '../types/interfaces';

/**
 *
 *
 * @class Campaign
 */
class Campaign {
    /**
     *
     *
     * @static
     * @param {number} userId
     * @param {string} name
     * @param {string} description
     * @param {string} [status='active']
     * @return {*}  {Promise<ICampaign>}
     * @memberof Campaign
     */
    static async create(userId: number, name: string, description: string, status = 'active'): Promise<ICampaign> {
        const newCampaign = await pool.query(
            `INSERT INTO campaigns (user_id, name, description, status) VALUES ($1, $2, $3, $4) RETURNING *;`,
            [userId, name, description, status]
        );
        return newCampaign.rows[0] as ICampaign;
    }

    /**
     *
     *
     * @static
     * @param {number} userId
     * @return {*}  {(Promise<ICampaign[] | null>)}
     * @memberof Campaign
     */
    static async findByUserId(userId: number): Promise<ICampaign[] | null> {
        const result = await pool.query(
            `SELECT * FROM campaigns WHERE user_id = $1;`,
            [userId]
        );
        return result.rows as ICampaign[];
    }

    /**
     *
     *
     * @static
     * @param {number} campaignId
     * @return {*}  {(Promise<ICampaign | null>)}
     * @memberof Campaign
     */
    static async findById(campaignId: number): Promise<ICampaign | null> {
        const result = await pool.query(
            `SELECT * FROM campaigns WHERE campaign_id = $1;`,
            [campaignId]
        );
        return toCamelCase(result.rows[0]) as ICampaign;
    }

    /**
     *
     *
     * @static
     * @param {number} campaignId
     * @param {CampaignUpdates} updates
     * @return {*}  {(Promise<ICampaign | null>)}
     * @memberof Campaign
     */
    static async update(campaignId: number, updates: CampaignUpdates): Promise<ICampaign | null> {
        const setParts: string[] = [];
        const values: (string | number | undefined)[] = [];
        const allowedFields = ['name', 'description', 'status', 'phoneNumber'];
    
        // Dynamically build the SQL update statement
        Object.keys(updates).forEach((key, index) => {
            if (allowedFields.includes(key)) {
                setParts.push(`${key} = $${index + 2}`); 
                values.push(updates[key as keyof CampaignUpdates]);
            }
        });
    
        if (setParts.length > 0) {
            const result = await pool.query(
                `UPDATE campaigns SET ${setParts.join(', ')} WHERE campaign_id = $1 RETURNING *;`,
                [campaignId, ...values]
            );
            if (result.rows.length > 0) {
                return toCamelCase(result.rows[0]) as ICampaign;
            }
            return null;
        }
        return null;
    }

    /**
     *
     *
     * @static
     * @param {number} campaignId
     * @return {*}  {(Promise<number | null>)}
     * @memberof Campaign
     */
    static async delete(campaignId: number): Promise<number | null> {
        const result = await pool.query(
            `UPDATE campaigns SET deleted_at = NOW() WHERE campaign_id = $1 AND deleted_at IS NULL;`,
            [campaignId]
        );
        return result.rowCount;
    }
}
export default Campaign;
