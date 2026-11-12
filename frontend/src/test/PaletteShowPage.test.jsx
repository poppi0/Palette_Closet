import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { PaletteShowPage } from '../palette-show/PaletteShowPage'

const palette = {
  id: 42,
  base_color: { name: '赤', hex_code: '#FF0000' },
  base_ratio: 55,
  sub_color: { name: '青', hex_code: '#0000FF' },
  sub_ratio: 30,
  accent_color: { name: '白', hex_code: '#FFFFFF' },
  accent_ratio: 15,
}

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => palette,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderPaletteShowPage(
  initialEntry = '/palettes/42?color_id=12',
) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <h1>色選択</h1> },
      { path: '/palettes', element: <h1>配色一覧</h1> },
      { path: '/palettes/:id', element: <PaletteShowPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  render(<RouterProvider router={router} />)
  return router
}

test('URLの配色IDで取得し、3色の役割と割合を表示する', async () => {
  renderPaletteShowPage()

  const base = within(
    await screen.findByRole('group', { name: 'Base' }),
  )
  expect(base.getByText('赤')).toBeVisible()
  expect(base.getByText('55%')).toBeVisible()

  const sub = within(screen.getByRole('group', { name: 'Sub' }))
  expect(sub.getByText('青')).toBeVisible()
  expect(sub.getByText('30%')).toBeVisible()

  const accent = within(
    screen.getByRole('group', { name: 'Accent' }),
  )
  expect(accent.getByText('白')).toBeVisible()
  expect(accent.getByText('15%')).toBeVisible()

  expect(
    screen.getByText(
      '割合は服の枚数ではなく、見えている色の面積の目安です。',
    ),
  ).toBeVisible()

  const fetchMock = vi.mocked(globalThis.fetch)
  expect(fetchMock).toHaveBeenCalled()

  const [requestedUrl] = fetchMock.mock.calls[0]
  const url = new URL(requestedUrl, 'http://localhost:3000')

  expect(url.pathname).toBe('/api/palettes/42')
})

test('一覧に戻ると、検索した色のIDを維持している', async () => {
  const user = userEvent.setup()
  const router = renderPaletteShowPage()

  const backLink = await screen.findByRole('link', {
    name: '一覧に戻る',
  })
  await user.click(backLink)

  expect(router.state.location.pathname).toBe('/palettes')
  expect(router.state.location.search).toBe('?color_id=12')
})

test('検索した色のIDがなければ、色選択へ戻れる', async () => {
  const user = userEvent.setup()
  const router = renderPaletteShowPage('/palettes/42')

  const backLink = await screen.findByRole('link', {
    name: '色を選ぶ',
  })
  await user.click(backLink)

  expect(router.state.location.pathname).toBe('/')
})

test('配色を取得している間は読み込み中と表示する', () => {
  vi.mocked(globalThis.fetch).mockReturnValue(
    new Promise(() => {}),
  )

  renderPaletteShowPage()

  expect(screen.getByText('読み込み中…')).toBeVisible()
})

test('APIが400を返したら、配色IDのエラーを案内する', async () => {
  vi.mocked(globalThis.fetch).mockResolvedValue({
    ok: false,
    status: 400,
  })

  renderPaletteShowPage('/palettes/abc?color_id=12')

  expect(
    await screen.findByText('配色IDが正しくありません。'),
  ).toBeVisible()
})

test('APIが404を返したら、配色がないことを案内する', async () => {
  vi.mocked(globalThis.fetch).mockResolvedValue({
    ok: false,
    status: 404,
  })

  renderPaletteShowPage('/palettes/999?color_id=12')

  expect(
    await screen.findByText('配色が見つかりません。'),
  ).toBeVisible()
})

test('APIが500を返したら、取得エラーを案内する', async () => {
  vi.mocked(globalThis.fetch).mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({}),
  })

  renderPaletteShowPage()

  expect(
    await screen.findByText('配色を取得できませんでした。'),
  ).toBeVisible()
})

test('通信に失敗したら、取得エラーを案内する', async () => {
  vi.mocked(globalThis.fetch).mockRejectedValue(
    new Error('通信エラー'),
  )

  renderPaletteShowPage()

  expect(
    await screen.findByText('配色を取得できませんでした。'),
  ).toBeVisible()
})
