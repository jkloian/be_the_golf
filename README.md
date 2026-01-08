# Be Your Golf - MVP

A free, anonymous golf-style assessment application that helps golfers discover their playing style and get personalized tips.

## Overview

Be Your Golf is a DISC-style assessment tool tailored for golfers. Users complete a 16-frame "Most/Least" behavior assessment, and receive:
- Personalized DISC scores (Drive, Inspire, Steady, Control)
- A golf persona matching their style
- A famous pro they "play like" (based on gender)
- Practice and on-course tips
- A shareable results URL
- A shareable image with their golf style (PNG format, square or vertical aspect ratio)

## Architecture

### Tech Stack

**Backend:**
- Ruby on Rails 8 (API-only)
- PostgreSQL
- `rails_admin` for administration
- RSpec for testing

**Frontend:**
- React 19 with TypeScript
- Vite for asset management
- React Router for navigation
- Tailwind CSS for styling
- i18next for internationalization

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL database

**Testing:**
- RSpec (backend)
- Jest (frontend)
- Playwright (E2E)

**Linting:**
- Rubocop (Ruby)
- ESLint (TypeScript/React)

## Project Structure

```
be_the_golf/
├── app/
│   ├── controllers/
│   │   └── api/v1/          # API endpoints
│   ├── models/               # ActiveRecord models
│   ├── services/             # Business logic services
│   ├── lib/                  # GolfAssessment module
│   └── javascript/           # React frontend
│       ├── entrypoints/      # Vite entry points
│       ├── components/       # React components
│       ├── modules/          # API client, router, i18n
│       └── locales/          # Translation files
├── config/
│   ├── locales/              # Rails i18n files
│   └── initializers/         # CORS, rails_admin config
├── db/
│   └── migrate/              # Database migrations
├── spec/                     # RSpec tests
├── e2e/                      # Playwright E2E tests
└── docker-compose.yml        # Docker orchestration
```

## Setup

### Prerequisites

- Ruby 3.4.6
- Node.js 20+
- PostgreSQL
- Docker & Docker Compose (for containerized setup)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd be_the_golf
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your local database credentials
   ```

4. **Set up the database:**
   ```bash
   rails db:create
   rails db:migrate
   ```

5. **Start the development server:**
   ```bash
   # Using foreman/overmind (recommended - runs both Rails and Vite)
   bin/dev

   # Or separately:
   # Terminal 1: Rails (uses PORT from .env.development)
   rails server

   # Terminal 2: Vite (uses VITE_RUBY_PORT from .env.development)
   bin/vite dev
   ```

   **Note**: The `PORT` and `VITE_RUBY_PORT` environment variables control which ports Rails and Vite listen on. These are read from `.env.development` automatically via `dotenv-rails`.

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

### Docker Setup

1. **Create environment file:**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Start services:**
   ```bash
   docker-compose up --build
   ```

3. **Run migrations:**
   ```bash
   docker-compose exec web rails db:migrate
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

## Environment Variables

See `.env.example` for all required variables:

### Application Ports
- `VITE_RUBY_PORT` - Vite dev server port (default: 3039, used in development)
- `PORT` - Rails server port (default: 3000)
- `PLAYWRIGHT_RAILS_SERVER_PORT` - Rails server port for E2E tests (default: 3001)

### Database Configuration
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT` - PostgreSQL configuration

### Rails Configuration
- `RAILS_MASTER_KEY` - Rails master key for encrypted credentials
- `SECRET_KEY_BASE` - Rails secret key base

### Other Configuration
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `FRONTEND_URL` - Frontend URL for share links
- `VITE_API_URL` - API URL for frontend (defaults to same origin)

### Port Management

The application uses environment variables to control which ports Rails and Vite listen on:

- **Development**: 
  - Vite dev server uses `VITE_RUBY_PORT` (read by vite-ruby automatically)
  - Rails server uses `PORT` (configured in `config/puma.rb`)
  
- **Test/E2E**: 
  - Vite dev server uses `VITE_RUBY_PORT`
  - Rails server uses `PLAYWRIGHT_RAILS_SERVER_PORT` for test isolation

This allows multiple projects to run simultaneously without port conflicts. Set these in your `.env.development`, `.env.test`, or `.env.production` files.

## API Documentation

### POST `/api/v1/assessments/start`

Start a new assessment session.

**Request:**
```json
{
  "assessment_session": {
    "first_name": "John",
    "gender": "male",
    "handicap": 14
  },
  "locale": "en"
}
```

**Response:**
```json
{
  "assessment_session": {
    "id": 1,
    "public_token": "abc123...",
    "first_name": "John",
    "gender": "male",
    "handicap": 14,
    "started_at": "2025-12-30T10:00:00Z"
  },
  "frames": [
    {
      "index": 1,
      "options": [
        { "key": "A", "text": "..." },
        { "key": "B", "text": "..." },
        { "key": "C", "text": "..." },
        { "key": "D", "text": "..." }
      ]
    },
    ...
  ]
}
```

### POST `/api/v1/assessments/:id/complete`

Complete an assessment with responses.

**Request:**
```json
{
  "responses": [
    {
      "frame_index": 1,
      "most_choice_key": "A",
      "least_choice_key": "D"
    },
    ...
  ],
  "locale": "en"
}
```

**Response:**
```json
{
  "assessment_session": {
    "id": 1,
    "scores": {
      "D": 72,
      "I": 55,
      "S": 40,
      "C": 65
    },
    "persona": {
      "code": "DC",
      "name": "Attacking Analyst",
      "display_example_pro": "Jon Rahm"
    }
  },
  "tips": {
    "practice": ["..."],
    "play": ["..."]
  },
  "share_url": "http://localhost:3000/results/abc123..."
}
```

### GET `/api/v1/assessments/public/:public_token`

Get public assessment results.

**Response:**
```json
{
  "assessment": {
    "first_name": "John",
    "gender": "male",
    "handicap": 14,
    "scores": { "D": 72, "I": 55, "S": 40, "C": 65 },
    "persona": {
      "code": "DC",
      "name": "Attacking Analyst",
      "display_example_pro": "Jon Rahm",
      "style_truth": "I play with fire and feel. Momentum is my fuel."
    },
    "completed_at": "2025-12-30T10:15:00Z"
  },
  "tips": {
    "practice": ["..."],
    "play": ["..."]
  }
}
```

## Testing

### Backend Tests (RSpec)

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/assessment_session_spec.rb

# Run with coverage
COVERAGE=true bundle exec rspec
```

