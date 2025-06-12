import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { DataReceived, Log } from "../generated/LogChain/LogChain"

export function createDataReceivedEvent(
  data: string,
  sender: Address,
  value: BigInt
): DataReceived {
  let dataReceivedEvent = changetype<DataReceived>(newMockEvent())

  dataReceivedEvent.parameters = new Array()

  dataReceivedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromString(data))
  )
  dataReceivedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  dataReceivedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return dataReceivedEvent
}

export function createLogEvent(data: string): Log {
  let logEvent = changetype<Log>(newMockEvent())

  logEvent.parameters = new Array()

  logEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromString(data))
  )

  return logEvent
}
