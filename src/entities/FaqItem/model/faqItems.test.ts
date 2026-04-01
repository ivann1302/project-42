import { faqItems } from './faqItems'

describe('faqItems', () => {
  it('has at least 1 item', () => {
    expect(faqItems.length).toBeGreaterThan(0)
  })

  it('every item has id, question, and answer as non-empty strings', () => {
    faqItems.forEach((item) => {
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(typeof item.question).toBe('string')
      expect(item.question.length).toBeGreaterThan(0)
      expect(typeof item.answer).toBe('string')
      expect(item.answer.length).toBeGreaterThan(0)
    })
  })

  it('all ids are unique', () => {
    const ids = faqItems.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
