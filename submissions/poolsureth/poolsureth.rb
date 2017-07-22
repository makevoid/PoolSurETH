require_relative 'env'

# reads from templates/contract.sol.erb
# compiles the sol file in contract_built.sol

extend Poolsureth

template = "Etherisc"

# etherisc defaults
locals = {
  api_endpoint: "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/",

}

# custom
locals = {
  test: true,
  api_endpoint: "https://flight....com",
  fields: "...",
  premiums: {

  },
}

solidity = render template, locals: locals
write solidity, name: template
