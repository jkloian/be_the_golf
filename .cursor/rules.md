# .cursor/project-rules.yaml

project:
  name: "Rails 8 / React TypeScript App"  # ← update with your actual project name

structure:
  backend: Rails 8 app (standard, full-stack)
  frontend:
    framework: React app written in TypeScript
    root: app/javascript/
    components: app/javascript/components
    helpers: app/javascript/helpers
    tests: app/javascript/__tests__
    utils: app/javascript/utils/
    test_utils: app/javascript/test-utils/
    modules: app/javascript/modules/

dependencies:
  policy: >-
    Prefer built-in features of Rails, React, and browsers.
    Only add third-party dependencies where they offer clear, strong value
    or significant productivity/safety benefit.
    Avoid DSL-heavy frameworks unless an exceptional, documented benefit is proven.
  css: >-
    This project uses the Tailwind CSS framework. Follow Tailwind best practices.
    Use utility classes consistently. DRY out repeated patterns into components
    or @apply groups. Use CSS custom properties for dynamic values that
    cannot be expressed as Tailwind utilities.
    Avoid inline style attributes for non-dynamic values.

testing:
  tdd: true
  required: >-
    Every new feature, enhancement, or bugfix must be accompanied by
    corresponding unit or integration tests. E2E tests are mandatory and
    must be kept up-to-date. Do not write tests for third-party libraries;
    cover only in-house business logic. All seed and fixture data must be
    accurate and current — failure to maintain is a blocker.
    Write all applicable tests:
      * models
      * controllers
      * views
      * requests
      * services/jobs
      * mailers
      * end-to-end

  frameworks:
    ruby: RSpec
    factory_bot: FactoryBot (required for all model and integration specs)
    javascript: Jest with React Testing Library
    end_to_end: Playwright (the sole E2E framework — do not use Cypress)

  code_coverage: >-
    Coverage gates are enforced. Gaps must be reported but do not
    automatically block — they require triage and acknowledgement.
    See per-layer targets in javascript_testing.coverage_targets.
    Ruby coverage is tracked via SimpleCov; warn on drops below 90% overall.

  reports: required on every PR/diff submitted

  # JavaScript Testing Architecture & Patterns
  javascript_testing:

    # Pure Functions Strategy
    pure_functions:
      description: >-
        Extract business logic into pure functions with zero side effects.
        These functions are 100% testable without mocking and achieve maximum coverage.
      location: app/javascript/utils/
      naming_pattern: "{domain}-helpers.ts"
      examples:
        analytics: app/javascript/utils/analytics-helpers.ts
        validation: app/javascript/utils/validation-helpers.ts
        formatting: app/javascript/utils/formatting-helpers.ts
      requirements:
        - No dependencies on DOM, window, or global objects
        - No side effects (no mutations, no I/O)
        - Deterministic output for same inputs
        - Comprehensive edge case testing
        - 100% function coverage target
      test_coverage: "Must achieve 95%+ statements, 90%+ branches, 100% functions"

    # Test Utilities & Mock Factories
    test_utilities:
      description: >-
        Create reusable test utilities and mock factories to reduce setup
        complexity and ensure consistent testing patterns across the codebase.
      location: app/javascript/test-utils/
      structure:
        dom_helpers: "DOM element creation and setup utilities"
        mock_factories: "Centralized mock object creation with sensible defaults"
        test_data: "Reusable test data builders and fixtures"
      patterns:
        builder_pattern: "Use builder pattern for complex mock objects"
        factory_functions: "Create factory functions with sensible defaults"
        environment_setup: "Centralized test environment configuration"
      examples:
        dom_helpers: >-
          createMockElement(overrides)
          createMockSelectElement(overrides)
          setupSegmentedAnalyticsDOM()
        mock_factories: >-
          createMockAnalyticsConfig(overrides)
          createMockChartData(overrides)
          createMockEnvironment(scenario)

    # Dependency Injection for Testability
    dependency_injection:
      description: >-
        Inject dependencies (document, window, fetch) into classes and
        functions to enable full control over external dependencies in tests.
      constructor_pattern: >-
        constructor(
          private documentProvider: Document = document,
          private windowProvider: Window = window,
          private fetchProvider: typeof fetch = fetch
        )
      benefits:
        - Full control over dependencies in tests
        - No global mocking required
        - Easier to test edge cases and error conditions
        - Clear separation of concerns
      implementation:
        - Use constructor injection for classes
        - Use parameter injection for functions
        - Provide sensible defaults for production use
        - Override in tests with mock implementations

    # Mock Factory Patterns
    mock_factories:
      patterns:
        builder_pattern: "Chain methods to build complex objects"
        override_pattern: "Accept overrides object for customization"
        scenario_pattern: "Pre-configured scenarios for common test cases"
      examples:
        basic_factory: >-
          createMockUser({ name: 'John', email: 'john@example.com' })
        scenario_factory: >-
          createMockEnvironment('success')
          createMockEnvironment('error')
          createMockEnvironment('network-error')
        builder_pattern: >-
          createMockResponse()
            .withData({ users: [] })
            .withStatus(200)
            .withHeaders({ 'Content-Type': 'application/json' })

    # Test Organization & Structure
    test_structure:
      describe_organization: >-
        Group tests by functionality, not by implementation details.
        Use descriptive test names that explain the behavior being tested.
      naming_convention: >-
        describe('{ComponentName}', () => {
          describe('{methodName}', () => {
            it('{expected behavior} when {condition}', () => {
              // test implementation — do not prefix with "should"
            });
          });
        });
      test_categories:
        constructor: "Constructor and initialization tests"
        public_methods: "Public API method tests"
        error_handling: "Error conditions and edge cases"
        integration: "Component interaction tests"
        accessibility: "Accessibility and user experience tests"

    # Coverage Requirements (per layer)
    coverage_targets:
      pure_functions: "95%+ statements, 90%+ branches, 100% functions"
      components: "85%+ statements, 80%+ branches, 90%+ functions"
      utilities: "90%+ statements, 85%+ branches, 95%+ functions"
      integration: "80%+ statements, 75%+ branches, 85%+ functions"
    coverage_analysis: >-
      Prioritize branches and functions coverage over statements.
      Branches coverage indicates decision logic coverage.
      Functions coverage indicates API completeness.

    # Testing Anti-Patterns to Avoid
    anti_patterns:
      global_mocking: "Avoid mocking global objects (window, document, fetch) — use dependency injection"
      implementation_testing: "Don't test implementation details — test observable behavior"
      brittle_selectors: "Never use CSS class, text, or placeholder-based selectors (see forbidden list)"
      over_mocking: "Don't mock everything — use real objects when possible"
      test_duplication: "Extract common test setup into test-utils/ — do not copy/paste setup code"
      async_complexity: "Keep async test logic simple and focused; use waitFor, not sleep"
      should_prefix: "Do not name tests with 'should' — use active present tense"

    # React Testing Best Practices
    react_testing:
      testing_library: "Use React Testing Library for user-centric testing"
      user_events: "Always prefer userEvent over fireEvent for realistic interactions"
      accessibility: "Test with screen readers and keyboard navigation"
      component_isolation: "Test components in isolation with minimal props"
      integration_focus: "Focus on user workflows, not implementation details"
      examples:
        user_interaction: >-
          await userEvent.click(screen.getByRole('button', { name: /submit/i }));
          await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
        accessibility: >-
          expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
          expect(screen.getByLabelText(/email/i)).toHaveAttribute('required');

    # Error & Edge Case Testing
    error_testing:
      network_errors: "Test network failures and timeouts"
      validation_errors: "Test input validation and error messages"
      boundary_conditions: "Test edge cases and boundary values"
      user_errors: "Test user input errors and recovery"
      system_errors: "Test system failures and graceful degradation"
      examples:
        network_failure: >-
          global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
        validation_error: >-
          await userEvent.type(input, 'invalid-email');
          expect(screen.getByRole('alert')).toBeInTheDocument();
        boundary_test: >-
          expect(calculatePercentage(0, 0)).toBe(0);
          expect(calculatePercentage(100, 0)).toBe(0);

