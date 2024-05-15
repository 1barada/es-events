import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsString, IsUUID, Length, MaxLength } from "class-validator";

enum HeardFrom {
  SocialMedia = 'social media',
  Friends = 'friends',
  FoundMyself = 'found myself'
}

export class CreateParticipantDto {
  @IsUUID()
  eventId: string;

  @Length(1, 20)
  @IsString()
  fullName: string;

  @MaxLength(30)
  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsEnum(HeardFrom)
  heardFrom: HeardFrom;
}