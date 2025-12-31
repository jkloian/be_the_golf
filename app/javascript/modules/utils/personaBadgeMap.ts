/**
 * Maps persona codes to their corresponding badge PNG filenames
 * Note: CD and DC both map to the same badge (Attacking Analyst)
 */
export function getPersonaBadgePath(personaCode: string): string {
  const badgeMap: Record<string, string> = {
    D: 'badge-relentless-attacker.png',
    I: 'badge-charismatic-shotmaker.png',
    S: 'badge-smooth-rhythm-player.png',
    C: 'badge-master-strategist.png',
    DI: 'badge-electric-playmaker.png',
    DS: 'badge-controlled-aggressor.png',
    CD: 'badge-attacking-analyst.png',
    DC: 'badge-attacking-analyst.png', // Same as CD
    IS: 'badge-positive-rhythm-player.png',
    IC: 'badge-imiginitive-planner.png',
    SC: 'badge-steady-technician.png',
    BALANCED: 'badge-complete-game-planner.png',
  }

  return badgeMap[personaCode] || 'base-badge-medallion.png'
}

