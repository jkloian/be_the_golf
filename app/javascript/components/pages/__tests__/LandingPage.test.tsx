import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LandingPage from '../LandingPage'

// Initialize i18n for tests
void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        landing: {
          title: 'Be Your Golf',
          description: 'Free golf style assessment',
          startButton: 'Start Free Assessment',
        },
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

const renderWithRouter = (component: React.ReactElement): void => {
  render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{component}</BrowserRouter>
    </I18nextProvider>
  )
}

describe('LandingPage', () => {
  it('renders the title and description', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByText('Be Your Golf')).toBeInTheDocument()
    expect(screen.getByText(/Free golf style assessment/)).toBeInTheDocument()
  })

  it('renders the start button', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByText('Start Free Assessment')).toBeInTheDocument()
  })
})

