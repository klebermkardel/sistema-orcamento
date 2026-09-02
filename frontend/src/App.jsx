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

    </div>
  );
}

export default App;
