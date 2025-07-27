import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    parentCompanyId?: number;
}

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    parentCompanyId?: number;
}