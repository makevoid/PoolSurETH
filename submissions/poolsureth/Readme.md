# PoolSurETH

pronounced a-la-francois: `pulsurette`


### Dev (run contract test)

run test rpc:

    testrpc --mnemonic "antani" --accounts 10

clone and setup `oraclize/ethereum-bridge`:

    # cd somewhere
    git clone https://github.com/oraclize/ethereum-bridge && cd ethereum-bridge && npm i

run the bridge:

    node bridge -a 0

get your OAR from the bridge's output and add it to the test:

    OAR = OraclizeAddrResolverI(0x...);

probably in the latest versions it's always:

    OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);


install truffle and npm modules:

    npm i -g truffle && npm i

run tests:

    truffle test


### useful setup docs/guides

- oraclize + truffle setup: https://ethereum.stackexchange.com/questions/11383/oracle-oraclize-it-with-truffle-and-testrpc
