import pool from "../database/database.js"
import senhaHash from "../password/password.js";

async function createInicialUserCondomino() {
    const { rows} = await pool.query("SELECT * FROM condomino LIMIT 1")
    if (rows.length > 0) {
        return
    }


    const senhaComHash = await senhaHash("123456")

    const queryTexto: string = `
    INSERT INTO condomino (lote, nome, cpf, senha_hash, telefone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`
    
    const resultado = await pool.query(queryTexto, ["Q-12", "Condomino", "111.111.111-11", senhaComHash, "51912345678"])
    const novoOperario = resultado.rows[0]
    return novoOperario
}

export default createInicialUserCondomino