import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { packetCreated } from "../generated/Contract/Contract"

export function createpacketCreatedEvent(
  packetId: BigInt,
  isEqule: boolean,
  count: i32,
  amount: BigInt
): packetCreated {
  let packetCreatedEvent = changetype<packetCreated>(newMockEvent())

  packetCreatedEvent.parameters = new Array()

  packetCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "packetId",
      ethereum.Value.fromUnsignedBigInt(packetId)
    )
  )
  packetCreatedEvent.parameters.push(
    new ethereum.EventParam("isEqule", ethereum.Value.fromBoolean(isEqule))
  )
  packetCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "count",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(count))
    )
  )
  packetCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return packetCreatedEvent
}
