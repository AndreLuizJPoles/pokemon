import type { PokemonData } from './Pokemon'
import './Card.css'
import { pokeapiService } from '../api/pokeapi/pokeapiService'
import { useEffect, useState } from 'react'

type TypeApiResponse = {
  sprites?: {
    'generation-ix'?: {
      'scarlet-violet'?: {
        name_icon?: string | null
      }
    }
  }
}

type PokemonTypeWithIcon = {
  name: string
  icon: string | null
}

export function Card({ pokemon }: { pokemon: PokemonData }) {
  const [typesWithIcon, setTypesWithIcon] = useState<PokemonTypeWithIcon[]>([])

  useEffect(() => {
    const fetchTypes = async () => {
      const responses = await Promise.all(
        pokemon.types.map((typeName) => pokeapiService.getType(typeName)),
      )

      const nextTypesWithIcon = responses.map(
        (typeData: TypeApiResponse, index): PokemonTypeWithIcon => ({
          name: pokemon.types[index],
          icon:
            typeData.sprites?.['generation-ix']?.['scarlet-violet']?.name_icon ??
            null,
        }),
      )

      setTypesWithIcon(nextTypesWithIcon)
    }

    fetchTypes()
  }, [pokemon.types])

  return (
    <div className="card">
      <img className="card__pokemon-image" src={pokemon.image} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>
      <p>ID: {pokemon.id}</p>
      <p>Altura: {pokemon.height}</p>
      <p>Peso: {pokemon.weight}</p>
      <div className="card__types">
        {typesWithIcon.map((type) => (
          <div key={type.name} className="card__type-item">
            {type.icon && (
              <img className="card__type-icon" src={type.icon} alt={type.name} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}