import { toCamelCase } from '../helpers/dbUtils';
import pool from '../config/db';
import { IPhoneNumber } from '../types/interfaces';

/**
 *
 *
 * @class PhoneNumber
 */
class PhoneNumber {
    /**
     *
     *
     * @static
     * @param {number} userId
     * @param {string} phoneNumber
     * @param {string} country
     * @param {string} twilioSid
     * @return {*}  {Promise<IPhoneNumber>}
     * @memberof PhoneNumber
     */
    static async create(userId: number, phoneNumber: string, country: string, twilioSid: string): Promise<IPhoneNumber> {
        const result = await pool.query(
            `INSERT INTO phone_numbers (user_id, phone_number, country, twilio_sid, is_active, purchased_at) VALUES ($1, $2, $3, $4, true, NOW()) RETURNING *;`,
            [userId, phoneNumber, country, twilioSid]
        );
        return toCamelCase(result.rows[0]) as IPhoneNumber;
    }

    /**
     *
     *
     * @static
     * @param {number} phoneNumberId
     * @param {number} userId
     * @return {*}  {(Promise<IPhoneNumber | null>)}
     * @memberof PhoneNumber
     */
    static async findById(phoneNumberId: number, userId: number): Promise<IPhoneNumber | null> {
        const result = await pool.query(
            `SELECT * FROM phone_numbers WHERE phone_number_id = $1 AND user_id = $2 AND deleted_at IS NULL;`,
            [phoneNumberId, userId]
        );
        if (result.rows.length > 0) {
            return toCamelCase(result.rows[0]) as IPhoneNumber;
        } else {
            return null;
        }
    }

    /**
     *
     *
     * @static
     * @param {number} userId
     * @return {*} 
     * @memberof PhoneNumber
     */
    static async findByUserId(userId: number): Promise<IPhoneNumber[]> {
        const phoneNumbers = await pool.query(
            `SELECT * FROM phone_numbers WHERE user_id = $1 AND deleted_at IS NULL;;`,
            [userId]
        );
        return toCamelCase(phoneNumbers.rows) as IPhoneNumber[];
    }

    /**
     * Looks up an active (sendable) number owned by the user, by its E.164 string.
     */
    static async findActiveByNumber(userId: number, phoneNumber: string): Promise<IPhoneNumber | null> {
        const result = await pool.query(
            `SELECT * FROM phone_numbers WHERE user_id = $1 AND phone_number = $2 AND is_active = true AND deleted_at IS NULL;`,
            [userId, phoneNumber]
        );
        return result.rows.length > 0 ? (toCamelCase(result.rows[0]) as IPhoneNumber) : null;
    }

    /**
     * Reconciles a user's rows with the numbers their connected Twilio
     * account actually owns: rows whose twilio_sid is in the list become
     * active, the rest become inactive. Soft-deleted rows are untouched,
     * and is_active is flipped (not deleted_at) so a number transferred
     * into the account later simply becomes active again on the next sync.
     */
    static async syncActiveByTwilioSids(userId: number, ownedTwilioSids: string[]): Promise<void> {
        await pool.query(
            `UPDATE phone_numbers
             SET is_active = (twilio_sid = ANY($2::text[]))
             WHERE user_id = $1 AND deleted_at IS NULL;`,
            [userId, ownedTwilioSids]
        );
    }

    /**
     *
     *
     * @static
     * @param {number} phoneNumberId
     * @param {number} userId
     * @return {*}  {Promise<IPhoneNumber>}
     * @memberof PhoneNumber
     */
    static async deactivate(phoneNumberId: number, userId: number): Promise<IPhoneNumber> {
        const result = await pool.query(
            `UPDATE phone_numbers SET is_active = false, deleted_at = NOW() WHERE phone_number_id = $1 AND user_id = $2 RETURNING *;`,
            [phoneNumberId, userId]
        );
        return toCamelCase(result.rows[0]) as IPhoneNumber;
    }
}
export default PhoneNumber;