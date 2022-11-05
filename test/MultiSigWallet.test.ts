import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Bytes, Contract } from "ethers";
import { ethers } from "hardhat";

type Transaction = {
  to: string;
  value: number;
  data: Bytes;
  executed: boolean;
  numConfirmations: number;
} 

let owner: SignerWithAddress;
let owner1: SignerWithAddress;
let owner2: SignerWithAddress;
let owner3: SignerWithAddress;
let otherAccount: SignerWithAddress;
let multiSigWallet: Contract;
let testContract: Contract;
describe("MultiSigWallet", function () {

  before(async function () {

    [owner, owner1, owner2, owner3, otherAccount] = await ethers.getSigners();
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    
    const owners = [owner1.address, owner2.address, owner3.address];
    multiSigWallet = await MultiSigWallet.deploy(owners, 2);

    const TestContract = await ethers.getContractFactory("TestContract");
    testContract = await TestContract.deploy();
  })

  it("test_submitTransaction_asNotOwner_thenRevert", async function () {
    const to = testContract.address;
    const value = 10;
    const data = await testContract.getData();
    
    await expect(multiSigWallet.submitTransaction(to, value, data)).to.be.revertedWith("not owner");
  });

  it("test_submitTransaction_asOwner_thenSuccess", async function () {
    const to = testContract.address;
    const value = 10;
    const data = await testContract.getData();
    
    const tx = await multiSigWallet.connect(owner1).submitTransaction(to, value, data);
    await expect(tx).to.emit(multiSigWallet, "SubmitTransaction").withArgs(owner1.address, 0, to, value, data);

    const transaction = await multiSigWallet.getTransaction(0);
    expect(transaction[0]).to.be.equal(to);
    expect(transaction[1]).to.be.equal(value);
    expect(transaction[2]).to.be.equal(data);
    expect(transaction[3]).to.be.equal(false);
    expect(transaction[4]).to.be.equal(0);
    
    expect(await multiSigWallet.isConfirmed(0, owner1.address)).to.be.equal(false);
  });

  it("test_confirmTransaction_asNotOwner_thenRevert", async function () {
    await expect(multiSigWallet.connect(otherAccount).confirmTransaction(0)).to.be.revertedWith("not owner");
  });

  it("test_confirmTransaction_withNonExistedIndex_thenRevert", async function () {
    await expect(multiSigWallet.connect(owner1).confirmTransaction(1)).to.be.revertedWith("tx does not exist");
  });

  it("test_confirmTransaction_withValidIndex_theSuccess", async function () {
    const to = testContract.address;
    const value = "10";
    const data = await testContract.getData();
    
    const tx = await multiSigWallet.connect(owner1).confirmTransaction(0);
    await expect(tx).to.emit(multiSigWallet, "ConfirmTransaction").withArgs(owner1.address, 0);

    const transaction = await multiSigWallet.getTransaction(0);
    expect(transaction[0]).to.be.equal(to);
    expect(transaction[1]).to.be.equal(value);
    expect(transaction[2]).to.be.equal(data);
    expect(transaction[3]).to.be.equal(false);
    expect(transaction[4]).to.be.equal(1);

    expect(await multiSigWallet.isConfirmed(0, owner1.address)).to.be.equal(true);
  });

  it("test_confirmTransaction_withAlreadyConfirmedIndex_thenRevert", async function () {
    await expect(multiSigWallet.connect(owner1).confirmTransaction(0)).to.be.revertedWith("tx already confirmed");
  });

  it("test_confirmTransaction_withAlreadyExcutedIndex_thenRevert", async function () {
    // add test logic to confirm the already executed transaction
  });

  it("test_executeTransaction_asNowOwner_thenRevert", async function () {
    await expect(multiSigWallet.connect(otherAccount).executeTransaction(0)).to.be.revertedWith("not owner");
  });

  it("test_executeTransaction_withNotExistedIndex_thenRevert", async function () {
    await expect(multiSigWallet.connect(owner1).executeTransaction(1)).to.be.revertedWith("tx does not exist");
  });

  it("test_executeTransaction_withValidIndexAndLessConfirmCount_thenRevert", async function () {
    await expect(multiSigWallet.connect(owner1).executeTransaction(0)).to.be.revertedWith("cannot execute tx");
  });

  it("test_executeTransaction_withValidIndexAndMoreConfirmCount_withNotValue_thenRevert", async function () {
    await multiSigWallet.connect(owner2).confirmTransaction(0);
    await expect(multiSigWallet.connect(owner1).executeTransaction(0)).to.be.revertedWith("tx failed");
  });
  
  it("test_executeTransaction_withValidIndexAndMoreConfirmCount_withValue_withRightCalldata_thenSuccess", async function () {
    await testContract.transferToMultiSigWallet(multiSigWallet.address, {value: "1000"});
    
    const tx = await multiSigWallet.connect(owner1).executeTransaction(0);
    await expect(tx).to.emit(multiSigWallet, "ExecuteTransaction").withArgs(owner1.address, 0);

    const to = testContract.address;
    const value = "10";
    const data = await testContract.getData();

    const transaction = await multiSigWallet.getTransaction(0);
    expect(transaction[0]).to.be.equal(to);
    expect(transaction[1]).to.be.equal(value);
    expect(transaction[2]).to.be.equal(data);
    expect(transaction[3]).to.be.equal(true);
    expect(transaction[4]).to.be.equal(2);

    expect (await testContract.i()).to.be.equal(123);
    
  });
  
  it("test_executeTransaction_withAlreadyExecutedIndex_thenRevert", async function () {
    await expect(multiSigWallet.connect(owner1).executeTransaction(0)).to.be.revertedWith("tx already executed");
  });
});
