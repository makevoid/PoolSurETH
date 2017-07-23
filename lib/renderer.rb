# require_relative 'env'

# reads from templates/contract.sol.erb
# compiles the sol file in contract_built.sol

class Renderer

  extend Poolsureth

  def call(template_name:, json_locals:)

    template = "Etherisc"

    defaults = {
      license: "MIT - code/edits by Francesco 'makevoid' Canessa + contributors - open source project + modification to this contract made for BreakTheBlock '17 London Hackathon"
    }

    # etherisc defaults
    locals = {
      api_endpoint: "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/",
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

    # custom
    # locals = {
    #   test: true,
    #   api_endpoint: "https://flight....com",
    #   fields: "...",
    #   premiums: {
    #
    #   },
    # }

    locals.merge! defaults
    solidity = render template, locals: locals
    write solidity, name: template

  end
end
