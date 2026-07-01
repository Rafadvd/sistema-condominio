import bcrypt from "bcrypt";

export async function senhaHash(senha: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(senha, saltRounds);
}

export default senhaHash;