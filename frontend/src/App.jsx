import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [termo, setTermo] = useState('');
  const [produtos, setProdutos] = useState([]);

  // Dispara a busca na API sempre que o atendente digitar algo
  useEffect(() => {
    if (termo.trim() === '') {
      setProdutos([]);
      return;
    }

    fetch(`http://localhost:3000/api/pesquisa?termo=${termo}`)
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error("Erro ao buscar dados:", err));
  }, [termo]);

  return (
    <div className="container">
      <header>
        <h1>🖥️ Sistema de Orçamentos Fast-Track</h1>
        <p>Busque peças de informática em tempo real enquanto atende o cliente.</p>
      </header>

      {/* Campo de Pesquisa Inteligente */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Digite o nome da peça (Ex: RTX 4060, Ryzen)..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          autoFocus
        />
      </div>

      {/* Tabela de Resultados do Estoque */}
      <main className="results-container">
        {produtos.length > 0 ? (
          <table className="products-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço Unificado</th>
                <th>Loja / Filial</th>
                <th>Qtd Disponível</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.nome}</strong></td>
                  <td><span className="badge">{item.categoria}</span></td>
                  <td>R$ {item.preco_custo.toFixed(2)}</td>
                  <td>{item.nome_loja}</td>
                  <td className={item.quantidade > 0 ? "em-estoque" : "sem-estoque"}>
                    {item.quantidade} un
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          termo && <p className="no-results">Nenhum produto encontrado no estoque para "{termo}".</p>
        )}
      </main>
    </div>
  );
}

export default App;
