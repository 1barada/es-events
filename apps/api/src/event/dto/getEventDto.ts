import { IsUUID } from "class-validator";

export class GetEventDto {
  @IsUUID()
  id: string;
}