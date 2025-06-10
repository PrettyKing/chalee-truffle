import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { packetCreated } from "../generated/schema"
import { packetCreated as packetCreatedEvent } from "../generated/Contract/Contract"
import { handlepacketCreated } from "../src/contract"
import { createpacketCreatedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let packetId = BigInt.fromI32(234)
    let isEqule = "boolean Not implemented"
    let count = 123
    let amount = BigInt.fromI32(234)
    let newpacketCreatedEvent = createpacketCreatedEvent(
      packetId,
      isEqule,
      count,
      amount
    )
    handlepacketCreated(newpacketCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("packetCreated created and stored", () => {
    assert.entityCount("packetCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "packetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "packetId",
      "234"
    )
    assert.fieldEquals(
      "packetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "isEqule",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "packetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "count",
      "123"
    )
    assert.fieldEquals(
      "packetCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
