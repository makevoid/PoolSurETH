require_relative '../env'

module Compiler

  # naive compilation shelling out to solc

  def call
    name = "Poolsureth"

    # hardcoded libraries addresses for simplicity
    oraclize_address     = "0xe4b113092efc4367731f7c775a5dd3db6adbb3a5"
    solidity_stringutils = "0xe4b113092efc4367731f7c775a5dd3db6adbb3a5"


    puts `cd #{PATH}/contracts && solc #{name}.sol | solc --link --libraries usingOraclize:#{oraclize_address},Solidity_stringutils:#{solidity_stringutils}`
  end

  module_function :call

  private

  module ModuleMethods

  end

  extend ModuleMethods

end

Compiler.call
