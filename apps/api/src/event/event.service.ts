import { Injectable, Logger } from "@nestjs/common";
import { Event as EventModel, Participant } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { GetEventsDto } from "./dto/getEventsDto";
import { SeedDto } from "./dto/seedDto";
import { GetEventDto } from "./dto/getEventDto";
import { EventActivityDto } from "./dto/eventActivityDto";

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getEvents({ skip, take, sortBy, desc }: GetEventsDto): Promise<{total: number; events: EventModel[]}> {
    const [ total, events ] = await this.prisma.$transaction([
      this.prisma.event.count(),
      this.prisma.event.findMany({
        skip: skip || 0,
        take: take || 8,
        orderBy: sortBy ? [{
          [sortBy]: desc ? 'desc' : 'asc'
        }] : undefined
      })
    ]);

    return {
      total,
      events
    }
  }

  async getEvent({ id }: GetEventDto): Promise<EventModel & { participants: Participant[] }> {
    return this.prisma.event.findFirstOrThrow({
      where: {
        id 
      },
      include: {
        participants: true
      }
    });
  }

  async getEventActivity({ id }: GetEventDto): Promise<EventActivityDto> {
    const lte = new Date();
    const gte = new Date();
    gte.setHours(0);
    gte.setMinutes(0);
    gte.setSeconds(0);
    gte.setMilliseconds(0);
    gte.setDate(gte.getDate() - 6);

    const participants = (await this.prisma.event.findFirstOrThrow({
      where: {
        id
      },
      select: {
        participants: {
          where: {
            createdAt: {
              lte,
              gte
            }
          },
          select: {
            createdAt: true
          }
        }
      }
    })).participants;
    
    const eventActivity: EventActivityDto = {}
    participants.forEach(({ createdAt }) => {
      const day = createdAt.getDay();

      if (day in eventActivity) eventActivity[day] = eventActivity[day] + 1;
      else eventActivity[day] = 1;
    });

    return eventActivity;
  }

  async seed({events}: SeedDto): Promise<null> {
    await Promise.all([events.map(async ({title, description, organizer, date, participants}) => {
      return await this.prisma.event.create({
        data: {
          title,
          description,
          organizer,
          date: new Date(date), 
          participants: {
            create: [
              ...participants.map(({dateOfBirth, createdAt, ...part}) => ({
                ...part, 
                dateOfBirth: new Date(dateOfBirth), 
                createdAt: new Date(createdAt)
              })),
            ]
          }
        }
      })
    })]);
    
    return null;
  }
}