### Frontend Tests (Jest)

```bash
# Run all tests
yarn test

# Run in watch mode
yarn test --watch

# Run with coverage
yarn test --coverage
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run E2E tests
npx playwright test

# Run in UI mode
npx playwright test --ui
```

## Linting

### Ruby (Rubocop)

```bash
# Check for issues
bundle exec rubocop

# Auto-fix issues
bundle exec rubocop -a
```

### TypeScript/React (ESLint)

```bash
# Check for issues
yarn eslint app/javascript

# Auto-fix issues
yarn eslint app/javascript --fix
```

## Internationalization

The application supports multiple languages. Currently implemented:
- English (en) - Complete
- Spanish (es) - Structure ready, translations pending

### Adding a New Language

1. **Backend:** Add translation files in `config/locales/`:
   - `assessments.{locale}.yml`
   - `personas.{locale}.yml`
   - `tips.{locale}.yml`

2. **Frontend:** Add translation file in `app/javascript/locales/{locale}/translation.json`

3. **Update available locales:**
   - Backend: `config/application.rb` - add locale to `config.i18n.available_locales`
   - Frontend: `app/javascript/modules/i18n/config.ts` - add to resources

## Deployment

### Production Considerations

1. **Environment Variables:** Ensure all production environment variables are set
2. **Database Migrations:** Run migrations on deployment
3. **Asset Compilation:** Vite assets are compiled during Docker build
4. **CORS:** Configure `CORS_ALLOWED_ORIGINS` for your production domain
5. **Reverse Proxy:** Set up nginx/traefik for SSL and admin authentication

### Docker Production Build

```bash
docker build -t be_your_golf:latest .
docker-compose -f docker-compose.prod.yml up -d
```

## Assessment Logic

### Scoring Algorithm

1. Count Most/Least selections for each style (D, I, S, C)
2. Calculate raw score: `Raw_X = Most_X - Least_X`
3. Transform to 0-100 scale: `Score_X = round((Raw_X + 16) / 32.0 * 100)`

### Persona Resolution

1. **Balanced:** If `max_score - min_score <= 10` → "Complete Game Planner"
2. **Single-style:** If `primary_score >= 60 AND (primary_score - secondary_score) >= 15` → single style persona
3. **Two-style combo:** Otherwise → combo persona using top two styles

## Shareable Image Feature

Users can generate and share a custom image showcasing their golf playing style. The shareable image includes:
- Hero badge (persona-specific PNG badge)
- Style name (e.g., "Electric Playmaker")
- Pro comparison (e.g., "Rory McIlroy shares my playing style")
- Style truth (first-person, emotionally resonant statement)
- Brand mark and call-to-action

### Features

- **Aspect Ratios:** Square (1:1) or Vertical (4:5) formats
- **Sharing Options:**
  - Social media buttons (Facebook, Twitter, LinkedIn, WhatsApp)
  - Copy image to clipboard
  - Download as PNG file
  - Native Web Share API support
- **Image Generation:** Client-side using `html2canvas`
- **Filename Format:** `bethegolf-playing-style-{style-name}.png`

### Components

- `ShareableModal`: Modal interface for generating and sharing images
- `ShareableImage`: Component that renders the shareable design
- `useWebShare`: Hook for Web Share API functionality
- `imageGenerator`: Utility for converting React components to PNG images

### Implementation Details

- The page header (MedallionHero) is automatically hidden when the share modal is open to prevent layout conflicts
- Images are generated at 2x scale for high-quality output
- The modal is constrained to 90vh to ensure it fits within the viewport

## Admin Interface

Access the admin interface at `/admin` (no authentication in MVP - handled by reverse-proxy in production).

Features:
- View all assessment sessions
- View assessment responses
- Filter and search sessions
- Export data

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `bundle exec rspec && yarn test`
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create a Pull Request

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.
