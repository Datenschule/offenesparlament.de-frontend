if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: node.js is not installed.' >&2
  exit 1
fi

# Make sure Bundler is installed
if [ "$(gem query -i -n bundler)" = "false" ]; then
  echo "Installing Bundler..."
  gem install bundler
fi

# Set up Ruby dependencies via Bundler
echo "Cleaning old Dependencies..."
bundle clean --force

# Set up Ruby dependencies via Bundler
echo "Installing Dependencies..."
bundle install --path .bundle/_vendor/bundle
