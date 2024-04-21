import { toCamelCase } from 'helpers/dbUtils';
import pool from '../config/db';
import { IContact, ContactUpdates } from '../types/interfaces';

/**
 *
 *
 * @class Contact
 */
class Contact {
    /**
     *
     *
     * @static
     * @param {number} userId
     * @param {string} name
     * @param {string} phoneNumber
     * @return {*}  {Promise<IContact>}
     * @memberof Contact
     */
    static async create(userId: number, name: string, phoneNumber: string): Promise<IContact> {
        const newContact = await pool.query(
            `INSERT INTO contacts (user_id, name, phone_number) VALUES ($1, $2, $3) RETURNING *;`,
            [userId, name, phoneNumber]
        );
        return toCamelCase(newContact.rows[0]) as IContact;
    }

    /**
     *
     *
     * @static
     * @param {number} userId
     * @return {*}  {Promise<IContact[]>}
     * @memberof Contact
     */
    static async findByUserId(userId: number): Promise<IContact[]> {
        const contacts = await pool.query(
            `SELECT * FROM contacts WHERE user_id = $1 AND deleted_at IS NULL;`,
            [userId]
        );
        return contacts.rows as IContact[];
    }

    /**
     *
     *
     * @static
     * @param {number} campaignId
     * @return {*}  {Promise<IContact[]>}
     * @memberof Contact
     */
    static async findByCampaignId(campaignId: number): Promise<IContact[]> {
        const contacts = await pool.query(
            `SELECT * FROM contacts WHERE campaign_id = $1 AND deleted_at IS NULL;`,
            [campaignId]
        );
        return contacts.rows as IContact[];
    }

    /**
     *
     *
     * @static
     * @param {number} contactId
     * @param {number} userId
     * @param {ContactUpdates} updates
     * @return {*}  {(Promise<IContact | null>)}
     * @memberof Contact
     */
    static async update(contactId: number, userId: number, updates: ContactUpdates): Promise<IContact | null> {

        const setParts: string[] = [];
        const values: (string | number | undefined)[] = [];
        const allowedFields = ['name', 'phoneNumber'];
    
        // Dynamically build the SQL update statement
        Object.keys(updates).forEach((key, index) => {
            if (allowedFields.includes(key)) {
                setParts.push(`${key} = $${index + 2}`); 
                values.push(updates[key as keyof ContactUpdates]);
            }
        });
    
        if (setParts.length > 0) {
            const result = await pool.query(
                `UPDATE contacts SET ${setParts.join(', ')} WHERE contact_id = $1 AND user_id = $2 RETURNING *;`,
                [contactId, userId, ...values]
            );
            if (result.rows.length > 0) {
                return toCamelCase(result.rows[0]) as IContact;
            }
            return null;
        }
        return null;
    }

    /**
     *
     *
     * @static
     * @param {number} contactId
     * @param {number} userId
     * @return {*}  {(Promise<number | null>)}
     * @memberof Contact
     */
    static async delete(contactId: number, userId: number): Promise<number | null> {
        const result = await pool.query(
            `UPDATE contacts SET deleted_at = NOW() WHERE contact_id = $1 AND user_id = $2 AND deleted_at IS NULL;`,
            [contactId, userId]
        );
        return result.rowCount;
    }
}
export default Contact;