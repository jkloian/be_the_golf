import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from '../LandingPage'

const renderWithRouter = (component: React.ReactElement): void => {
  render(<BrowserRouter>{component}</BrowserRouter>)
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

