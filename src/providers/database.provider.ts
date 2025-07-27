import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from '../types/database.types'

export const databaseProvider = {
    provide: 'DATABASE',
    useFactory: () => {
        const dialect = new PostgresDialect({
            pool: new Pool({
                host: process.env.DB_HOST || 'localhost',
                database: process.env.DB_NAME || 'charging_station_db',
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
            })
        })

        return new Kysely<Database>({
            dialect
        })
    }
}