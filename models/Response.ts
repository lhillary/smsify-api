import { toCamelCase } from '../helpers/dbUtils';
import pool from '../config/db';
import { IResponse } from 'types/interfaces';

/**
 *
 *
 * @class ResponseModel
 */
class ResponseModel {
    /**
     *
     *
     * @static
     * @param {IResponse} response
     * @return {*}  {Promise<IResponse>}
     * @memberof ResponseModel
     */
    static async create(response: IResponse): Promise<IResponse> {
        const { messageId, responseContent } = response;
        const result = await pool.query(
            `INSERT INTO responses (message_id, response_content, received_at)
             VALUES ($1, $2, NOW()) RETURNING *;`,
            [messageId, responseContent]
        );
        return toCamelCase(result.rows[0]) as IResponse;
    }

    /**
     *
     *
     * @static
     * @param {number} userId
     * @param {number} campaignId
     * @return {*}  {Promise<IResponse[]>}
     * @memberof ResponseModel
     */
    static async findAllByCampaignId(userId: number, campaignId: number): Promise<IResponse[]> {
        const result = await pool.query(
            `SELECT r.*, m.message_content, m.sent_at 
             FROM responses r
             INNER JOIN messages m ON r.message_id = m.message_id
             WHERE m.campaign_id = $1 AND EXISTS (
                 SELECT 1 FROM campaigns c WHERE c.campaign_id = m.campaign_id AND c.user_id = $2
             ) AND r.deleted_at IS NULL;`,
            [campaignId, userId]
        );
        return toCamelCase(result.rows) as IResponse[];
    }
}

export default ResponseModel;