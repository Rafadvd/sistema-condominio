import senhaHash from "./password.js";

let senha: string = "12345678";

let senha_com_hash = await senhaHash(senha);

console.log(senha_com_hash);