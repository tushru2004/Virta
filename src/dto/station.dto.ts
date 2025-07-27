import { IsString } from 'class-validator';

export class CreateStationDto {
    @IsString()
    name: string;

    @IsString()
    companyName: string;

    @IsString()
    stationTypeName: string;
}

export class UpdateStationDto {
    @IsString()
    name?: string;

    @IsString()
    companyName?: string;

    @IsString()
    stationTypeName?: string;
}