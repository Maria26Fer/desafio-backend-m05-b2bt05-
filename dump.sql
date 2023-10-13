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
