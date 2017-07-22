const usingOraclize   = artifacts.require("./usingOraclize.sol")
const Poolsureth = artifacts.require("./Poolsureth.sol")

module.exports = async (deployer) => {
  deployer.deploy(usingOraclize)
  deployer.link(usingOraclize, Poolsureth)
  deployer.deploy(Poolsureth)
}
