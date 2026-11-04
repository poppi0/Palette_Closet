import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, MemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
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
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  const searchButton = screen.getByRole('button', {
    name: 'この色の配色を見る →',
  })

  expect(searchButton).toBeDisabled()
})

test('ビビッドの中に赤と青の色ボタンが表示される', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  const vivid = screen.getByRole('group', {
    name: 'ビビッド',
  })

  const redButton = await within(vivid).findByRole('button', {
    name: '赤',
  })
  const blueButton = await within(vivid).findByRole('button', {
    name: '青',
  })

  expect(redButton).toBeVisible()
  expect(blueButton).toBeVisible()
})

test('無彩色の中に白の色ボタンが表示される', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  const achromatic = screen.getByRole('group', {
    name: '無彩色',
  })

  const whiteButton = await within(achromatic).findByRole('button', {
    name: '白',
  })

  expect(whiteButton).toBeVisible()
})

test('色を選択し、別の色に選び直せる', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  const redButton = await screen.findByRole('button', {
    name: '赤',
  })
  const blueButton = await screen.findByRole('button', {
    name: '青',
  })

  const selectedColor = screen.getByText('色を選んでください。')

  await user.click(redButton)
  expect(selectedColor).toHaveTextContent('赤')

  await user.click(blueButton)
  expect(selectedColor).toHaveTextContent('青')
})

test('赤を選んで検索すると、赤のIDを付けたURLへ移動する', async () => {
  const user = userEvent.setup()

  const router = createMemoryRouter([
    { path: '/', element: <App /> },
    { path: '/palettes', element: <></> },
  ])

  render(<RouterProvider router={router} />)

  const redButton = await screen.findByRole('button', {
    name: '赤',
  })
  await user.click(redButton)

  const searchButton = screen.getByRole('button', {
    name: 'この色の配色を見る →',
  })
  await user.click(searchButton)

  expect(router.state.location.pathname).toBe('/palettes')
  expect(router.state.location.search).toBe('?color_id=1')
})

test('色データの取得中は読み込み中の案内が表示される', () => {
  vi.mocked(globalThis.fetch).mockReturnValue(
    new Promise(() => {})
  )

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  expect(screen.getByText('読み込み中…')).toBeVisible()
})

test('色データの取得に失敗するとエラーの案内が表示される', async () => {
  vi.mocked(globalThis.fetch).mockRejectedValue(
    new Error('通信エラー')
  )

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  expect(
    await screen.findByText('色データを取得できませんでした。')
  ).toBeVisible()
})
