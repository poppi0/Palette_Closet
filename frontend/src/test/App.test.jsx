import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { App } from '../top/App'

const colors = [
  {
    id: 1,
    name: '赤',
    hex_code: '#FF0000',
    tone: { id: 1, name: 'ビビッド' },
  },
  {
    id: 2,
    name: '青',
    hex_code: '#0000FF',
    tone: { id: 1, name: 'ビビッド' },
  },
  {
    id: 3,
    name: '白',
    hex_code: '#FFFFFF',
    tone: null,
  },
]

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => colors,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('色が未選択のとき、検索ボタンが無効になっている', () => {
  render(<App />)

  const searchButton = screen.getByRole('button', {
    name: 'この色の配色を見る →',
  })

  expect(searchButton).toBeDisabled()
})
