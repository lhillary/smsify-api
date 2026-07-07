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
            `INSERT INTO campaign_categories (campaign_id, category_label)
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
    /**
     * Pass userId to restrict to campaigns the user owns (API requests);
     * omit it for internal use where there is no user context (webhooks).
     */
    static async findByCampaign(campaignId: number, userId?: number): Promise<ICampaignCategory[]> {
        const ownershipClause = userId !== undefined
            ? ` AND EXISTS (SELECT 1 FROM campaigns c WHERE c.campaign_id = campaign_categories.campaign_id AND c.user_id = $2)`
            : '';
        const params: number[] = userId !== undefined ? [campaignId, userId] : [campaignId];
        const result = await pool.query(
            `SELECT * FROM campaign_categories WHERE campaign_id = $1 AND deleted_at IS NULL${ownershipClause};`,
            params
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
    static async update(categoryId: number, userId: number, newLabel: string): Promise<ICampaignCategory> {
        const result = await pool.query(
            `UPDATE campaign_categories SET category_label = $3
             WHERE category_id = $1 AND deleted_at IS NULL
             AND EXISTS (SELECT 1 FROM campaigns c WHERE c.campaign_id = campaign_categories.campaign_id AND c.user_id = $2)
             RETURNING *;`,
            [categoryId, userId, newLabel]
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
    static async delete(categoryId: number, userId: number): Promise<ICampaignCategory> {
        const result = await pool.query(
            `UPDATE campaign_categories SET deleted_at = NOW()
             WHERE category_id = $1 AND deleted_at IS NULL
             AND EXISTS (SELECT 1 FROM campaigns c WHERE c.campaign_id = campaign_categories.campaign_id AND c.user_id = $2)
             RETURNING *;`,
            [categoryId, userId]
        );
        return toCamelCase(result.rows[0]) as ICampaignCategory;
    }
}

export default Categorization;