import { ICampaignCategory } from 'types/interfaces';
import pool from '../config/db';
import { toCamelCase } from '../helpers/dbUtils';

/**
 *
 *
 * @class Categorization
 */
class Categorization {
    /**
     *
     *
     * @static
     * @param {number} campaignId
     * @param {string} label
     * @return {*}  {Promise<ICampaignCategory>}
     * @memberof Categorization
     */
    static async create(campaignId: number, label: string): Promise<ICampaignCategory> {
        const result = await pool.query(
            `INSERT INTO response_categories (campaign_id, category_label)
             VALUES ($1, $2) RETURNING *;`,
            [campaignId, label]
        );
        return toCamelCase(result.rows[0]) as ICampaignCategory;
    }

    /**
     *
     *
     * @static
     * @param {number} campaignId
     * @return {*}  {Promise<ICampaignCategory[]>}
     * @memberof Categorization
     */
    static async findByCampaign(campaignId: number): Promise<ICampaignCategory[]> {
		console.log('', campaignId);
        const result = await pool.query(
            `SELECT * FROM campaign_categories WHERE campaign_id = $1 AND deleted_at IS NULL;`,
            [campaignId]
        );
        return toCamelCase(result.rows) as ICampaignCategory[];  
    }

    /**
     *
     *
     * @static
     * @param {number} categoryId
     * @param {string} newLabel
     * @return {*}  {Promise<ICampaignCategory>}
     * @memberof Categorization
     */
    static async update(categoryId: number, newLabel: string): Promise<ICampaignCategory> {
        const result = await pool.query(
            `UPDATE campaign_categories SET category_label = $2
             WHERE category_id = $1 AND deleted_at IS NULL RETURNING *;`,
            [categoryId, newLabel]
        );
        return toCamelCase(result.rows[0]) as ICampaignCategory;
    }

    /**
     *
     *
     * @static
     * @param {number} categoryId
     * @return {*}  {Promise<ICampaignCategory>}
     * @memberof Categorization
     */
    static async delete(categoryId: number): Promise<ICampaignCategory> {
        const result = await pool.query(
            `UPDATE campaign_categories SET deleted_at = NOW()
             WHERE category_id = $1 AND deleted_at IS NULL RETURNING *;`,
            [categoryId]
        );
        return toCamelCase(result.rows[0]) as ICampaignCategory;
    }
}

export default Categorization;