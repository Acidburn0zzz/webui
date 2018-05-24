import {
  ApplicationRef,
  Component,
  Injector,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  FieldConfig
} from '../../../common/entity/entity-form/models/field-config.interface';


import {RestService, WebSocketService} from '../../../../services/';

@Component({
  selector : 'app-device-cdrom-add',
  template : `<device-add [conf]="this"></device-add>`
})

export class DeviceCdromAddComponent {

  protected resource_name = 'vm/device';
  protected pk: any;
  protected route_success: string[];
  public vm: string;
  public fieldConfig: FieldConfig[] = [
    {
      type : 'explorer',
      initial: '/mnt',
      name : 'path',
      placeholder : 'CD-ROM Path',
      tooltip : 'Browse to a CD-ROM file present on the system storage.',
      validation : [ Validators.required ],
      required: true
    },

  ];
  protected dtype = 'CDROM';

  afterInit() {
    this.route.params.subscribe(params => {
      this.pk = params['pk'];
      this.vm = params['name'];
      this.route_success = [ 'vm', this.pk, 'devices', this.vm ];
    });
  }

  constructor(protected router: Router, protected route: ActivatedRoute,
              protected rest: RestService, protected ws: WebSocketService,
              protected _injector: Injector, protected _appRef: ApplicationRef,
            ) {}
}
