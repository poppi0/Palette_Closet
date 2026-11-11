import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { PalettesPage } from '../palettes/PalettesPage'

const palettes = [
  {
    id: 42,
    base_color: { name: 'ライトオレンジ', hex_code: '#E4C6A6' },
    base_ratio: 55,
    sub_color: { name: 'ライトオレンジ', hex_code: '#E6CD8C' },
    sub_ratio: 30,
    accent_color: { name: 'ダルオレンジ', hex_code: '#8E775D' },
    accent_ratio: 15,
  },
  {
    id: 7,
    base_color: { name: 'ライトオレンジ', hex_code: '#E1B985' },
    base_ratio: 60,
    sub_color: { name: 'ブライトイエロー', hex_code: '#FDD23E' },
    sub_ratio: 30,
    accent_color: { name: 'ダルグリーン', hex_code: '#00A08D' },
    accent_ratio: 10,
  },
]

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => palettes,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderPalettesPage() {
  const router = createMemoryRouter(
    [
      { path: '/palettes', element: <PalettesPage /> },
      { path: '/palettes/:id', element: <h1>配色詳細</h1> },
    ],
    { initialEntries: ['/palettes?color_id=12'] },
  )

  render(<RouterProvider router={router} />)
  return router
}

test('URLの色IDで取得し、届いた順に配色の3色と比率を表示する', async () => {
  renderPalettesPage()

  const list = await screen.findByRole('list', { name: '配色一覧' })
  const links = await within(list).findAllByRole('link')

  const fetchMock = vi.mocked(globalThis.fetch)
  expect(fetchMock).toHaveBeenCalled()
  const [requestedUrl] = fetchMock.mock.calls[0]
  const url = new URL(requestedUrl, 'http://localhost:3000')
  expect(url.pathname).toBe('/api/palettes')
  expect(url.searchParams.get('color_id')).toBe('12')

  expect(links.map((link) => link.getAttribute('href')))
    .toEqual(['/palettes/42', '/palettes/7'])

  const firstCard = within(links[0])

  const base = within(firstCard.getByRole('group', { name: 'Base' }))
  expect(base.getByText('ライトオレンジ')).toBeVisible()
  expect(base.getByText('55%')).toBeVisible()

  const sub = within(firstCard.getByRole('group', { name: 'Sub' }))
  expect(sub.getByText('ライトオレンジ')).toBeVisible()
  expect(sub.getByText('30%')).toBeVisible()

  const accent = within(firstCard.getByRole('group', { name: 'Accent' }))
  expect(accent.getByText('ダルオレンジ')).toBeVisible()
  expect(accent.getByText('15%')).toBeVisible()
})

test('配色を選ぶと、その配色IDの詳細へ移動する', async () => {
  const user = userEvent.setup()
  const router = renderPalettesPage()

  const list = await screen.findByRole('list', { name: '配色一覧' })
  const [firstLink] = await within(list).findAllByRole('link')

  await user.click(firstLink)

  expect(router.state.location.pathname).toBe('/palettes/42')
})

test('配色を取得している間は読み込み中と表示する', () => {
  vi.mocked(globalThis.fetch).mockReturnValue(new Promise(() => {}))

  renderPalettesPage()

  expect(screen.getByText('読み込み中…')).toBeVisible()
})

test('取得した配色が0件なら候補なしと表示する', async () => {
  vi.mocked(globalThis.fetch).mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [],
  })

  renderPalettesPage()

  expect(await screen.findByText('該当する配色がありません。')).toBeVisible()
})

test.each([400, 404])('APIが%sを返したら色IDのエラーを案内する', async (status) => {
  vi.mocked(globalThis.fetch).mockResolvedValue({
    ok: false,
    status,
    json: async () => ({}),
  })

  renderPalettesPage()

  expect(await screen.findByText('色を選び直してください。')).toBeVisible()
})

test('通信に失敗したら取得エラーを案内する', async () => {
  vi.mocked(globalThis.fetch).mockRejectedValue(new Error('通信エラー'))

  renderPalettesPage()

  expect(await screen.findByText('配色を取得できませんでした。')).toBeVisible()
})
