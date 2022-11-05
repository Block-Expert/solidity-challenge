import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";

type MyStruct = {
  name: string;
  nums: number[];
} 

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let abiDecode: Contract;
let encodedBytes: any;
describe("ABIDecode", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const AbiDecode = await ethers.getContractFactory("AbiDecode");
    abiDecode = await AbiDecode.deploy();
  })

  it("test_encode", async function () {
    const nums: number[] = [1, 2];
    const myStruct: MyStruct = {name: "name", nums};
    encodedBytes = await abiDecode.encode(1, owner.address, nums, myStruct);
    console.log(encodedBytes);
  });

  it("test_decode", async function () {
    const {x, addr, arr, myStruct} = await abiDecode.decode(encodedBytes)
    expect(x).to.be.equal(1);
    expect(addr).to.be.equal(owner.address);
    expect(arr[0]).to.be.equal(1);
    expect(arr[1]).to.be.equal(2);
    expect(myStruct.name).to.be.equal("name");
    expect(myStruct.nums[0]).to.be.equal(1);
    expect(myStruct.nums[1]).to.be.equal(2);
  });
});
