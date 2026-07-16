DROP TABLE IF EXISTS liberacao;
DROP TABLE IF EXISTS condomino;
DROP TABLE IF EXISTS operario;

create table operario(
id SERIAL primary key, 
nome VARCHAR(100) not null, 
cpf VARCHAR(15) not null UNIQUE,
email VARCHAR(100) not null UNIQUE,
senha_hash VARCHAR(100) not null,
admin_bool BOOLEAN not null);

create table condomino(
id SERIAL primary key, 
lote VARCHAR (50) not null,
nome VARCHAR(100) not null, 
cpf VARCHAR(15) not null UNIQUE,
telefone VARCHAR(20) not null UNIQUE,
senha_hash VARCHAR(100) not null);

create table liberacao(
-- IDs da requizição
id SERIAL primary key, 
id_condomino INT not null,
id_operario_entrada INT,
id_operario_saida INT,
-- Visitante infos
tipo_visitante VARCHAR(50),
nome_visitante VARCHAR(50),
cpf_visitante VARCHAR(50),
rg_visitante VARCHAR(50),
placa_visitante VARCHAR(20),
--Status
data_hora_criacao TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP,
data_hora_expiracao TIMESTAMP not null,
status_entrada BOOLEAN not null DEFAULT FALSE,
data_hora_entrada TIMESTAMP,
data_hora_saida TIMESTAMP,
--Ligação com outras tabelas
CONSTRAINT fk_liberacao_condominio FOREIGN KEY (id_condomino) REFERENCES condomino(id),
CONSTRAINT fk_liberacao_operario_entrada FOREIGN KEY (id_operario_entrada) REFERENCES operario(id),
CONSTRAINT fk_liberacao_operario_saida FOREIGN KEY (id_operario_saida) REFERENCES operario(id),
);
