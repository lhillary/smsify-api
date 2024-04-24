import { toCamelCase } from '../helpers/dbUtils';
import pool from '../config/db';
import { IContact, ContactUpdates, UpdateKeys, FieldMappings } from '../types/interfaces';

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
    static async create(userId: number, name: string, phoneNumber: string, campaignId: number): Promise<IContact> {
        const newContact = await pool.query(
            `INSERT INTO contacts (user_id, name, phone_number, campaign_id) VALUES ($1, $2, $3, $4) RETURNING *;`,
            [userId, name, phoneNumber, campaignId]
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
        return toCamelCase(contacts.rows) as IContact[];
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const values: any[] = [contactId, userId]; 
	
		const fieldMappings: FieldMappings = {
			name: 'name',
			phoneNumber: 'phone_number',
		};
	
		// Dynamically build the SQL update statement
		Object.entries(updates).forEach(([key, value]) => {
			if (fieldMappings[key as UpdateKeys]) {
				setParts.push(`${fieldMappings[key as UpdateKeys]} = $${values.length + 1}`);
				values.push(value);
			}
		});
	
		if (setParts.length > 0) {
			const queryString = `UPDATE contacts SET ${setParts.join(', ')} WHERE contact_id = $1 AND user_id = $2 RETURNING *;`;
			try {
				const result = await pool.query(queryString, values);
				if (result.rows.length > 0) {
					return toCamelCase(result.rows[0]) as IContact;
				}
				return null;
			} catch (error) {
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