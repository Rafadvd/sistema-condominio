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
id SERIAL primary key, 
id_condomino INT not null,
tipo_visitante VARCHAR(50),
tipo_customizado VARCHAR(50),
nome_visitante VARCHAR(50),
cpf_visitante VARCHAR(50),
placa_visitante VARCHAR(20),
data_hora_criacao TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP,
data_hora_expiracao TIMESTAMP not null,
status_entrada BOOLEAN not null DEFAULT FALSE,
id_operario INT,
data_hora_entrada TIMESTAMP,
data_hora_saida TIMESTAMP,

CONSTRAINT fk_liberacao_condominio FOREIGN KEY (id_condomino) REFERENCES condomino(id),
CONSTRAINT fk_liberacao_operario FOREIGN KEY (id_operario) REFERENCES operario(id)
);
