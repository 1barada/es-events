import { Injectable } from "@nestjs/common";
import { Participant } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { GetParticipantsDto } from "./dto/getParticipantsDto";
import { CreateParticipantDto } from "./dto/createParticipantDto";

@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService) {}

  async create({ eventId, fullName, email, dateOfBirth, heardFrom }: CreateParticipantDto): Promise<null> {
    await this.prisma.event.update({
      where: {
        id: eventId
      }, 
      data: {
        participants: {
          create: {
            fullName,
            email,
            dateOfBirth,
            heardFrom,
            createdAt: new Date()
          }
        }
      }
    });

    return null;
  }

  async getParticipants({ eventId, search }: GetParticipantsDto): Promise<Participant[]> {
    const response = await this.prisma.event.findFirstOrThrow({
      where: {
        id: eventId
      },
      select: {
        participants: search ? ({
          where: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        }) : true
      }
    });

    return response.participants;
  }
}