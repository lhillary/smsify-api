import { toCamelCase } from '../helpers/dbUtils';
import pool from '../config/db';
import { ICampaign, CampaignUpdates, UpdateKeys, FieldMappings } from '../types/interfaces';

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
	 * @param {string} phoneNumber
	 * @param {string} [status='active']
	 * @return {*}  {Promise<ICampaign>}
	 * @memberof Campaign
	 */
	static async create(userId: number, name: string, description: string, phoneNumberId: number, status = 'active'): Promise<ICampaign> {
        const newCampaign = await pool.query(
            `INSERT INTO campaigns (user_id, name, description, phone_number_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [userId, name, description, phoneNumberId, status]
        );
        return toCamelCase(newCampaign.rows[0]) as ICampaign;
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
        return toCamelCase(result.rows) as ICampaign[];
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const values: any[] = [campaignId]; 
		const fieldMappings: FieldMappings = {
			name: 'name',
			description: 'description',
			status: 'status',
			phoneNumber: 'phone_number',
		};
    
        // Dynamically build the SQL update statement
        Object.entries(updates).forEach(([key, value]) => {
			if (fieldMappings[key as UpdateKeys]) {
				setParts.push(`${fieldMappings[key as UpdateKeys]} = $${values.length + 1}`);
				values.push(value);
			}
		});

		console.log('Debug: Set Parts and Values:', setParts, values);
    
        if (setParts.length > 0) {
			const queryString = `UPDATE campaigns SET ${setParts.join(', ')} WHERE campaign_id = $1 RETURNING *;`;
			console.log('Query String:', queryString);
			try {
				const result = await pool.query(queryString, values);
				if (result.rows.length > 0) {
					return toCamelCase(result.rows[0]) as ICampaign;
				}
				return null;
			} catch(error) {
				console.error('SQL Error:', error);
				throw error;
			}
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
