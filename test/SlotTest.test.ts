import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

type MyStruct = {
  name: string;
  nums: number[];
} 

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let slotTest: Contract;
let encodedBytes: any;
describe("SlotTest test", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const SlotTest = await ethers.getContractFactory("SlotTest");
    slotTest = await SlotTest.deploy();
  })

  it("test_slot", async function () {
    const value_before_set0 = await slotTest.get(0);
    const value_before_set1 = await slotTest.get(1);

    expect(value_before_set0).to.be.equal(123);
    expect(value_before_set1).to.be.equal(456);

    await slotTest.set(0, 777);
    await slotTest.set(1, 888);

    const value_after_set0 = await slotTest.get(0);
    const value_after_set1 = await slotTest.get(1);

    expect(value_after_set0).to.be.equal(777);
    expect(value_after_set1).to.be.equal(888);
  });
});
