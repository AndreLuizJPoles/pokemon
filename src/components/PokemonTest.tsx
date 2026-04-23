import { useState } from 'react'
import { pokeapiService } from '../api/pokeapi/pokeapiService'

type PokemonData = {
  id: number
  name: string
  height: number
  weight: number
  image: string
}

export function PokemonTest() {
  const [pokemonName, setPokemonName] = useState('pikachu')
  const [pokemon, setPokemon] = useState<PokemonData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    const normalizedName = pokemonName.trim().toLowerCase()
    if (!normalizedName) {
      setError('Digite o nome de um Pokemon.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await pokeapiService.getPokemon(normalizedName)
      setPokemon({
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        image: data.sprites.front_default,
      })
    } catch {
      setPokemon(null)
      setError('Nao foi possivel buscar esse Pokemon.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Teste da PokeAPI</h2>
      <input
        type="text"
        value={pokemonName}
        onChange={(event) => setPokemonName(event.target.value)}
        placeholder="Ex: pikachu"
      />
      <button type="button" onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar Pokemon'}
      </button>

      {error && <p>{error}</p>}

      {pokemon && (
        <div>
          <p>Nome: {pokemon.name}</p>
          <p>ID: {pokemon.id}</p>
          <p>Altura: {pokemon.height}</p>
          <p>Peso: {pokemon.weight}</p>
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
      )}
    </section>
  )
}
