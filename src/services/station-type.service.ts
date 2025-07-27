import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from '../types/database.types';
import { CreateStationTypeDto, UpdateStationTypeDto } from '../dto/station-type.dto';

@Injectable()
export class StationTypeService {
    constructor(
        @Inject('DATABASE') private db: Kysely<Database>
    ) {}

    async create(createStationTypeDto: CreateStationTypeDto) {
        const [stationType] = await this.db
            .insertInto('station_type')
            .values({
                name: createStationTypeDto.name,
                max_power: createStationTypeDto.maxPower,
            })
            .returning(['id', 'name', 'max_power'])
            .execute();

        return stationType;
    }

    async findAll() {
        return this.db
            .selectFrom('station_type')
            .selectAll()
            .execute();
    }

    async findOne(id: number) {
        const stationType = await this.db
            .selectFrom('station_type')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        if (!stationType) {
            throw new NotFoundException('Station type not found');
        }

        return stationType;
    }

    async update(id: number, updateStationTypeDto: UpdateStationTypeDto) {
        const [updated] = await this.db
            .updateTable('station_type')
            .set({
                name: updateStationTypeDto.name,
                max_power: updateStationTypeDto.maxPower,
            })
            .where('id', '=', id)
            .returning(['id', 'name', 'max_power'])
            .execute();

        if (!updated) {
            throw new NotFoundException('Station type not found');
        }

        return updated;
    }

    async remove(id: number) {
        const result = await this.db
            .deleteFrom('station_type')
            .where('id', '=', id)
            .executeTakeFirst();

        if (!result) {
            throw new NotFoundException('Station type not found');
        }
    }
}