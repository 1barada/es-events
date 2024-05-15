import { IsOptional, IsString, IsUUID } from "class-validator";

export class GetParticipantsDto {
  @IsUUID()
  eventId: string;

  @IsString()
  @IsOptional()
  search: string;
}