# JavaScript Development Architecture & Patterns
javascript_development:

  code_organization:
    pure_functions: >-
      Extract business logic into pure functions in app/javascript/utils/.
      These functions have zero side effects and are 100% testable.
      Examples: analytics-helpers.ts, validation-helpers.ts, formatting-helpers.ts
    modules: >-
      Organize complex functionality into modules in app/javascript/modules/.
      Each module has a single responsibility and a clear public API.
      Structure: {ModuleName}/{ModuleName}.ts, __tests__/, index.ts
    test_utilities: >-
      Create reusable test utilities in app/javascript/test-utils/.
      Include DOM helpers, mock factories, and test data builders.
      Examples: dom-helpers.ts, mock-factories.ts, test-data.ts

  error_handling:
    network_errors: >-
      Handle network failures gracefully with proper error messages.
      Test network timeouts, connection failures, and invalid responses.
    validation_errors: >-
      Validate user input and provide clear error messages.
      Test boundary conditions and edge cases.
    system_errors: >-
      Handle system failures with graceful degradation.
      Test missing dependencies and configuration errors.
    user_errors: >-
      Handle user input errors with helpful feedback.
      Test invalid data formats and required field validation.

  react_patterns:
    component_structure: >-
      Use functional components with hooks for state management.
      Keep components focused on a single responsibility.
    prop_validation: >-
      Use TypeScript interfaces for prop validation.
      Provide default values for optional props.
    event_handling: >-
      Use userEvent for realistic user interactions in tests.
      Prefer controlled components over uncontrolled ones.
    accessibility: >-
      Use semantic HTML elements and ARIA attributes.
      Test with screen readers and keyboard navigation.

  typescript_patterns:
    explicit_typing: >-
      Use explicit typing for all function parameters and return values.
      Never use 'any' — use specific types or 'unknown' with type guards.
    interface_design: >-
      Create clear, focused interfaces for data structures.
      Use generic types for reusable components.
    type_safety: >-
      Leverage TypeScript's type system for compile-time error checking.
      Use type guards for runtime type checking.
      Non-null assertions (!) must have a justification comment.

  naming_conventions:
    pure_functions: "{domain}-helpers.ts"
    test_utilities: "dom-helpers.ts, mock-factories.ts"
    modules: "{ModuleName}/{ModuleName}.ts"
    tests: "{ComponentName}.test.ts or {ComponentName}.test.tsx"
    types: "{domain}-types.ts"

  import_patterns:
    pure_functions: "import { functionName } from '../../utils/domain-helpers';"
    test_utilities: "import { createMockElement, setupDOM } from '../../../test-utils/dom-helpers';"
    modules: "import { ModuleName } from '../ModuleName/ModuleName';"
    types: "import type { TypeName } from '../types/domain-types';"

  documentation:
    pure_functions: >-
      Document all pure functions with JSDoc comments.
      Include parameter types, return types, and usage examples.
    test_utilities: >-
      Document test utilities with clear usage examples.
      Include common patterns and best practices.
    modules: >-
      Document module APIs with clear examples.
      Include error handling and edge case documentation.

  refactoring:
    extract_pure_functions: >-
      When business logic is mixed with side effects, extract pure functions.
      Move calculations, validations, and data transformations to utils/.
    add_dependency_injection: >-
      When testing becomes difficult due to global dependencies, add injection.
      Refactor classes to accept dependencies via constructor.
    create_test_utilities: >-
      When test setup becomes repetitive, create reusable utilities.
      Extract common patterns into dom-helpers.ts and mock-factories.ts.
    improve_error_handling: >-
      When error conditions are not well tested, improve error handling.
      Add comprehensive error tests and user feedback.

  migration_strategy:
    phase1: "Extract pure functions from existing code. Create test utilities for common patterns."
    phase2: "Add dependency injection to classes. Refactor tests to use new utilities."
    phase3: "Improve error handling and edge case testing. Achieve target coverage levels."
    phase4: "Document patterns and establish team conventions. Create guidelines for new code."

  # DOM Selector Best Practices — Accessibility-First Testing
  selector_priority:

    preferred:
      description: >-
        Use semantic selectors that reflect how users interact with the app.
        Prefer ARIA attributes and roles over implementation details.
        Test the user experience, not the implementation.
      jest_examples: >-
        screen.getByRole('button', { name: /continue/i })
        screen.getByRole('textbox', { name: /email/i })
        screen.getByLabelText(/assessment identifier/i)
      playwright_examples: >-
        page.getByRole('button', { name: /continue/i })
        page.getByRole('textbox', { name: /email/i })
        page.getByLabelText(/assessment identifier/i)

    secondary:
      description: >-
        Use data-testid attributes for elements that need stable, non-semantic
        test targeting. Follow the naming convention: {component}-{element}-{purpose}
      jest_examples: >-
        screen.getByTestId('continue-button')
        screen.getByTestId('email-input')
        screen.getByTestId('progress-indicator')
      playwright_examples: >-
        page.getByTestId('continue-button')
        page.getByTestId('email-input')
        page.getByTestId('progress-indicator')

    tertiary:
      description: "Use existing ARIA labels for rating buttons, navigation, and form controls."
      jest_examples: >-
        screen.getByLabelText('Previous')
        screen.getByLabelText('Next')
        screen.getByLabelText('Rating 4')
      playwright_examples: >-
        page.getByLabelText('Previous')
        page.getByLabelText('Next')
        page.getByLabelText('Rating 4')

  testid_naming:
    pattern: "{component}-{element}-{purpose}"
    examples:
      navigation: >-
        data-testid="continue-button"
        data-testid="previous-button"
        data-testid="submit-button"
        data-testid="next-button"
      forms: >-
        data-testid="email-input"
        data-testid="first-name-input"
        data-testid="last-name-input"
        data-testid="assessment-id-input"
      progress: >-
        data-testid="progress-indicator"
        data-testid="progress-bar"
        data-testid="loading-spinner"
        data-testid="error-message"
      content: >-
        data-testid="question-container"
        data-testid="results-container"
        data-testid="thank-you-container"
        data-testid="instructions-container"
      interactive: >-
        data-testid="rating-button-4"
        data-testid="choice-option-a"
        data-testid="other-text-input"
        data-testid="prefer-not-answer"

  aria_requirements:
    buttons: >-
      All buttons without visible text must have aria-label.
      Example: <button aria-label="Previous question" data-testid="previous-button">
    inputs: >-
      All form inputs must have aria-label or an associated label element.
      Example: <input type="email" aria-label="Email address" data-testid="email-input">
    progress: >-
      Progress indicators must use role="progressbar" with aria-valuenow,
      aria-valuemin, aria-valuemax.
    ratings: >-
      Rating buttons must have a descriptive aria-label.
      Example: <button aria-label="Rating 4" data-testid="rating-button-4">
    choices: >-
      Choice options must have a descriptive aria-label.
      Example: <input type="radio" aria-label="Option A" data-testid="choice-option-a">

  component_requirements:
    all_components:
      - All interactive elements must have data-testid attributes
      - All buttons must have aria-label or visible text
      - All form inputs must have proper labels
      - Progress indicators must have ARIA attributes
      - Semantic HTML roles must be used appropriately
      - Tests must use accessibility-first selectors
      - No text-based, placeholder-based, or CSS class-based selectors in tests

  migration_phases:
    phase1: "Add missing data-testid attributes. Add proper ARIA labels and roles. Ensure semantic HTML structure."
    phase2: "Replace text-based selectors with role-based. Replace placeholder selectors with label-based. Replace CSS class selectors with test ID selectors."
    phase3: "Run all tests to confirm they pass. Verify accessibility with screen readers. Update documentation."

