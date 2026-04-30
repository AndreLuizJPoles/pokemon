import { useState } from 'react'
import { pokeapiService } from '../api/pokeapi/pokeapiService'
import { Card } from './Card'
import './Pokemon.css'

export type PokemonData = {
  id: number
  name: string
  height: number
  weight: number
  image: string | null
  shinyImage: string | null
  officialArtwork: string | null
  types: string[]
  abilities: {
    name: string
    isHidden: boolean
  }[]
  stats: {
    name: string
    baseStat: number
  }[]
  moves: string[]
  baseExperience: number
  cries: string | null
}

type PokemonTypeEntry = {
  type: {
    name: string
  }
}

type PokemonAbilityEntry = {
  is_hidden: boolean
  ability: {
    name: string
  }
}

type PokemonStatEntry = {
  base_stat: number
  stat: {
    name: string
  }
}

type PokemonMoveEntry = {
  move: {
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
        shinyImage: data.sprites.front_shiny,
        officialArtwork: data.sprites.front_default,
        types: data.types.map((type: PokemonTypeEntry) => type.type.name),
        abilities: data.abilities.map((ability: PokemonAbilityEntry) => ({
          name: ability.ability.name,
          isHidden: ability.is_hidden,
        })),
        stats: data.stats.map((stat: PokemonStatEntry) => ({
          name: stat.stat.name,
          baseStat: stat.base_stat,
        })),
        moves: data.moves
          .slice(0, 5)
          .map((move: PokemonMoveEntry) => move.move.name),
        baseExperience: data.base_experience,
        cries: data.cries?.latest ?? null,
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
      <h2 className='pokemon__title'>Busque por um Pokémon</h2>
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
