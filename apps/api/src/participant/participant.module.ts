import { Module } from "@nestjs/common";
import { ParticipantController } from "./participant.controller";
import { ParticipantService } from "./participant.service";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService, PrismaService]
})
export class ParticipantModule {}