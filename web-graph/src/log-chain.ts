import {
  DataReceived as DataReceivedEvent,
  Log as LogEvent
} from "../generated/LogChain/LogChain"
import { DataReceived, Log } from "../generated/schema"

export function handleDataReceived(event: DataReceivedEvent): void {
  let entity = new DataReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.data = event.params.data
  entity.sender = event.params.sender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLog(event: LogEvent): void {
  let entity = new Log(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
