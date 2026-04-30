export const pokeapiEndpoints = {
  pokemon: {
    pokemon: (name: string) => `/pokemon/${name}`,
  },
  types: {
    types: (name: string) => `/type/${name}`,
  },
  species: {
    species: (name: string) => `/pokemon-species/${name}`,
  },
}