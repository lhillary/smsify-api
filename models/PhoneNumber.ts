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
            `INSERT INTO phone_numbers (user_id, phone_number, country, twilio_sid, purchased_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *;`,
            [userId, phoneNumber, country, twilioSid]
        );
        return result.rows[0] as IPhoneNumber;
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
            return result.rows[0] as IPhoneNumber;
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
    static async findByUserId(userId: number) {
        const phoneNumbers = await pool.query(
            `SELECT * FROM phone_numbers WHERE user_id = $1 AND deleted_at IS NULL;;`,
            [userId]
        );
        return phoneNumbers.rows;
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
        return result.rows[0] as IPhoneNumber;
    }
}
export default PhoneNumber;