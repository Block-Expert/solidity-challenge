import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let carFactory: Contract;
describe("CreateContract", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const CarFactory = await ethers.getContractFactory("CarFactory");
    carFactory = await CarFactory.deploy();
  })

  it("test_create", async function () {
    await carFactory.create(owner.address, "benz");

    const car = await carFactory.getCar(0);

    expect(await car[0]).to.be.equal(owner.address);
    expect(await car[1]).to.be.equal("benz");
    expect(await car[2]).to.be.equal(await carFactory.cars(0));
    expect(await car[3]).to.be.equal(0);
  });

  it("test_createAndSendEther", async function () {
    await carFactory.createAndSendEther(owner.address, "lexus", {value: "10"});

    const car = await carFactory.getCar(1);

    expect(await car[0]).to.be.equal(owner.address);
    expect(await car[1]).to.be.equal("lexus");
    expect(await car[2]).to.be.equal(await carFactory.cars(1));
    expect(await car[3]).to.be.equal(10);
  });

  it("test_create2", async function () {
    await carFactory.create2(owner.address, "land", "0xbec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c53");

    const car = await carFactory.getCar(2);

    expect(await car[0]).to.be.equal(owner.address);
    expect(await car[1]).to.be.equal("land");
    expect(await car[2]).to.be.equal(await carFactory.cars(2));
    expect(await car[3]).to.be.equal(0);
  });

  it("test_createAndSendEther", async function () {
    await carFactory.create2AndSendEther(owner.address, "ford", {value: "10", salt: 0x01});

    const car = await carFactory.getCar(3);

    expect(await car[0]).to.be.equal(owner.address);
    expect(await car[1]).to.be.equal("ford");
    expect(await car[2]).to.be.equal(await carFactory.cars(3));
    expect(await car[3]).to.be.equal(10);
  });

});
