import { Module } from "@nestjs/common";
import { EventModule } from "./event/event.module";
import { ParticipantModule } from "./participant/participant.module";

@Module({
  imports: [EventModule, ParticipantModule],
})
export class AppModule {}