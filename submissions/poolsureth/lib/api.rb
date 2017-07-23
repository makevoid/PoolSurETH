require "net/https"

module API

  PROVIDERS = {
    flightstats: {
      # flightstats doesn't requires headers, can be used directly from solidity
    },
    flightaware: {
      # final url (hackathon demo): https://mkvd.eu.ngrok.io/api/flights/providers/flightaware/flights/FLIGHT_ID
      # example: https://mkvd.eu.ngrok.io/api/flights/providers/flightaware/flights/BA1382
      name: :flightaware,
      url:    "https://flightxml.flightaware.com/json/FlightXML2/FlightInfo?ident=%s",
      json_lookup: "",
      username: "makevoid",
      key: ENV['FLIGHTAWARE_KEY'], # the key can be "blinded" using PATH/lib/tools/vendor/oraclize-encrypt and put directly into the contract, for simplicity (hackathon) and because we're already creating a proxy, we hide the secret into the proxy - we could also keep the proxy and provide a TLS notary proof into it (same at what Oraclize is doing) and with a trusted setup we will have a "provably-honest" proxy.
    },
    southern_trains: {
      # TODO time :D
    },
    tfl: {
      # ?
    },
    cruises: {
      # ?
    }
  }

  def call(provider:, id:)
    provider = PROVIDERS.fetch provider
    username, password = provider.fetch(:username), provider.fetch(:key)
    raise "Basic Auth password not found for provider #{provider.fetch(:name).inspect} - please set the environment variable" unless password
    url = provider.fetch(:url) % id
    get url: url, username: username, password: password
  end

  module_function :call

  private

  module ModuleMethods

    def get(url:, username:, password:)
      uri = URI.parse url

      Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        request = Net::HTTP::Get.new uri
        request.basic_auth username, password
        response = http.request request
        return response.body
      end
      return "FAIL"
    end

  end

  extend ModuleMethods

end
