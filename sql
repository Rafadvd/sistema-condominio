create table operario(
id SERIAL primary key, 
nome VARCHAR(50) not null, 
cpf VARCHAR(15) not null UNIQUE,
email VARCHAR(100) not null UNIQUE,
senha_hash VARCHAR(100) not null,
admin_bool boolean() not null);

create table condomino(
id SERIAL primary key, 
lote VARCHAR (50) not null,
nome VARCHAR(50) not null, 
cpf VARCHAR(15) not null UNIQUE,
numero VARCHAR(20) not null UNIQUE,
senha_hash VARCHAR(100) not null);

create table condomino(
id SERIAL primary key, 
cpf_condomino
nome_condomino
tipo_visitante
tipo_customizado
nome_visitante
cpf_visitante
placa_visitante
data_hora_criacao
data_hora_expiracao
satus
id_operario
data_hora_entrada
data_hora_saída