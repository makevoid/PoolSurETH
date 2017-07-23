const usingOraclize       = artifacts.require("./usingOraclize.sol")
const solidityStringutils = artifacts.require("./solidity_stringutils.sol")
const Etherisc = artifacts.require("./Etherisc.sol")

module.exports = async (deployer) => {
  deployer.deploy(usingOraclize)
  deployer.link(usingOraclize,        Etherisc)
  deployer.deploy(solidityStringutils)
  deployer.link(solidityStringutils,  Etherisc)
  deployer.deploy(Etherisc, { gas: 1e7 }) // bump the gas - etherisc is a quite expensive contract to deploy
}
