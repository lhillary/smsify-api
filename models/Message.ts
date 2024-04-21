import { toCamelCase } from 'helpers/dbUtils';
import pool from '../config/db';
import { IMessage } from 'types/interfaces';

/**
 *
 *
 * @class Message
 */
class Message {
    /**
     *
     *
     * @static
     * @param {IMessage} message
     * @return {*}  {Promise<IMessage>}
     * @memberof Message
     */
    static async create(message: IMessage): Promise<IMessage> {
        const { campaignId, contactId, messageContent, twilioSid, status } = message;
        const result = await pool.query(
            `INSERT INTO messages (campaign_id, contact_id, message_content, twilio_sid, status, sent_at)
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;`,
            [campaignId, contactId, messageContent, twilioSid, status]
        );
        return toCamelCase(result.rows[0]) as IMessage;
    }

    /**
     *
     *
     * @static
     * @param {string} twilioSid
     * @return {*}  {(Promise<IMessage | null>)}
     * @memberof Message
     */
    static async findByTwilioSid(twilioSid: string): Promise<IMessage | null> {
        const result = await pool.query(
            `SELECT * FROM messages WHERE twilio_sid = $1;`,
            [twilioSid]
        );
        if (result.rows.length > 0) {
            return toCamelCase(result.rows[0]) as IMessage;
        }
        return null;
    }

    /**
     *
     *
     * @static
     * @param {number} campaignId
     * @return {*}  {Promise<IMessage[]>}
     * @memberof Message
     */
    static async findByCampaignId(campaignId: number): Promise<IMessage[]> {
        const result = await pool.query(
            `SELECT * FROM messages WHERE campaign_id = $1 AND deleted_at IS NULL ORDER BY sent_at DESC;`,
            [campaignId]
        );
        return result.rows as IMessage[];
    }

    /**
     *
     *
     * @static
     * @param {string} twilioSid
     * @param {string} status
     * @return {*}  {Promise<void>}
     * @memberof Message
     */
    static async updateStatusBySid(twilioSid: string, status: string): Promise<void> {
        await pool.query(
            `UPDATE messages SET status = $2 WHERE twilio_sid = $1;`,
            [twilioSid, status]
        );
    }
}

export default Message;