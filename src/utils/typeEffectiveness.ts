type TypeDamageRelations = {
  double_damage_from: { name: string }[]
  half_damage_from: { name: string }[]
  no_damage_from: { name: string }[]
}

type TypeWithDamageRelations = {
  damage_relations?: TypeDamageRelations
}

function getMultiplierAgainstType(
  attackingType: string,
  defendingType: TypeWithDamageRelations,
): number {
  const relations = defendingType.damage_relations
  if (!relations) {
    return 1
  }

  if (relations.no_damage_from.some((type) => type.name === attackingType)) {
    return 0
  }

  if (relations.double_damage_from.some((type) => type.name === attackingType)) {
    return 2
  }

  if (relations.half_damage_from.some((type) => type.name === attackingType)) {
    return 0.5
  }

  return 1
}

function collectAttackingTypes(defendingTypes: TypeWithDamageRelations[]): Set<string> {
  const attackingTypes = new Set<string>()

  defendingTypes.forEach((typeData) => {
    typeData.damage_relations?.double_damage_from.forEach((type) =>
      attackingTypes.add(type.name),
    )
    typeData.damage_relations?.half_damage_from.forEach((type) =>
      attackingTypes.add(type.name),
    )
    typeData.damage_relations?.no_damage_from.forEach((type) =>
      attackingTypes.add(type.name),
    )
  })

  return attackingTypes
}

export function getCombinedTypeEffectiveness(defendingTypes: TypeWithDamageRelations[]) {
  const weaknesses: string[] = []
  const resistances: string[] = []

  collectAttackingTypes(defendingTypes).forEach((attackingType) => {
    const multiplier = defendingTypes.reduce(
      (total, defendingType) =>
        total * getMultiplierAgainstType(attackingType, defendingType),
      1,
    )

    if (multiplier >= 2) {
      weaknesses.push(attackingType)
    } else if (multiplier <= 0.5) {
      resistances.push(attackingType)
    }
  })

  return { weaknesses, resistances }
}
