import axios from 'axios'
import type { AxiosInstance } from 'axios'

const apiBaseUrl = 'https://pokeapi.co/api/v2'

export const pokeapiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
