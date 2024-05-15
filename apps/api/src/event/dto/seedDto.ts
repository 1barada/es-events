import { Event as EventModel } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsString } from "class-validator";

export class SeedDto {
  @IsArray()
  @Type(() => EventDto)
  events: EventDto[]
}

class EventDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsDate()
  date: Date;
  @IsString()
  organizer: string;
  @IsArray()
  @Type(() => Participant)
  participants: Participant[];
}

class Participant {
  @IsString()
  fullName: string;
  @IsString()
  email: string;   
  @IsDate()
  dateOfBirth: Date;
  @IsString()
  heardFrom: string;
  @IsDate()
  createdAt: Date;
}