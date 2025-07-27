import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from '../types/database.types';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { StationResponse } from '../interfaces/station-response.interface';

@Injectable()
export class CompanyService {
    constructor(
        @Inject('DATABASE') private db: Kysely<Database>
    ) {}

    async create(createCompanyDto: CreateCompanyDto) {
        if (createCompanyDto.parentCompanyId) {
            const parentExists = await this.db
                .selectFrom('company')
                .select('id')
                .where('id', '=', createCompanyDto.parentCompanyId)
                .executeTakeFirst();

            if (!parentExists) {
                throw new NotFoundException('Parent company not found');
            }
        }

        const result = await this.db
            .insertInto('company')
            .values({
                name: createCompanyDto.name,
                parent_company_id: createCompanyDto.parentCompanyId || null,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return result;
    }

    async findAll() {
        const companies = await this.db
            .selectFrom('company')
            .selectAll()
            .execute();

        return companies;
    }

    async findOne(id: number) {
        const company = await this.db
            .selectFrom('company')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        return {
            ...company,
        };
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto) {
        if (updateCompanyDto.parentCompanyId) {
            const parentExists = await this.db
                .selectFrom('company')
                .select('id')
                .where('id', '=', updateCompanyDto.parentCompanyId)
                .executeTakeFirst();

            if (!parentExists) {
                throw new NotFoundException('Parent company not found');
            }
        }

        const updated = await this.db
            .updateTable('company')
            .set({
                name: updateCompanyDto.name,
                parent_company_id: updateCompanyDto.parentCompanyId || null,
            })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        if (!updated) {
            throw new NotFoundException('Company not found');
        }

        return updated;
    }

    async remove(id: number) {
        const deleted = await this.db
            .deleteFrom('company')
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        if (!deleted) {
            throw new NotFoundException('Company not found');
        }
    }

    async getAllStationsForCompanyAndChildren(companyId: number): Promise<StationResponse[]> {
        type CompanyTreeResult = Pick<Database['company'], 'id'>;
        type StationQueryResult = {
            stationId: number;
            stationName: string;
            maxPower: number;
        };

        const result = await this.db
            .withRecursive('company_tree', (db) =>
                db
                    .selectFrom('company')
                    .select(['id'])
                    .where('id', '=', companyId)
                    .union(
                        db
                            .selectFrom('company')
                            .select(['company.id'])
                            .innerJoin('company_tree', 'company_tree.id', 'company.parent_company_id')
                    )
            )
            .selectFrom('station')
            .innerJoin('company_tree', 'company_tree.id', 'station.company_id')
            .innerJoin('station_type', 'station_type.id', 'station.station_type_id')
            .select([
                'station.id as stationId',
                'station.name as stationName',
                'station_type.max_power as maxPower'
            ])
            .execute();

        return result.map((station: StationQueryResult) => ({
            stationId: station.stationId,
            stationName: station.stationName,
            maxPower: station.maxPower
        }));
    }
}