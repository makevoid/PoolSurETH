require_relative '../env'

# reads from templates/contract.sol.erb
# compiles the sol file in contract_built.sol

module Renderer

  extend Poolsureth

  LOG = true
  # LOG = false


  def call(template_name:, locals:)
    if LOG
      puts "\n"
      p locals
      puts "\n"*2
    end

    configs = {}

    defaults = {
      license: "MIT - code/edits by Francesco 'makevoid' Canessa + contributors - open source project + modification to this contract made for BreakTheBlock '17 London Hackathon"
    }



    # etherisc defaults
    configs[:etherisc] = etherisc_defaults

    configs[:etherisc_flight] = {
      api_endpoint: "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/",
      url_part_0: "https://mkvd.eu.ngrok.io/api/flights/providers/flightaware/flights/",
      url_part_2: "TODO",
    }

    configs[:etherisc_trains] = {
      url_part_0: "https://api.tfl.gov.uk/Line/",
      url_part_2: "",
    }

    # insureth defaults
    configs[:insureth] = {
      no_admin: true,
      # no_admin: false,
    }

    # insureth flights flightaware
    configs[:insureth_flight] = {
      url_part_0: "https://mkvd.eu.ngrok.io/api/flights/providers/flightaware/flights/",
      url_part_2: ").FlightInfoExResult.flights[-1]",
    }

    # insureth trains
    configs[:insureth_trains] = {
      url_part_0: "https://api.tfl.gov.uk/Line/",
      url_part_2: "",
    }

    locals.merge! defaults

    if locals.fetch(:type) =~ /etherisc/
      locals.merge! configs[:etherisc]

      locals.merge! configs[:etherisc_flight] if locals.fetch(:type) =~ /flight/
      locals.merge! configs[:etherisc_train] if locals.fetch(:type) =~ /train/
    end

    if locals.fetch(:type) =~ /insureth/
      locals.merge! configs[:insureth]

      locals.merge! configs[:insureth_flight] if locals.fetch(:type) =~ /flight/
      locals.merge! configs[:insureth_train]  if locals.fetch(:type) =~ /train/
    end

    template = "Etherisc"
    template = "Poolsureth" if locals.fetch(:type) =~ /insureth/

    solidity = render template, locals: locals
    write solidity, name: template
  end

  module_function :call

  private

  module ModuleMethods
    def etherisc_defaults
      {
        # minimum_observations: 10, # default
        minimum_observations: 5,    # takes less gas
        # maximum_payout: 200,      # 200 ethers - default - that's a lot!
        maximum_payout: 0.1,        # 0.1 ether for testing is enough :D
        # reward_percent: 2,        # default reward percent is 2 for Etherisc admins
        reward_percent: 0,          # we don't want the owner of the contract to get any percent - free for all
        # reserve_percent: 1,       # default
        reserve_percent: 2,         # a bit safer
        # contract_deadline: 1474891200, # old deadline
        contract_deadline: (Date.today + 30).to_time.to_i, # one month from now
        oraclize_gas: 500000        # default
      }
    end

    def tfl_endpoint
      "https://api.tfl.gov.uk/Line/"
    end
  end

  extend ModuleMethods

end

if $0 == __FILE__
  locals  = {
    type:   "insureth_flight",
    api:    "flightaware",
    oracle: "oraclize",
    policy: "fixed",
  }
  locals  = {
    type:   "etherisc_flight",
    api:    "flightstats",
    oracle: "oraclize",
    policy: "fixed",
  }

  puts Renderer.call(template_name: "etherisc", locals: locals)
end
