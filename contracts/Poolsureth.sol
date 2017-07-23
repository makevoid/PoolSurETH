pragma solidity ^0.4.11;

import "./usingOraclize.sol";
import "./solidity_stringutils.sol";

contract Poolsureth is usingOraclize {

    event newFlightTimeCheck(string flight_number);

    address public admin;

    function Poolsureth() {
      // the admin can't do anything at the moment, we just record the address that deployed the contract
      admin = msg.sender;
    }

    struct Policy {
      uint    id;
      address owner;
      uint    amount;
      string  flightCode;
      uint    arrivalTime;
      bool    delayed;
      bool    paid;
      bool    complete;
    }

    struct PoolSlice {
      uint    id;
      address owner;
      uint    amount;
      bool    withdrawn;
    }

    Policy[]    public policies;
    PoolSlice[] public pool_slices;

    /* url + json query (oraclize uses a format similar to jq's cli-tool) */
    string constant query_p0 =
    "json(https://mkvd.eu.ngrok.io/api/flights/providers/flightaware/flights/";
    /* part 1 is :id */
    string constant query_p2 = ").FlightInfoExResult.flights[-1]";
    /* we get only the last flight [-1] for simplicity but we should map trough them and find the desired one (ideally we should make the user select it via an UI or handle the search via the contract [#overkill ^^]) */


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
        paid:        false,
        complete:    false
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
      if(msg.sender != slice.owner) throw;
      if ( slice.id != 0 && !slice.withdrawn) {
        slice.withdrawn = true;
        pool_slices[id-1] = slice;
      }

      if(!slice.owner.send(slice.amount)) throw;
    }

    /* oracle methods */

    event newOraclizeQuery(string description);

    function checkFlightTime() {
      if (oraclize_getPrice("URL") > this.balance) {
        newOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
      } else {
        string memory query_p1 = "BEE1337";
        string memory query = strConcat(
          query_p0,
          query_p1,
          query_p2
        );

        newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query(60, "URL", query);
      }
    }

    string public debug;

    function __callback(bytes32 myid, string result, bytes proof) {
      if (msg.sender != oraclize_cbAddress()) throw;
      debug = result;

      /* todo: trigger another function */
    }

    function payClient() {

    }


    /* accessor methods - getters */

    function getPolicy(uint id) constant returns(uint _id, address _owner, uint _amount, string flightCode, uint arrivalTime, bool delayed, bool paid, bool complete) {
      Policy memory policy = policies[id-1];
      if ( policy.id != 0 ) {
        return (policy.id, policy.owner, policy.amount, policy.flightCode, policy.arrivalTime, policy.delayed, policy.paid, policy.complete);
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

}
