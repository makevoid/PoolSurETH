require_relative 'env'

class UI < Roda
  plugin :render, engine: 'haml'
  plugin :public
  plugin :not_found
  plugin :multi_route
  plugin :partials
  plugin :all_verbs
  plugin :error_handler

  include RodaUtils
  include ViewHelpers

  route do |r|

    r.root {
      view 'index'
    }

    r.on("foo") {
      r.is {
        r.get {
          view 'foo'
        }
      }
    }

    r.public

  end

  not_found do
    view "not_found"
  end

  error do |err|
    case err
    when nil
      # catch a proper error...
    #
    # when CustomError
    #   "ERR" # like so
    else
      raise err
    end
  end
end
