const usingOraclize   = artifacts.require("./usingOraclize.sol")
const solidityStringutils = artifacts.require("./solidity_stringutils.sol")
const Poolsureth = artifacts.require("./Poolsureth.sol")

module.exports = async (deployer) => {
  deployer.deploy(usingOraclize)
  deployer.deploy(solidityStringutils)
  deployer.link(usingOraclize, Poolsureth)
  deployer.link(solidityStringutils, Poolsureth)
  deployer.deploy(Poolsureth)
}
