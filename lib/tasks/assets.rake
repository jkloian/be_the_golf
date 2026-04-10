# frozen_string_literal: true

namespace :assets do
  desc "Precompile assets then sync public/vite and public/images to S3. Set S3_BUCKET_NAME (and AWS credentials) to upload. Use RAILS_ENV=production for production-style Vite output (public/vite)."
  task build_and_sync_to_s3: :environment do
    ENV["SECRET_KEY_BASE"] = ENV["SECRET_KEY_BASE"].presence || "1" * 64
    Rake::Task["assets:precompile"].invoke

    bucket = ENV["S3_BUCKET_NAME"].presence
    unless bucket
      puts "S3_BUCKET_NAME not set — skipping S3 sync. Set it to upload after precompile."
      next
    end

    base = "s3://#{bucket}"
    [
      [ "public/vite", "#{base}/vite/" ],
      [ "public/images", "#{base}/images/" ]
    ].each do |local, remote|
      next unless Dir.exist?(local)

      sh "aws s3 sync #{local} #{remote} --delete"
    end
  end
end
