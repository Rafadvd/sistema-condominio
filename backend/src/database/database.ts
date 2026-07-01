import pg from "pg";

const pool = new pg.Pool({
    user: 'admin',
    host: 'localhost',
    database: 'condominio',
    password: 'admin123',
    port: 5432
});

export default pool;