# PoolSurETH

pronounced a-la-francois: `pulsurette`


### Dev (run contract test)

run test rpc:

    testrpc --mnemonic "antani" --accounts 10

clone and setup `oraclize/ethereum-bridge`:

    # cd somewhere
    git clone https://github.com/oraclize/ethereum-bridge && cd ethereum-bridge && npm i

edit the bridge config file and add you key:

    echo "dccc4200d5c8738264dc8a9064c03cd5e06af653cac0c5b99e8634bb6175882c" > config/instance/keys.json

run the bridge:

    node bridge -a 0 --dev --broadcast -H localhost:8545

<!-- node bridge -a 0 --dev -->

get your OAR from the bridge's output and add it to the test:

    OAR = OraclizeAddrResolverI(0x...);

in the latest versions tge address is deterministic:

    # --dev
    OAR = OraclizeAddrResolverI(0x40646205869a3d53B6FD7832D829E40F24715e60);

    # non dev
    OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);



install truffle and npm modules:

    npm i -g truffle && npm i

run tests:

    truffle test


### useful setup docs/guides

- oraclize + truffle setup: https://ethereum.stackexchange.com/questions/11383/oracle-oraclize-it-with-truffle-and-testrpc