linting_and_formatting:
  whitespace: never leave any trailing whitespace
  ruby: RuboCop — all errors must be resolved before commit
  haml: haml-lint — all errors must be resolved before commit; run auto-correct first
  javascript: ESLint + Prettier — fix or auto-fix before commit
  block_merge_on_lint_error: true

  haml_formatting:
    hash_attributes:
      spacing: >-
        Hash attributes must have proper spacing: { key: value } not {key: value}.
        Always use spaces inside braces for single-line hashes.
      examples:
        correct: >-
          %div{ class: "container", data: { testid: "main-content" } }
          %button{ type: "submit", disabled: false }
        incorrect: >-
          %div{class: "container", data: {testid: "main-content"}}
          %button{type: "submit", disabled: false}

    string_output:
      avoid_unnecessary: >-
        Use direct output instead of unnecessary string interpolation.
        Use: = variable instead of = "#{variable}".
        Use string interpolation only when actually concatenating with other content.
      examples:
        correct: >-
          = user.name
          = "Welcome, #{user.name}!"
          #{completion_percentage_for_assessment(organization_assessment)}%
        incorrect: >-
          = "#{user.name}"
          = "#{completion_percentage_for_assessment(organization_assessment)}%"

    id_attributes:
      naming: "Use lisp-case for ID attributes: user-profile not userProfile or user_profile"
      examples:
        correct: >-
          %div#user-profile
          %div{ id: "assessment-form" }
        incorrect: >-
          %div#userProfile
          %div{ id: "user_profile" }

    line_length:
      max_length: 120
      breaking: >-
        Break long lines at logical points (after commas, operators, etc.).
        Use proper indentation for multi-line attributes.
        Consider extracting complex logic to helpers or partials.
      examples:
        correct: >-
          %div{ class: "container",
                data: { testid: "main-content", role: "main" } }
          = render partial: 'ai_summary_header',
            locals: { organization_assessment: organization_assessment,
                      summary_type: summary_type,
                      analytics_required: analytics_required,
                      organization: organization,
                      cohort: cohort }
        incorrect: >-
          = render partial: 'ai_summary_header', locals: { organization_assessment: organization_assessment, summary_type: summary_type, analytics_required: analytics_required, organization: organization, cohort: cohort }

    whitespace:
      trailing: "Never leave trailing whitespace. Files must end with a single newline. No trailing empty lines."
      parentheses: "No spaces inside parentheses: (value) not ( value )"

    comments:
      consecutive: >-
        Merge consecutive comments into single multi-line comment blocks.
      examples:
        correct: >-
          -#
            Main navigation section
            Contains user menu and search functionality
            Handles responsive behavior
        incorrect: >-
          -# Navigation
          -# User menu
          -# Search

    ruby_statements:
      consecutive: >-
        Merge consecutive Ruby statements into single blocks when possible.
        Use proper indentation for multi-line Ruby blocks.
        Group related variable assignments together.
      examples:
        correct: >-
          - summary_type = local_assigns[:summary_type] || 'executive'
            is_segmented = summary_type == 'segmented'
            analytics_required = local_assigns[:analytics_required] || false
            panel_class = summary_panel_class(is_segmented, analytics_required, organization_assessment)
        incorrect: >-
          - summary_type = local_assigns[:summary_type] || 'executive'
          - is_segmented = summary_type == 'segmented'
          - analytics_required = local_assigns[:analytics_required] || false
          - panel_class = summary_panel_class(is_segmented, analytics_required, organization_assessment)

    inline_styles:
      avoid: >-
        Avoid inline style attributes when possible.
        Use Tailwind utility classes or CSS classes instead.
        Only use inline styles for dynamic values that cannot be expressed as classes.
      examples:
        correct: >-
          %div.container
          %div{ style: "color: #{dynamic_color}" }
        incorrect: >-
          %div{ style: "margin: 10px; padding: 5px;" }

    view_length:
      max_lines: 100
      refactoring: >-
        Break large views into partials.
        Extract complex logic to helpers or services.
        Consider component-based architecture for complex UI.

    instance_variables:
      partials: >-
        Never use instance variables in partials.
        Pass data explicitly through local variables only.
        Use presenters or view objects for complex data preparation.

    syntax_requirements:
      indentation: >-
        Use consistent 2-space indentation.
        Maintain proper nesting structure.
        Avoid illegal nesting within plain text.
      examples:
        correct: >-
          %div
            %p This is a paragraph
            - if condition
              %span Nested content
        incorrect: >-
          %div
            This is plain text
              %p Illegal nesting in plain text

    auto_correction:
      before_commit: >-
        Always run haml-lint with auto-correct before committing Haml files.
        Fix any remaining issues manually after auto-correct.
        Ensure all files pass haml-lint without errors before proceeding.
      command: bundle exec haml-lint app/views/ --auto-correct

