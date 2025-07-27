import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StationService } from '../services/station.service';
import {CompanyService} from "../services/company.service";
import {CreateCompanyDto, UpdateCompanyDto} from "../dto/company.dto";
import {CreateStationDto} from "../dto/station.dto";

@Controller('stations')
export class StationControllers {
    constructor(private readonly stationService: StationService) {}
    @Post()
    create(@Body() createCompanyDto: CreateStationDto) {
        return this.stationService.create(createCompanyDto);
    }

    @Get()
    findAll() {
        return this.stationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stationService.findOne(+id);
    }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    //     return this.stationService.update(+id, updateCompanyDto);
    // }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.stationService.remove(+id);
    }
}