import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StationTypeService } from '../services/station-type.service';
import { CreateStationTypeDto, UpdateStationTypeDto } from '../dto/station-type.dto';

@Controller('station_types')
export class StationTypeController {
    constructor(private readonly stationTypeService: StationTypeService) {}

    @Post()
    create(@Body() createStationTypeDto: CreateStationTypeDto) {
        return this.stationTypeService.create(createStationTypeDto);
    }

    @Get()
    findAll() {
        return this.stationTypeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stationTypeService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateStationTypeDto: UpdateStationTypeDto) {
        return this.stationTypeService.update(+id, updateStationTypeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.stationTypeService.remove(+id);
    }
}