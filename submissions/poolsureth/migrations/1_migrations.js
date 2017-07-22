var Migrations = artifacts.require("./Migrations.sol")

module.exports = (deployer) => {
  deployer.deploy(Migrations)
}

// 1e10 -> 10000000000
