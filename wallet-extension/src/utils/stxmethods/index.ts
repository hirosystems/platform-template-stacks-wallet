import { encodeMessage } from "@stacks/encryption";
import {
  signMessageHashRsv,
  privateKeyToPublic,
  privateKeyToAddress,
  transactionToHex,
  makeContractCall,
  broadcastTransaction,
} from "@stacks/transactions";
import { generateWallet } from "@stacks/wallet-sdk";
import { c32ToB58 } from "c32check";
import { generateP2TR } from "../accounts";
import { hashUint8Array } from "../helpers";
import {
  type Methods,
  type MethodResult,
  type MethodParams,
  JsonRpcErrorCode,
  JsonRpcError,
} from "@stacks/connect";
import type { JsonRpcResponse } from "@stacks/connect/dist/types/methods";
import type { JsonRpcRequest } from "@/utils/types";

// handles method `stx_signMessage`
async function handleSignMessage(payload: JsonRpcRequest, mnemonic: string, accountIndex: number) {
  let params: MethodParams<"stx_signMessage"> = payload.params;

  let wallet = await generateWallet({
    secretKey: mnemonic,
    password: "",
  });

  const LEGACY_PREFIX = "\x18Stacks Message Signing:\n";
  let encodedMessage = encodeMessage(params["message"], LEGACY_PREFIX);
  let messageHash = await hashUint8Array(encodedMessage);

  let signature = signMessageHashRsv({
    messageHash,
    privateKey: wallet.accounts[accountIndex].stxPrivateKey,
  });

  let result: MethodResult<"stx_signMessage"> = {
    signature,
    publicKey: String(privateKeyToPublic(wallet.accounts[accountIndex].stxPrivateKey)),
  };

  let response: JsonRpcResponse<"stx_signMessage"> = {
    jsonrpc: "2.0",
    id: payload.id,
    result: result,
  };

  return {
    method: payload.method,
    status: "COMPLETE",
    data: response,
  };
}

// handles method getAddresses
async function handleGetAddresses(payload: JsonRpcRequest, mnemonic: string, accountIndex: number) {
  let params: MethodParams<"getAddresses"> = payload.params;

  let wallet = await generateWallet({
    secretKey: mnemonic,
    password: "",
  });

  let pubKey = privateKeyToPublic(wallet.accounts[accountIndex].stxPrivateKey).toString();
  let stxAddress = privateKeyToAddress(wallet.accounts[accountIndex].stxPrivateKey, "mainnet");
  let btcP2PKHAddress = c32ToB58(stxAddress);
  let btcP2TRAddress = await generateP2TR(pubKey);

  let response: JsonRpcResponse<"getAddresses"> = {
    jsonrpc: "2.0",
    id: payload.id,
    result: {
      addresses: [
        {
          symbol: "BTC",
          address: btcP2PKHAddress,
          publicKey: pubKey,
        },
        {
          symbol: "BTC",
          address: btcP2TRAddress,
          publicKey: pubKey,
        },
        {
          symbol: "STX",
          address: stxAddress,
          publicKey: pubKey,
        },
      ],
    },
  };

  return {
    method: "getAddresses",
    status: "COMPLETE",
    data: response,
  };
}

// handles method stx_callContract
async function handleCallContract(payload: JsonRpcRequest, mnemonic: string, accountIndex: number) {
  let params: MethodParams<"stx_callContract"> = payload.params;

  let wallet = await generateWallet({
    secretKey: mnemonic,
    password: "",
  });

  let response: JsonRpcResponse<"stx_callContract"> | JsonRpcError;

  try {
    let transaction = await makeContractCall({
      contractAddress: params.contract.split(".")[0],
      contractName: params.contract.split(".")[1],
      functionName: params.functionName,
      // @ts-ignore
      functionArgs: params.functionArgs,
      senderKey: wallet.accounts[accountIndex].stxPrivateKey,
      // @ts-ignore
      network: params.network,
    });

    // @ts-ignore
    const broadcasted = await broadcastTransaction({ transaction, network: params.network });

    response = {
      jsonrpc: "2.0",
      id: payload.id,
      result: {
        txid: broadcasted.txid,
        transaction: transactionToHex(transaction),
      },
    };
  } catch (error) {
    response = {
      jsonrpc: "2.0",
      id: payload.id,
      error: {
        code: JsonRpcErrorCode.UnknownError,
        message: "Unknown error",
        // @ts-ignore
        data: error,
      },
    };
  }

  return {
    method: payload.method,
    status: "COMPLETE",
    data: response,
  };
}

export { handleSignMessage, handleGetAddresses, handleCallContract };
