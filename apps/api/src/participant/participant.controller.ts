import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ParticipantService } from "./participant.service";
import { GetParticipantsDto } from "./dto/getParticipantsDto";
import { Participant } from "@prisma/client";
import { CreateParticipantDto } from "./dto/createParticipantDto";

@Controller('/participant')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @Get('/:eventId')
  async getParticipants(
    @Query('search') search: string,
    @Param() filter: GetParticipantsDto
  ): Promise<Participant[]> {
    filter.search = search;
    return this.participantService.getParticipants(filter);
  }

  @Post('/')
  async create(@Body() body: CreateParticipantDto): Promise<null> {
    return this.participantService.create(body);
  }
}