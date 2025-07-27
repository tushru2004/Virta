import { Generated } from 'kysely'

export interface Database {
    company: {
        id: Generated<number>
        name: string
        parent_company_id: number | null
    }
    station: {
        id: Generated<number>
        name: string
        company_id: number
        station_type_id: number
    }
    station_type: {
        id: Generated<number>
        name: string
        max_power: number
    }
}