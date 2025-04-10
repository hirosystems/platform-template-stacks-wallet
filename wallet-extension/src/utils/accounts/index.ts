import { generateNewAccount, generateWallet } from "@stacks/wallet-sdk";
import { privateKeyToAddress, privateKeyToPublic } from "@stacks/transactions";
import { c32ToB58 } from "c32check";
import { Buffer } from "buffer";
import ecc from "@bitcoinerlab/secp256k1";
import { type Account } from "../types";

// generates the first 20 accounts for the user
async function generateInitialAccounts(mnemonic: string) {
  let wallet = await generateWallet({
    secretKey: mnemonic!,
    password: "",
  });

  let wallets = [wallet];

  for (let index = 0; index < 19; index++) {
    let newWallet = generateNewAccount(wallets[index]);
    wallets.push(newWallet);
  }

  let accounts: Account[] = [];

  for (let index = 0; index < 20; index++) {
    let path = `m/44'/5757'/0'/0/${index}`;

    let stxAddress = privateKeyToAddress(wallets[19].accounts[index].stxPrivateKey, "mainnet");

    let btcP2PKHAddress = c32ToB58(stxAddress);

    let pubkey = privateKeyToPublic(wallets[19].accounts[index].stxPrivateKey).toString();

    let privkey = wallets[19].accounts[index].stxPrivateKey;

    let btcP2TRAddress = await generateP2TR(pubkey);

    accounts.push({
      path,
      stxAddress,
      btcP2PKHAddress,
      btcP2TRAddress,
      pubkey,
      privkey,
    });
  }

  console.log("[StacksWallet]: First 20 accounts generated:");
  console.log(accounts);

  return accounts;
}

// generates the bitcoin P2TR (taproot) address for the user using bitcoinjs-lib
async function generateP2TR(pubkey: String) {
  // @ts-ignore
  // `bitcoin` is a global variable injected by the `bitcoinjs-lib.js` script in the `wallet-extension` directory
  bitcoin.initEccLib(ecc);

  // @ts-ignore
  const taproot = bitcoin.payments.p2tr({
    internalPubkey: Buffer.from(pubkey.slice(2), "hex"),
    // @ts-ignore
    network: bitcoin.networks.bitcoin,
  });

  return taproot.address;
}

export { generateInitialAccounts, generateP2TR };
