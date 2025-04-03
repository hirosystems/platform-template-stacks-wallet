import { Cl } from "@stacks/transactions"
import { describe, expect, it } from "vitest"

const accounts = simnet.getAccounts()
const address1 = accounts.get("wallet_1")!

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/stacks/clarinet-js-sdk
*/

describe("counter contract tests", () => {
  it("ensures simnet is well initialised", () => {
    expect(simnet.blockHeight).toBeDefined()
  })

  it("increments counter", () => {
    const { result } = simnet.callReadOnlyFn("counter", "get-count", [], address1)
    expect(result).toBeUint(0)

    let countResult = simnet.callPublicFn("counter", "increment", [], address1)
    expect(countResult.result).toBeOk(Cl.bool(true))
  })
})
