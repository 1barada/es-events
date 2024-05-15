import { Event } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

const sortingFields = <const> ['title', 'organizer', 'date'];

type SortingField = keyof Pick<Event, typeof sortingFields[number]>;

export class GetEventsDto {
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  take?: number;

  @IsIn(sortingFields)
  @IsString()
  @IsOptional()
  sortBy?: SortingField;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  desc: boolean;
}