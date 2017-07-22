require 'bundler'
Bundler.require :default

require 'date'

PATH = File.expand_path "../", __FILE__

require_relative 'lib/poolsureth'


unless ENV["SKIP_UI"] == "1"

  # UI

  require_relative 'lib/ui/roda_utils'
  require_relative 'lib/ui/view_helpers'

  Encoding.default_internal = Encoding::UTF_8
  Encoding.default_external = Encoding::UTF_8

  APP_ENV = ENV["RACK_ENV"] || "development"

  # good for integrate but slightly slower:
  #
  # Oj.default_options = { mode: :compat }

end
