const Poolsureth = artifacts.require("./Poolsureth.sol")

module.exports = (deployer) => {
  deployer.deploy(Poolsureth)
}
