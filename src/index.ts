import { ethers } from "ethers";

function getEth() {
  // @ts-ignore
  const eth = window.ethereum;
  if (!eth) {
    throw new Error("get metamask and a positive attitude");
  }
  return eth;
}

async function hasAccounts() {
  const eth = getEth();
  const accounts = await eth.request({method: "eth_accounts"}) as string[];
  return accounts && accounts.length;
}

async function requestAccounts() {
  const eth = getEth();
  const accounts = await eth.request({method: "eth_requestAccounts"}) as string[];
  return accounts && accounts.length;
}

async function run() {
  if (!(await hasAccounts()) && !(await requestAccounts())) {
    throw new Error("no accounts found ")
  }
  const address = process.env.CONTRACT_ADDRESS;
  const provider = new ethers.providers.Web3Provider(getEth());
  const contract = new ethers.Contract(
    address,
    [
      "function count() public",
      "function getCounter() public view return (uint32)"
    ],
    // @ts-ignore
    provider
  );
  console.log("Run it!!!");
  // document.body.innerHTML = await contract.hello();
  const el = document.createElement("div");
  async function setCounter() {
    el.innerHTML = await contract.getCounter();
  }
  setCounter();
  const button = document.createElement("button");
  button.innerText = "increment";
  button.onclick = async function() {
    await contract.count();
    setCounter();
  }
  document.body.appendChild(el);
  document.body.appendChild(button);
  // console.log(await contract.hello());
}

run();