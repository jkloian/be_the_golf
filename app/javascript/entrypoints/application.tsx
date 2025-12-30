import React from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from '../modules/router/AppRouter'
import '../modules/i18n/config'
import '../styles/application.css'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app')
  if (container) {
    const root = createRoot(container)
    root.render(
      <React.StrictMode>
        <AppRouter />
      </React.StrictMode>
    )
  }
})

