pragma solidity ^0.4.11;

/* PoolSurETH - pool based "insurance" contract generator */
/*contract Poolsureth {

  address public superAdmin;

  function Poolsureth() {
    superAdmin = msg.sender;
  }

}*/

import "./usingOraclize.sol";

contract Poolsureth is usingOraclize {

    event newFlightTimeCheck(string flight_number);


    Policy[] public policies;

    struct Policy {
      uint    id;
      address addr;
    }


    /* ------- */

    /*boilerplate code to check if oraclize works*/

    string public ETHXBT;
    address public superAdmin;

    event newOraclizeQuery(string description);
    event newKrakenPriceTicker(string price);

    function Poolsureth() {
      /* dev */
      /*OAR = OraclizeAddrResolverI(...);*/

      superAdmin = msg.sender;
      /* TODO: use a proof in prod - proofType_TLSNotary | proofStorage_IPFS */
      oraclize_setProof(proofType_NONE);
      /*update();*/
    }

    function __callback(bytes32 myid, string result, bytes proof) {
        if (msg.sender != oraclize_cbAddress()) throw;
        ETHXBT = result;
        newKrakenPriceTicker(ETHXBT);
        update();
    }

    function update() payable {
        if (oraclize_getPrice("URL") > this.balance) {
            newOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHXBT).result.XETHXXBT.c.0");
        }
    }

}
