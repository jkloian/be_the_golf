# syntax=docker/dockerfile:1
# check=error=true

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t be_the_golf .
# docker run -d -p 80:80 -e RAILS_MASTER_KEY=<value from config/master.key> --name be_the_golf be_the_golf

# For a containerized dev environment, see Dev Containers: https://guides.rubyonrails.org/getting_started_with_devcontainer.html

# Prebuilt Rails + Node/Yarn base images (see rails-react-base-image repo).
# Override at build time: docker build --build-arg BASE_IMAGE_TAG=...
# CI reads .docker-base-image-tag; keep it in sync with .ruby-version / .nvmrc when you bump the base.
ARG BASE_IMAGE_REPO=ghcr.io/jkloian/rails-react-base
ARG BASE_IMAGE_TAG=ruby3.4.9-node24.12.0-yarn4.13.0:v1.0.0
FROM ${BASE_IMAGE_REPO}:${BASE_IMAGE_TAG}-runtime AS base

FROM ${BASE_IMAGE_REPO}:${BASE_IMAGE_TAG}-build AS build

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
  rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
  bundle exec bootsnap precompile --gemfile

# Install node modules
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# When SKIP_VITE_BUILD is set (e.g. in CI), assets were built on the host and uploaded to S3; skip precompile in image.
ARG SKIP_VITE_BUILD=false
RUN if [ "$SKIP_VITE_BUILD" != "true" ]; then \
      SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile; \
    fi

# Assets are built and uploaded to S3 during CI/CD; Vite metadata is copied into the final image from build context.
# Remove node_modules as we no longer need them for asset building
RUN rm -rf node_modules


# Final stage for app image
FROM base

# Copy built artifacts: gems, application (includes public/vite/.vite when CI precompiled or local SKIP_VITE_BUILD=false)
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

ENV PATH=/rails/bin:$PATH

# Run and own only the runtime files as a non-root user for security
RUN groupadd --system --gid 1000 rails && \
  useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
  chown -R rails:rails db log storage tmp
USER 1000:1000

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start server via Thruster by default, this can be overwritten at runtime
EXPOSE 80
CMD ["./bin/thrust", "./bin/rails", "server"]
