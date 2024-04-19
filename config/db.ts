import { Pool } from "pg";
import * as dotevnv from "dotenv"
dotevnv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT as string, 10),
    // Adding SSL config if you connect to a production database that requires SSL:
    // ssl: {
    //   rejectUnauthorized: false
    // }
});
export default pool;