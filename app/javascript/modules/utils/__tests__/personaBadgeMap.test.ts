import { getPersonaBadgePath } from '../personaBadgeMap'

describe('getPersonaBadgePath', () => {
  describe('single style personas', () => {
    it('returns correct badge for D persona', () => {
      expect(getPersonaBadgePath('D')).toBe('badge-relentless-attacker.png')
    })

    it('returns correct badge for I persona', () => {
      expect(getPersonaBadgePath('I')).toBe('badge-charismatic-shotmaker.png')
    })

    it('returns correct badge for S persona', () => {
      expect(getPersonaBadgePath('S')).toBe('badge-smooth-rhythm-player.png')
    })

    it('returns correct badge for C persona', () => {
      expect(getPersonaBadgePath('C')).toBe('badge-master-strategist.png')
    })
  })

  describe('combination personas', () => {
    it('returns correct badge for DI persona', () => {
      expect(getPersonaBadgePath('DI')).toBe('badge-electric-playmaker.png')
    })

    it('returns correct badge for DS persona', () => {
      expect(getPersonaBadgePath('DS')).toBe('badge-controlled-aggressor.png')
    })

    it('returns correct badge for CD persona', () => {
      expect(getPersonaBadgePath('CD')).toBe('badge-attacking-analyst.png')
    })

    it('returns correct badge for DC persona (same as CD)', () => {
      expect(getPersonaBadgePath('DC')).toBe('badge-attacking-analyst.png')
    })

    it('returns correct badge for IS persona', () => {
      expect(getPersonaBadgePath('IS')).toBe('badge-positive-rhythm-player.png')
    })

    it('returns correct badge for IC persona', () => {
      expect(getPersonaBadgePath('IC')).toBe('badge-imiginitive-planner.png')
    })

    it('returns correct badge for SC persona', () => {
      expect(getPersonaBadgePath('SC')).toBe('badge-steady-technician.png')
    })
  })

  describe('balanced persona', () => {
    it('returns correct badge for BALANCED persona', () => {
      expect(getPersonaBadgePath('BALANCED')).toBe('badge-complete-game-planner.png')
    })
  })

  describe('edge cases and fallback', () => {
    it('returns default badge for unknown persona code', () => {
      expect(getPersonaBadgePath('UNKNOWN')).toBe('base-badge-medallion.png')
    })

    it('returns default badge for empty string', () => {
      expect(getPersonaBadgePath('')).toBe('base-badge-medallion.png')
    })

    it('returns default badge for invalid code', () => {
      expect(getPersonaBadgePath('XYZ')).toBe('base-badge-medallion.png')
    })

    it('returns default badge for partial code', () => {
      expect(getPersonaBadgePath('DIA')).toBe('base-badge-medallion.png')
    })
  })
})

