import { pokeapiClient } from "./pokeapiClient"
import { pokeapiEndpoints } from "./pokeapiEndpoints"

export const pokeapiService = {
  getPokemon: async (name: string) => {
    const response = await pokeapiClient.get(pokeapiEndpoints.pokemon.pokemon(name))
    return response.data
  }
}