# PoolSurETH

pronounced a-la-francois: `pulsurette`


PoolSurETH is a Decentralized Insurance Configurator applied to any travel field (flights, trains, cruises etc...), potentially using any investing and reward scheme and connecting via any Ethereum Oracle.


### Dev (run contract test)

Run test rpc:

    <!-- OLD -->
    <!-- testrpc --mnemonic "antani" --accounts 10 -->

    testrpc --account="0xdccc4200d5c8738264dc8a9064c03cd5e06af653cac0c5b99e8634bb6175882c,0x1337000000000000000000000" --gasLimit 0x2FAF080


Clone and setup `oraclize/ethereum-bridge`:

    # cd somewhere
    git clone https://github.com/oraclize/ethereum-bridge && cd ethereum-bridge && npm i

Edit the bridge config file and add you key:

    echo '["dccc4200d5c8738264dc8a9064c03cd5e06af653cac0c5b99e8634bb6175882c"]' > config/instance/keys.json

run the bridge:

    node bridge -a 0 --dev --broadcast -H localhost:8545

<!-- node bridge -a 0 --dev -->
<!--

if the deterministic OAR doesn't works you need to specify it manually

get your OAR from the bridge's output and add it to the test:

    OAR = OraclizeAddrResolverI(0x...);
 -->

install truffle and npm modules:

    npm i -g truffle && npm i

run tests:

    truffle test


### useful setup docs/guides

- oraclize + truffle setup: https://ethereum.stackexchange.com/questions/11383/oracle-oraclize-it-with-truffle-and-testrpc

- ruby webapp boilerplate: https://github.com/makevoid/roda_haml_boilerplate_bulma
