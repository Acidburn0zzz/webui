import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';
import { DynamicFormsCoreModule } from '@ng2-dynamic-forms/core';
import { DynamicFormsBootstrapUIModule } from '@ng2-dynamic-forms/ui-bootstrap';

import { EntityModule } from '../../common/entity/entity.module';
import { routing }       from './bootenv.routing';

import { BootEnvironmentListComponent } from './bootenv-list/';
import { BootEnvironmentDeleteComponent } from './bootenv-delete/';
import { BootEnvironmentAddComponent } from './bootenv-add/';

@NgModule({
  imports: [
    EntityModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsBootstrapUIModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    BootEnvironmentListComponent,
    BootEnvironmentDeleteComponent,
    BootEnvironmentAddComponent
  ],
  providers: [
  ]
})
export class SnapshotsModule {}
