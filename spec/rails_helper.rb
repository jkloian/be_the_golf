# This file is copied to spec/ when you run 'rails generate rspec:install'
# SimpleCov must be started BEFORE loading Rails to track coverage accurately
if ENV['COVERAGE'] == 'true'
  require 'simplecov'
  SimpleCov.start 'rails' do
    # Minimum coverage threshold: 85%
    minimum_coverage 85
    # Don't enforce per-file coverage, only overall
    minimum_coverage_by_file 0

    # Track coverage for app/ directory only
    add_filter '/spec/'
    add_filter '/config/'
    add_filter '/db/'
    add_filter '/vendor/'
    add_filter '/bin/'
    add_filter '/lib/tasks/'

    # Exclude base classes and framework code using block filters
    # These files are Rails base classes with no custom logic to test
    add_filter do |source_file|
      filename = source_file.filename
      filename.end_with?('app/models/application_record.rb') ||
        filename.end_with?('app/jobs/application_job.rb') ||
        filename.end_with?('app/mailers/application_mailer.rb') ||
        filename.end_with?('app/helpers/application_helper.rb') ||
        filename.include?('/application_record.rb') ||
        filename.include?('/application_job.rb') ||
        filename.include?('/application_mailer.rb') ||
        filename.include?('/application_helper.rb')
    end

    # Generate HTML report
    enable_coverage :branch
    enable_coverage :line

    # Output format
    formatter SimpleCov::Formatter::MultiFormatter.new([
      SimpleCov::Formatter::HTMLFormatter,
      SimpleCov::Formatter::SimpleFormatter
    ])

    # Output to separate directory to avoid conflicts
    coverage_dir 'coverage/ruby'
  end
end

require 'spec_helper'

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
# Uncomment the line below in case you have `--require rails_helper` in the `.rspec` file
# that will avoid rails generators crashing because migrations haven't been run yet
# return unless Rails.env.test?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
#
# Rails.root.glob('spec/support/**/*.rb').sort_by(&:to_s).each { |f| require f }

# Ensures that the test database schema matches the current schema file.
# If there are pending migrations it will invoke `db:test:prepare` to
# recreate the test database by loading the schema.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end
RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_paths = [
    Rails.root.join('spec/fixtures')
  ]

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # FactoryBot
  config.include FactoryBot::Syntax::Methods

  # Infer spec type from file location
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")
end

# Shoulda Matchers
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
