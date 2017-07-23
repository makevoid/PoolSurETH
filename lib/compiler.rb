require_relative '../env'

require 'json'

module Compiler

  LOG = true
  # LOG = false

  USE_SOLC = false
  # USE_SOLC = true

  # naive compilation shelling out to solc

  def call(name:, code:)

    File.open("#{PATH}/compiled/#{name}.sol", "w") do |f|
      f.write code
    end

    # hardcoded libraries addresses for simplicity
    oraclize_address     = "0xe4b113092efc4367731f7c775a5dd3db6adbb3a5"
    solidity_stringutils = "0xe4b113092efc4367731f7c775a5dd3db6adbb3a5"

    # HMMM it doesn't works for the demo :/
    command = "solc #{name}.sol | solc --link --libraries usingOraclize:#{oraclize_address},solidity_stringutils:#{solidity_stringutils}"
    puts "COMMAND: #{command}" if LOG
    puts `cd #{PATH}/contracts && #{command}` if USE_SOLC

    # loading latest contract compiled by truffle
    configs = File.read("#{PATH}/build/contracts/Poolsureth.json")

    JSON.parse configs

    # original
    # puts `cd #{PATH}/contracts && solc #{name}.sol | solc --link --libraries usingOraclize:#{oraclize_address},Solidity_stringutils:#{solidity_stringutils}`
  end

  module_function :call

  private

  module ModuleMethods

  end

  extend ModuleMethods

end

if $0 == __FILE__

  name = "Poolsureth"

  code = File.read("#{PATH}/contracts/Poolsureth.sol")

  puts Compiler.call(name: name, code: code)

end
