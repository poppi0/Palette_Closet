import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'

function TestCounter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      クリック回数: {count}
    </button>
  )
}

test('Reactを表示し、クリック後の表示を確認できる', async () => {
  const user = userEvent.setup()
  render(<TestCounter />)

  const button = screen.getByRole('button', { name: 'クリック回数: 0' })
  expect(button).toBeInTheDocument()

  await user.click(button)

  expect(button).toHaveTextContent('クリック回数: 1')
})
