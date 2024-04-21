import { IResponseCategorization } from 'types/interfaces';
import pool from '../config/db';
import { toCamelCase } from '../helpers/dbUtils';

/**
 *
 *
 * @class ResponseCategorization
 */
class ResponseCategorization {
    /**
     *
     *
     * @static
     * @param {number} responseId
     * @param {number} categoryId
     * @return {*}  {Promise<IResponseCategorization>}
     * @memberof ResponseCategorization
     */
    static async create(responseId: number, categoryId: number): Promise<IResponseCategorization> {
        const result = await pool.query(
            `INSERT INTO response_categorizations (response_id, category_id)
             VALUES ($1, $2) RETURNING *;`,
            [responseId, categoryId]
        );
        return toCamelCase(result.rows[0]) as IResponseCategorization;
    }
}

export default ResponseCategorization;