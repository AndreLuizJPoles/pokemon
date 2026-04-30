export const pokeapiEndpoints = {
  pokemon: {
    pokemon: (name: string) => `/pokemon/${name}`,
  },
  types: {
    types: (name: string) => `/type/${name}`,
  },
}