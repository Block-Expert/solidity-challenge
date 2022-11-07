import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let factory: Contract;
let factoryAssembly: Contract;
describe("Create2 test", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy();
    await factory.deployed();

    const FactoryAssembly = await ethers.getContractFactory("FactoryAssembly");
    factoryAssembly = await FactoryAssembly.deploy();

  })

  it("test_Factory_deploy", async function () {
    const foo = 10;
    const value = "100";
    const salt = keccak256(Buffer.from("my salt"));
    const testCreate = await factory.deploy(owner.address, foo, salt);
    console.log(testCreate);
    console.log("address: ", testCreate.address);
    const testCreateContract = await ethers.getContractAt('TestCreateContract', testCreate);


    expect(await testCreateContract.owner()).to.be.equal(owner.address);
    expect(await testCreateContract.foo()).to.be.equal(foo);
    expect(await testCreateContract.getBalance()).to.be.equal(value);
  });

  it("test_FactoryAsembly_deploy", async function () {
    const foo = 10;
    const value = "200"
    const salt = keccak256(Buffer.from("my salt1"));
    const bytecode = await factoryAssembly.getBytecode(owner.address, foo);
    const address = await factoryAssembly.getAddress(bytecode, salt);

    await factoryAssembly.deploy(bytecode, salt, {value: value});

    const testCreateContract = await ethers.getContractAt('TestCreateContract', address);

    expect(await testCreateContract.owner()).to.be.equal(owner.address);
    expect(await testCreateContract.foo()).to.be.equal(foo);
    expect(await testCreateContract.getBalance()).to.be.equal(value);
  })
});
