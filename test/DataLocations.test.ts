import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let dataLocations: Contract;
describe("DataLocations", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const DataLocations = await ethers.getContractFactory("DataLocations");
    dataLocations = await DataLocations.deploy();
  })

  it("test_function1", async function () {
    await dataLocations.f();
    expect(await dataLocations.arr(0)).to.equal(10);
  });
});
