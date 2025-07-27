import { Module } from '@nestjs/common';
import { CompanyControllers } from './controllers/company.controllers';
import { StationControllers } from './controllers/station.controllers';
import { StationTypeController } from './controllers/station-type.controllers';
import { CompanyService } from './services/company.service';
import { StationService } from './services/station.service';
import { StationTypeService } from './services/station-type.service';
import { databaseProvider } from './providers/database.provider';

@Module({
    controllers: [
        CompanyControllers,
        StationControllers,
        StationTypeController,
    ],
    providers: [
        CompanyService,
        databaseProvider,
        StationService,
        StationTypeService,
    ],
})
export class AppModule {}