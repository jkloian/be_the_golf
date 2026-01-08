import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  beforeEach(() => {
    // Reset document
    document.body.innerHTML = ''
  })

  it('renders footer with copyright and current year', () => {
    const appElement = document.createElement('div')
    appElement.id = 'app'
    appElement.dataset.appVersion = '1.0.0'
    document.body.appendChild(appElement)

    render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`Be The Golf.*${currentYear}.*\\(1\\.0\\.0\\)`))).toBeInTheDocument()
  })

  it('uses app version from data attribute', () => {
    const appElement = document.createElement('div')
    appElement.id = 'app'
    appElement.dataset.appVersion = '2.5.3'
    document.body.appendChild(appElement)

    render(<Footer />)

    expect(screen.getByText(/\(2\.5\.3\)/)).toBeInTheDocument()
  })

  it('falls back to "dev" when data attribute is not available', () => {
    // No app element with data attribute
    render(<Footer />)

    expect(screen.getByText(/\(dev\)/)).toBeInTheDocument()
  })

  it('falls back to "dev" when no version is available', () => {
    const appElement = document.createElement('div')
    appElement.id = 'app'
    document.body.appendChild(appElement)

    // Ensure VITE_APP_VERSION is not set
    const originalEnv = process.env.VITE_APP_VERSION
    delete process.env.VITE_APP_VERSION

    render(<Footer />)

    expect(screen.getByText(/\(dev\)/)).toBeInTheDocument()

    // Restore
    if (originalEnv) {
      process.env.VITE_APP_VERSION = originalEnv
    }
  })

  it('displays copyright symbol', () => {
    const appElement = document.createElement('div')
    appElement.id = 'app'
    appElement.dataset.appVersion = '1.0.0'
    document.body.appendChild(appElement)

    render(<Footer />)

    // Copyright symbol is \u00A9
    const footerText = screen.getByText(/Be The Golf/)
    expect(footerText.textContent).toContain('©')
  })
})

