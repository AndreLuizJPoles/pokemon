import { useState } from 'react'
import { pokeapiService } from '../api/pokeapi/pokeapiService'
import { Card } from './Card'
import './Pokemon.css'

export type PokemonData = {
  id: number
  name: string
  height: number
  weight: number
  image: string
  types: string[]
}

type PokemonTypeEntry = {
  type: {
    name: string
  }
}

export function Pokemon() {
  const [pokemonName, setPokemonName] = useState('')
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
        types: data.types.map((type: PokemonTypeEntry) => type.type.name),
      })
    } catch {
      setPokemon(null)
      setError('Nao foi possivel buscar esse Pokemon.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pokemon">
      <h2 className='pokemon__title'>Busque por um Pokemon</h2>
      <div className="pokemon__controls">
        <input
          type="text"
          value={pokemonName}
          onChange={(event) => setPokemonName(event.target.value)}
          placeholder="Ex: pikachu"
        />
        <button type="button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Pokemon'}
        </button>
      </div>

      {error && <p>{error}</p>}

      {pokemon && <Card pokemon={pokemon} />}
    </section>
  )
}
