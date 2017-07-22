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

const assertEvent =  (contract, eventName, filter) => {
  return new Promise((resolve, reject) => {
    var event = contract[eventName]()
    event.watch()
    event.get((error, logs) => {
      var log = logs.filter(filter)
      if (log) {
        resolve(log)
      } else {
        throw Error(`Failed to find filtered event for ${filter.event}`)
      }
    })
    event.stopWatching()
  })
}

contract('PoolSurETH', (accounts) => {

  it("matches the superadmin owner", async () => {
    const pse = await Poolsureth.deployed()
    const address = await pse.superAdmin()
    address.shouldNotBeEmpty()
    address.shouldMatchCoinbase()
  })

  it("creates a policy", async () => {
    const pse = await Poolsureth.deployed()
    const flightNumber = "BA1382"
    await pse.register(flightNumber)

    const count = await pse.policiesCount()
    count.should.be.numEqual(1)

    let id, owner, amount, flightCode, arrivalTime, delayed, paid
    [id, owner, amount, flightCode, arrivalTime, delayed, paid] = await pse.getPolicy(1)

    id.should.be.numEqual(1)
    delayed.should.be.false
  })


  return;

  it("checks oraclize", async () => {
    const pse = await Poolsureth.deployed()
    const value = await pse.ETHXBT()
    console.log("VALUE:", value)

    await pse.update({ value: web3.toWei(0.005, "ether") })

    assertEvent(pse, "newOraclizeQuery", (log) => {
      c.log("LOG:", log.args)
    })


    setInterval(async () => {
      assertEvent(pse, "newKrakenPriceTicker", (log) => {
        c.log("LOG:", log.args)
      })

      const value = await pse.ETHXBT()
      console.log("VALUE:", value)
    }, 5000)

    setTimeout(async () => {
      const value = await pse.ETHXBT()
      console.log("VALUE:", value)

    }, 500000)


  })

})
