import pool from "../database/database.js"
import senhaHash from "../password/password.js";

async function createInicialUserAdmin() {
    const { rows} = await pool.query("SELECT * FROM operario WHERE admin_bool = true LIMIT 1")
    if (rows.length > 0) {
        return
    }

    const senhaComHash = await senhaHash("123456")

    const queryTexto: string = `
    INSERT INTO operario (nome, cpf, senha_hash, email, admin_bool)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`
    
    const resultado = await pool.query(queryTexto, ["Admin", "999.999.999-99", senhaComHash, "admin@exemplo.com", true])
    const novoOperario = resultado.rows[0]
    return novoOperario
}

export default createInicialUserAdmin