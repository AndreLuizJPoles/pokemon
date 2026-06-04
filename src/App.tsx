import './App.css'
import { Pokemon } from './components/Pokemon'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Meu APP de Pokédex</h1>
        <p className="app__subtitle">Explore stats, evoluções e curiosidades dos Pokémon</p>
      </header>
      <section className="app__content">
        <Pokemon />
      </section>
    </main>
  )
}

export default App
