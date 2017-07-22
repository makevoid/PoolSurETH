require('../test_lib/proto-test-matchers')
const chai      = require('chai')
require('../test_lib/chai-test-matchers')
const should    = chai.should()
const shouldNotBeZero = require('../test_lib/proto-test-matchers').shouldNotBeZero
const numsShouldEq    = require('../test_lib/proto-test-matchers').numsShouldEq
const c = console
const coinbase       = require("../test_lib/env-testrpc").coinbase
const coinbasePvtKey = require("../test_lib/env-testrpc").coinbasePvtKey
const Poolsureth = artifacts.require("./Poolsureth.sol")


contract('PoolSurETH', (accounts) => {

  it("matches the superadmin owner", async () => {
    const pse = await Poolsureth.deployed()
    const address = await pse.superAdmin()
    address.shouldNotBeEmpty()
    address.shouldMatchCoinbase()
  })

})
