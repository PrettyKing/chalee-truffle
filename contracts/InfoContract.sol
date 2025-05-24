// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract InfoContract {
    string name;
    uint256 age;

    // 事件
    event Instructor(string name, uint256 age);

    function setInfo(string memory _name, uint256 _age) public {
        name = _name;
        age = _age;
        //触发一下前端监听
        emit Instructor(_name, _age);
    }

    function sayHi() public pure returns (string memory) {
        return "Hello World!";
    }

    function getInfo() public view returns (string memory, uint256) {
        return (name, age);
    }
}
