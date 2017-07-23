require_relative 'env'

class UI < Roda
  plugin :render, engine: 'haml'
  plugin :public
  plugin :not_found
  plugin :multi_route
  plugin :partials
  plugin :all_verbs
  plugin :error_handler
  plugin :json

  include RodaUtils
  include ViewHelpers

  route do |r|

    r.root {
      view 'index'
    }

    r.on("render_template") {
      r.is {
        r.get {
          name    = params[:template_name]
          locals  = params[:json_locals]
          Renderer.call template_name: name, json_locals: locals
        }
      }
    }


    # this needs to be removed from the final version - at the moment we need an API proxy because Oraclize hasn't published yet the solidity code to support passing HTTP headers to the oracle, which are required for some api providers (flightaware)
    r.on("api") {
      r.on("flights") {
        r.on("providers") {
          r.on(":provider_id") { |provider_id|
            r.on("flights") {
              r.on(":id") { |id|
                r.is {
                  r.get {
                    # example:  /api/flights/providers/flightaware/flights/BA1382
                    API.call(provider: :flightaware, id: id)
                  }
                }
              }
            }
          }
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
