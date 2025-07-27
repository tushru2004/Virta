import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateStationTypeDto {
    @IsString()
    name: string;

    @IsNumber()
    maxPower: number;  // This will map to max_power in the database
}

export class UpdateStationTypeDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    maxPower?: number;  // This will map to max_power in the database
}