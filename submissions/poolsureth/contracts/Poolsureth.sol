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


    struct Policy {
      uint    id;
      address owner;
      uint    amount;
      string  flightCode;
      uint    arrivalTime;
      bool    delayed;
      bool    paid;
    }

    struct PoolSlice {
      uint    id;
      address owner;
      uint    amount;
      bool    withdrawn;
    }

    Policy[]    public policies;
    PoolSlice[] public pool_slices;

    /* client methods */

    function register(string _flightCode) payable {
      if (msg.value < 10000) return;  // you can't register without paying ethers

      // create policy
      Policy memory policy = Policy({
        id:          policies.length+1,
        owner:       msg.sender,
        amount:      msg.value,
        flightCode:  _flightCode,
        arrivalTime: 0,
        delayed:     false,
        paid:        false
      });
      policies.push(policy);

      /*if (users_balance[msg.sender] > 0) throw;*/
    }

    /* investor methods */

    function invest() payable {
      // create slice
      PoolSlice memory slice = PoolSlice({
        id:        pool_slices.length+1,
        owner:     msg.sender,
        amount:    msg.value,
        withdrawn: false
      });
      pool_slices.push(slice);
    }

    function withdraw(uint id) {
      PoolSlice memory slice = pool_slices[id-1];
      if ( slice.id != 0 ) {
        slice.withdrawn = true;
        pool_slices[id-1] = slice;
      }
    }

    /* oracle methods */

    function checkFlightTime() {

    }

    function payClient() {

    }


    /* accessor methods - getters */

    function getPolicy(uint id) constant returns(uint _id, address _owner, uint _amount, string flightCode, uint arrivalTime, bool delayed, bool paid) {
      Policy memory policy = policies[id-1];
      if ( policy.id != 0 ) {
        return (policy.id, policy.owner, policy.amount, policy.flightCode, policy.arrivalTime, policy.delayed, policy.paid);
      }
    }

    function getPoolSlice(uint id) constant returns(uint _id, address _owner, uint _amount, bool _withdrawn) {
      PoolSlice memory slice = pool_slices[id-1];
      if ( slice.id != 0 ) {
        return (slice.id, slice.owner, slice.amount, slice.withdrawn);
      }
    }

    /* counter methods */

    function policiesCount() constant returns(uint _count) {
      return policies.length;
    }

    function poolSlicesCount() constant returns(uint _count) {
      return pool_slices.length;
    }

    /* WIP */

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
