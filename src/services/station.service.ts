import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from '../types/database.types';
import { CreateStationDto, UpdateStationDto } from '../dto/station.dto';

@Injectable()
export class StationService {
  constructor(
    @Inject('DATABASE') private db: Kysely<Database>
  ) {}

  async create(createStationDto: CreateStationDto) {
    const company = await this.db
        .selectFrom('company')
        .select('id')
        .where('name', '=', createStationDto.companyName)
        .executeTakeFirst();

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const stationType = await this.db
      .selectFrom('station_type')
      .select('id')
      .where('name', '=', createStationDto.stationTypeName)
      .executeTakeFirst();

    if (!stationType) {
      throw new NotFoundException('Station type not found');
    }

    const station = await this.db
      .insertInto('station')
      .values({
        name: createStationDto.name,
        company_id: company.id,
        station_type_id: stationType.id
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return station;
  }

  async findAll() {
    return this.db
        .selectFrom('station')
        .selectAll()
        .execute();
  }

  async findOne(id: number) {
    const station = await this.db
        .selectFrom('station')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();

    if (!station) {
      throw new NotFoundException('Station not found');
    }

    return station;
  }

  // async update(id: number, updateStationDto: UpdateStationDto) {
  //   const exists = await this.db
  //     .selectFrom('station')
  //     .select('id')
  //     .where('id', '=', id)
  //     .executeTakeFirst();
  //
  //   if (!exists) {
  //     throw new NotFoundException('Station not found');
  //   }
  //
  //   if (updateStationDto.companyId) {
  //     const company = await this.db
  //       .selectFrom('company')
  //       .select('id')
  //       .where('id', '=', updateStationDto.companyId)
  //       .executeTakeFirst();
  //
  //     if (!company) {
  //       throw new NotFoundException('Company not found');
  //     }
  //   }
  //
  //   if (updateStationDto.stationTypeId) {
  //     const stationType = await this.db
  //       .selectFrom('station_type')
  //       .select('id')
  //       .where('id', '=', updateStationDto.stationTypeId)
  //       .executeTakeFirst();
  //
  //     if (!stationType) {
  //       throw new NotFoundException('Station type not found');
  //     }
  //   }
  //
  //   const updated = await this.db
  //     .updateTable('station')
  //     .set({
  //       name: updateStationDto.name,
  //       company_id: updateStationDto.companyId,
  //       station_type_id: updateStationDto.stationTypeId
  //     })
  //     .where('id', '=', id)
  //     .returningAll()
  //     .executeTakeFirst();
  //
  //   if (!updated) {
  //     throw new NotFoundException('Station not found');
  //   }
  //
  //   return updated;
  // }

  async remove(id: number) {
    const deleted = await this.db
      .deleteFrom('station')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    if (!deleted) {
      throw new NotFoundException('Station not found');
    }
  }
}