type Account = {
  path: String;
  stxAddress: String;
  btcP2PKHAddress: String;
  btcP2TRAddress: String;
  pubkey: String;
  privkey: String;
};

type JsonRpcRequest = {
  jsonrpc: string;
  id: string;
  method: string;
  params: any;
};

type Result = {
  method: string;
  status: string;
  data: Object;
};

export type { Account, JsonRpcRequest, Result };
