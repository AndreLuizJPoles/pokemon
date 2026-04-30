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

type PokemonSpeciesResponse = {
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
    }
  }[]
  genera: {
    genus: string
    language: {
      name: string
    }
  }[]
  is_legendary: boolean
  is_mythical: boolean
  evolution_chain?: {
    url: string
  }
}

type EvolutionChainNode = {
  species: {
    name: string
  }
  evolves_to: EvolutionChainNode[]
}

type EvolutionChainResponse = {
  chain: EvolutionChainNode
}

export function Card({ pokemon }: { pokemon: PokemonData }) {
  const [typesWithIcon, setTypesWithIcon] = useState<PokemonTypeWithIcon[]>([])
  const [showShiny, setShowShiny] = useState(false)
  const [flavorText, setFlavorText] = useState('')
  const [genus, setGenus] = useState('')
  const [isLegendary, setIsLegendary] = useState(false)
  const [isMythical, setIsMythical] = useState(false)
  const [evolutionPaths, setEvolutionPaths] = useState<string[][]>([])

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

  useEffect(() => {
    const fetchSpeciesAndEvolution = async () => {
      const speciesData: PokemonSpeciesResponse = await pokeapiService.getSpecies(pokemon.name)
      const ptFlavor = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'pt-br',
      )
      const enFlavor = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'en',
      )
      const ptGenus = speciesData.genera.find((entry) => entry.language.name === 'pt-br')
      const enGenus = speciesData.genera.find((entry) => entry.language.name === 'en')

      setFlavorText((ptFlavor?.flavor_text ?? enFlavor?.flavor_text ?? '').replace(/\s+/g, ' ').trim())
      setGenus(ptGenus?.genus ?? enGenus?.genus ?? '')
      setIsLegendary(speciesData.is_legendary)
      setIsMythical(speciesData.is_mythical)

      const evolutionUrl = speciesData.evolution_chain?.url
      if (!evolutionUrl) {
        setEvolutionPaths([])
        return
      }

      const evolutionData: EvolutionChainResponse = await pokeapiService.getEvolutionChain(evolutionUrl)
      const nextEvolutionPaths = buildEvolutionPaths(evolutionData.chain)
      setEvolutionPaths(nextEvolutionPaths)
    }

    fetchSpeciesAndEvolution()
  }, [pokemon.name])

  const displayImage =
    (showShiny ? pokemon.shinyImage : null) ??
    pokemon.officialArtwork ??
    pokemon.image

  return (
    <div className="card">
      {displayImage && (
        <img className="card__pokemon-image" src={displayImage} alt={pokemon.name} />
      )}
      <h2>{pokemon.name}</h2>
      <p>ID: {pokemon.id} | XP base: {pokemon.baseExperience}</p>
      <p>Altura: {pokemon.height} | Peso: {pokemon.weight}</p>
      {genus && <p>{genus}</p>}
      {(isLegendary || isMythical) && (
        <p>{isMythical ? 'Pokemon Mitico' : 'Pokemon Lendario'}</p>
      )}

      <label className="card__shiny-toggle">
        <span>Shiny</span>
        <input
          className="card__shiny-toggle-input"
          type="checkbox"
          checked={showShiny}
          onChange={(event) => setShowShiny(event.target.checked)}
          disabled={!pokemon.shinyImage}
        />
        <span className="card__shiny-toggle-slider" />
      </label>

      <div className="card__types">
        {typesWithIcon.map((type) => (
          <div key={type.name} className="card__type-item">
            {type.icon && (
              <img className="card__type-icon" src={type.icon} alt={type.name} />
            )}
            <span>{type.name}</span>
          </div>
        ))}
      </div>

      <div className="card__section">
        <h3>Habilidades</h3>
        {pokemon.abilities.map((ability) => (
          <p key={ability.name}>
            {ability.name}
            {ability.isHidden ? ' (hidden)' : ''}
          </p>
        ))}
      </div>

      <div className="card__section">
        <h3>Status Base</h3>
        {pokemon.stats.map((stat) => (
          <div key={stat.name} className="card__stat-row">
            <span>{stat.name}</span>
            <div className="card__stat-bar">
              <div className="card__stat-bar-fill" style={{ width: `${Math.min(stat.baseStat, 180) / 1.8}%` }} />
            </div>
            <strong>{stat.baseStat}</strong>
          </div>
        ))}
      </div>

      <div className="card__section">
        <h3>Moves</h3>
        <p>{pokemon.moves.join(', ')}</p>
      </div>

      {flavorText && (
        <div className="card__section">
          <h3>Pokedex</h3>
          <p>{flavorText}</p>
        </div>
      )}

      {evolutionPaths.length > 0 && (
        <div className="card__section">
          <h3>Evoluções</h3>
          {evolutionPaths.map((path) => (
            <p key={path.join('-')}>{path.join(' -> ')}</p>
          ))}
        </div>
      )}

      {pokemon.cries && (
        <div className="card__section">
          <h3>Cry</h3>
          <audio controls src={pokemon.cries}>
            Seu navegador nao suporta audio.
          </audio>
        </div>
      )}
    </div>
  )
}

function buildEvolutionPaths(node: EvolutionChainNode): string[][] {
  if (node.evolves_to.length === 0) {
    return [[node.species.name]]
  }

  return node.evolves_to.flatMap((child) =>
    buildEvolutionPaths(child).map((path) => [node.species.name, ...path]),
  )
}