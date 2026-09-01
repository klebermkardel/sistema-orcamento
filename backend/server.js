const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());

let db;

async function iniciarBanco() {
    db = await open({
        filename: './estoque.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome TEXT, 
            categoria TEXT,
            preco_custo REAL
        );
        CREATE TABLE IF NOT EXISTS lojas (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome_loja TEXT
        );
        CREATE TABLE IF NOT EXISTS estoque (
            produto_id INTEGER,
            loja_id INTEGER,
            quantidade INTEGER,
            FOREIGN KEY(produto_id) REFERENCES produtos(id),
            FOREIGN KEY(loja_id) REFERENCES lojas(id)
        );
    `);

    const totalProdutos = await db.get('SELECT COUNT(*) as count FROM produtos');

    if (totalProdutos.count === 0) {
        await db.run("INSERT INTO produtos (nome, categoria, preco_custo) VALUES ('Processador AMD Ryzen 5 5600', 'Processador', 850.00)");
        await db.run("INSERT INTO produtos (nome, categoria, preco_custo) VALUES ('Placa de Vídeo RTX 4060', 'Placa de Vídeo', 1999.00)");
        
        await db.run("INSERT INTO lojas (nome_loja) VALUES ('Loja Matriz Centro')");
        await db.run("INSERT INTO lojas (nome_loja) VALUES ('Loja Jabaquara')");

        await db.run("INSERT INTO estoque VALUES (1, 1, 5)");
        await db.run("INSERT INTO estoque VALUES (1, 2, 2)"); 
        await db.run("INSERT INTO estoque VALUES (2, 1, 3)");
    }
}

app.get('/api/pesquisa', async (req, res) => {
    const { termo } = req.query; 

    const query = `
        SELECT p.nome, p.categoria, p.preco_custo, l.nome_loja, e.quantidade
        FROM estoque e
        JOIN produtos p ON e.produto_id = p.id
        JOIN lojas l ON e.loja_id = l.id
        WHERE p.nome LIKE ?
    `;

    try {
        const resultados = await db.all(query, [`%${termo}%`]);
        res.json(resultados);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar no estoque.' });
    }
});

iniciarBanco().then(() => {
    app.listen(3000, () => console.log('Back-end rodando em http://localhost:3000'));
});
