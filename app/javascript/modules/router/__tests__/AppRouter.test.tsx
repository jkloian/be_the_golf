import { screen } from '../../../__tests__/helpers/test-utils'
import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from '../../../locales/en/translation.json'

// Initialize i18n for tests
void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

// Mock the page components to avoid complex dependencies
jest.mock('../../../components/pages/LandingPage', () => {
  return function MockLandingPage() {
    return <div>Landing Page</div>
  }
})

jest.mock('../../../components/pages/StartPage', () => {
  return function MockStartPage() {
    return <div>Start Page</div>
  }
})

jest.mock('../../../components/pages/AssessmentPage', () => {
  return function MockAssessmentPage() {
    return <div>Assessment Page</div>
  }
})

jest.mock('../../../components/pages/ResultsPage', () => {
  return function MockResultsPage() {
    return <div>Results Page</div>
  }
})

jest.mock('../../../components/pages/DevProcessingPage', () => {
  return function MockDevProcessingPage() {
    return <div>Dev Processing Page</div>
  }
})

jest.mock('../../../components/pages/DevResultsPage', () => {
  return function MockDevResultsPage() {
    return <div>Dev Results Page</div>
  }
})

// Import AppRouter after mocks
import AppRouter from '../AppRouter'

describe('AppRouter', () => {
  const renderRouter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <AppRouter />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    // Reset window.location for each test
    delete (window as { location?: unknown }).location
    window.location = { pathname: '/' } as Location
  })

  describe('route rendering', () => {
    it('renders AppRouter component', () => {
      renderRouter()
      // AppRouter renders BrowserRouter which contains Routes
      // We can verify it renders by checking for any of the mocked pages
      // Since we're at root, it should render LandingPage
      expect(screen.getByText('Landing Page')).toBeInTheDocument()
    })

    it('renders routes structure', () => {
      renderRouter()
      // Verify that the router is set up by checking for the default route
      expect(screen.getByText('Landing Page')).toBeInTheDocument()
    })
  })

  describe('component structure', () => {
    it('renders without errors', () => {
      expect(() => renderRouter()).not.toThrow()
    })

    it('contains route definitions', () => {
      renderRouter()
      // Verify routes are set up by checking the default route renders
      expect(screen.getByText('Landing Page')).toBeInTheDocument()
    })
  })
})

