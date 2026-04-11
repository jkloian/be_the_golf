# Run using bin/ci

CI_STEP_RESULTS = []

CI.run do
  tracked_step = lambda do |title, *command|
    started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    step title, *command
    elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_at
    CI_STEP_RESULTS << { title: title, success: results.last, duration_seconds: elapsed }
  end

  tracked_step.call "Setup", "bin/setup --skip-server"

  tracked_step.call "Style: Ruby", "bin/rubocop"
  tracked_step.call "Style: Haml", "bin/haml-lint"
  tracked_step.call "Style: JavaScript", "yarn lint"

  tracked_step.call "Security: Gem audit", "bin/bundler-audit"
  tracked_step.call "Security: Brakeman code analysis", "bin/brakeman --quiet --no-pager --exit-on-warn --exit-on-error"

  tracked_step.call "Tests: Prepare test database", "RAILS_ENV=test bin/rails db:test:prepare"
  tracked_step.call "Tests: RSpec", "bundle exec rspec"
  tracked_step.call "Tests: Jest", "yarn test:ci"
  tracked_step.call "Tests: E2E", "yarn test:e2e"
  tracked_step.call "Tests: Seeds", "env RAILS_ENV=test bin/rails db:seed:replant"

  # Optional: set a green GitHub commit status to unblock PR merge.
  # Requires the `gh` CLI and `gh extension install basecamp/gh-signoff`.
  # if success?
  #   step "Signoff: All systems go. Ready for merge and deploy.", "gh signoff"
  # else
  #   failure "Signoff: CI failed. Do not merge or deploy.", "Fix the issues and try again."
  # end
end
