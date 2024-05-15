import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { EventService } from "./event.service";
import { GetEventsDto } from "./dto/getEventsDto";
import { SeedDto } from "./dto/seedDto";
import { Event as EventModel, Participant } from "@prisma/client";
import { GetEventDto } from "./dto/getEventDto";
import { EventActivityDto } from "./dto/eventActivityDto";

@Controller({ path: '/event' })
export class EventController {
  constructor(private eventService: EventService) {}
  
  @Get('/')
  async getEvents(@Query() query: GetEventsDto): Promise<{total: number; events: EventModel[]}> {
    return this.eventService.getEvents(query);
  }

  @Get('/:id')
  async getEvent(@Param() params: GetEventDto): Promise<EventModel & { participants: Participant[] }> {
    return this.eventService.getEvent(params);
  }

  @Get('/activity/:id')
  async getEventActivity(@Param() params: GetEventDto): Promise<EventActivityDto> {
    return this.eventService.getEventActivity(params);
  }

  @Post('/')
  async seed(@Body() events: SeedDto): Promise<null> {
    return this.eventService.seed(events);
  }
}