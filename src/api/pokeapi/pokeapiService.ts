import { pokeapiClient } from "./pokeapiClient"
import { pokeapiEndpoints } from "./pokeapiEndpoints"

export const pokeapiService = {
  getPokemon: async (name: string) => {
    const response = await pokeapiClient.get(pokeapiEndpoints.pokemon.pokemon(name))

    console.log(response.data)

    return response.data
  },
  getType: async (name: string) => {
    const response = await pokeapiClient.get(pokeapiEndpoints.types.types(name))

    console.log(response.data)

    return response.data
  }
}