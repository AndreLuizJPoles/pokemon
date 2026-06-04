import { pokeapiClient } from "./pokeapiClient"
import { pokeapiEndpoints } from "./pokeapiEndpoints"

export const pokeapiService = {
  getPokemon: async (name: string) => {
    const response = await pokeapiClient.get(pokeapiEndpoints.pokemon.pokemon(name))
    return response.data
  },
  getType: async (name: string) => {
    const response = await pokeapiClient.get(pokeapiEndpoints.types.types(name))
    return response.data
  },
  getSpecies: async (name: string) => {
    const response = await pokeapiClient.get(pokeapiEndpoints.species.species(name))
    return response.data
  },
  getEvolutionChain: async (url: string) => {
    const response = await pokeapiClient.get(url)
    return response.data
  }
}