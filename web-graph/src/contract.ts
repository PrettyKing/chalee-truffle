import { packetCreated as packetCreatedEvent } from "../generated/Contract/Contract"
import { packetCreated } from "../generated/schema"

export function handlepacketCreated(event: packetCreatedEvent): void {
  let entity = new packetCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.packetId = event.params.packetId
  entity.isEqule = event.params.isEqule
  entity.count = event.params.count
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