view_layout_and_design:
  css_framework: >-
    Tailwind CSS is the project CSS framework.
    Follow Tailwind best practices throughout.
    DRY out repeated utility patterns using @apply or component extraction.
    Use CSS custom properties for dynamic values that cannot be expressed as utilities.
  layout: >-
    Responsive and fluid layout always.
    Flexbox is preferred; CSS Grid where flexbox is insufficient.
    Never use fixed pixel widths on containers without a fluid fallback.
  asset_delivery: Vite

branching_policy:
  required: true
  naming:
    - feature/*
    - fix/*
    - chore/*
  direct_main_edits: blocked

commits:
  format: >-
    Use Conventional Commits as the default format.
    Plain English is acceptable only when a type/scope classification does
    not cleanly apply. Be consistent within a project.
  granularity: >-
    Commit frequently; keep each commit atomic where possible.
    Squash only insignificant fixups before merge.

automation:
  before_merge:
    - All tests pass (full suite — no filtered or skipped runs)
    - All linters pass (Rubocop, haml-lint, ESLint, Prettier)
    - Security scans pass (Brakeman, Bundler Audit, yarn audit)
    - All docs (README, schema diagram) updated as appropriate
    - Test results attached to PR
    - No direct push to main allowed

doc_updates:
  required: true
  location: README.md
  trigger: >-
    Any new setup, test, or deployment scripts; major API endpoints;
    significant data migrations.

mermaid_schema_diagram:
  required: true
  location: docs/schema.mermaid
  trigger: >-
    Any new or changed migration, changes to db/schema.rb, or updates to
    models and their relationships. Anything that affects the database schema
    must trigger an update to docs/schema.mermaid.

multi_step_changes:
  approach: >-
    Break into incremental steps.
    Present each step's code diff and provide associated test results.
    Pause for user review after each major step or sweep,
    especially during large refactors.

review_policies:
  fail_on_test_error: true
  fail_on_security_error: true
  no_merge_until_ack: true  # explicit user ack required for large or sweeping changes
  diffs_and_test_proofs: always required

# Forbidden dependencies and patterns
forbidden:
  dependencies:
    - bootstrap
    - unnecessary third-party component libraries
    - custom mini-languages unless explicitly discussed and approved
    - Cypress (Playwright is the E2E standard)
  test_selectors:
    - "text-based selectors: button:has-text(), screen.getByText() for interaction targets"
    - "placeholder-based selectors: input[placeholder], screen.getByPlaceholderText()"
    - "CSS class-based selectors: .button-primary, screen.getByClassName()"
    - "display value selectors: screen.getByDisplayValue()"

filetype_rules:
  .rb:
    lint: rubocop
    test: rspec
  .ts:
    lint: eslint/prettier
    test: jest
  .tsx:
    lint: eslint/prettier
    test: jest
  .spec.ts:
    test: playwright
    selector_validation: required
  .test.tsx:
    test: jest
    selector_validation: required

permissions:
  auto_run_commands:
    - bundle install
    - bin/rails db:migrate
    - yarn install
    - yarn lint*
    - yarn test*
    - yarn playwright*
    - yarn typecheck
    - rspec*
    - rubocop*
    - jest*

running_commands: >-
  Before running any commands, initialize the shell environment in this order:
    test -x $HOME/.rbenv/bin/rbenv && export PATH=$HOME/.rbenv/bin:$PATH
    test -x $HOME/.rbenv/bin/rbenv && eval "$(rbenv init -)"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

node:
  package_manager: yarn v4 with PnP enabled
  node_modules: >-
    node_modules directory is intentionally empty — PnP is active.
    All node commands must be executed via yarn (not npm or npx).
    Use scripts defined in package.json or invoke directly with yarn.

enforcement:
  safety:  # Never violate — halt and escalate
    - Never commit, push, or alter git history without explicit user instruction
    - Never make changes that were not asked for — if a change is necessary, explain and ask first
    - Never merge or proceed if tests, linters, or security scans are failing
    - Always use `rails runner` for Rails code execution — agents cannot interact with the interactive console

  process:  # Follow consistently on every task
    - Summarize all proposed changes before taking action, especially on large jobs
    - Pause and require user acknowledgement before any sweeping refactor
    - Present diffs and test results as proof of work — always
    - Ask clarifying questions when requirements are ambiguous, scope is large, or rules conflict
    - Do not ask clarifying questions for small, well-defined tasks
    - Follow accessibility-first testing principles in all test implementations
    - Use semantic selectors over implementation details
    - Ensure all new components include proper data-testid and ARIA attributes
    - Follow Haml formatting guidelines — run haml-lint before any Haml changes
    - Fix all Haml linting issues before proceeding with other work

  style:  # Apply by default; can be overridden with justification
    - Use explicit typing in all TypeScript code — never use 'any'
    - Write self-documenting code; comments only for non-obvious business logic
    - Use lisp-case for HTML/Haml ID attributes
    - Keep lines under 120 characters; break appropriately
    - Never leave trailing whitespace in any file
    - Ensure files end with a single newline
    - Avoid unnecessary string interpolation in Haml: = variable not = "#{variable}"
    - Use proper hash attribute spacing in Haml: { key: value } not {key: value}
