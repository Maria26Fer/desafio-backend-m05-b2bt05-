CREATE TABLE usuarios (
id serial primary key,
nome varchar(255) not null,
email varchar(255) not null unique,
senha varchar(255) not null
);

CREATE TABLE categorias (
id serial primary key unique,
descricao varchar(255)
);

INSERT INTO categorias (descricao)
VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

CREATE TABLE produtos (
id serial primary key,
descricao varchar(255) not null,
quantidade_estoque int not null,
valor int not null,
categoria_id int REFERENCES categorias(id) not null
)

CREATE TABLE clientes (
id serial primary key,
nome varchar(255) not null,
email varchar(255) unique not null,
cpf varchar(15) unique not null,
cep varchar(10),
rua varchar(255),
numero varchar(50),
bairro varchar(255),
cidade varchar(255),
estado varchar(255)
)