import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { App } from '../top/App'

test('色が未選択のとき、検索ボタンが無効になっている', () => {
  render(<App />)

  const searchButton = screen.getByRole('button', {
    name: 'この色の配色を見る →',
  })

  expect(searchButton).toBeDisabled()
})
