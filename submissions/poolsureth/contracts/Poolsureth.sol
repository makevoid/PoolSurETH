pragma solidity ^0.4.11;

/* PoolSurETH - pool based "insurance" contract generator */
contract Poolsureth {

  address public superAdmin;

  function Poolsureth() {
    superAdmin = msg.sender;
  }

}
