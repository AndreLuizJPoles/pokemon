# Pokédex

Aplicação web para consultar informações de Pokémon usando a [PokeAPI](https://pokeapi.co/).

## Funcionalidades

- Busca por nome ou ID
- Pokémon aleatório e navegação entre entradas da Pokédex
- Tipos com ícones oficiais (Scarlet/Violet)
- Fraquezas e resistências combinadas corretamente para Pokémon de tipo duplo
- Habilidades, status base, movimentos e texto da Pokédex
- Cadeia evolutiva, variantes shiny e cry do Pokémon

## Tecnologias

- React 19 + TypeScript
- Vite
- Axios

## Como executar

```bash
yarn install
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Scripts

| Comando        | Descrição                    |
| -------------- | ---------------------------- |
| `yarn dev`     | Servidor de desenvolvimento  |
| `yarn build`   | Build de produção            |
| `yarn preview` | Preview do build             |
| `yarn lint`    | Verificação com ESLint       |

## Estrutura do projeto

```
src/
├── api/pokeapi/       # Cliente e serviços da PokeAPI
├── components/        # Componentes React (Pokemon, Card)
└── utils/             # Utilitários (cálculo de efetividade de tipos)
```

## Efetividade de tipos

Para Pokémon com mais de um tipo, fraquezas e resistências são calculadas multiplicando a efetividade de cada tipo defensor. Por exemplo, Zapdos (Elétrico/Voador) não é fraco contra Elétrico: Voador sofre dano dobrado, mas Elétrico reduz esse dano pela metade, resultando em dano neutro.
