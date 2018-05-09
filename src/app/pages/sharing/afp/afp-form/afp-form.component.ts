import { Component, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {Validators} from '@angular/forms';
import * as _ from 'lodash';

import { FieldConfig } from '../../../common/entity/entity-form/models/field-config.interface';
import { T } from '../../../../translate-marker';

@Component({
  selector : 'app-afp-form',
  template : `<entity-form [conf]="this"></entity-form>`
})
export class AFPFormComponent implements OnDestroy {

  protected route_success: string[] = [ 'sharing', 'afp' ];
  protected resource_name: string = 'sharing/afp/';
  protected isEntity: boolean = true;
  protected isBasicMode: boolean = true;
  public afp_timemachine: any;
  public afp_timemachine_quota: any;
  public afp_timemachine_subscription: any;

  public fieldConfig: FieldConfig[] = [
    {
      type : 'explorer',
      initial: '/mnt',
      explorerType: 'directory',
      name: 'afp_path',
      placeholder: T('Path'),
      tooltip: T('Browse to the voume or dataset to share. Do not nest\
 additional volumes, datasets, or symbolic links beneath this path\
 because Netatalk does not fully support that.'),
      required: true,
      validation : [ Validators.required ]
    },
    {
      type: 'input',
      name: 'afp_name',
      placeholder: T('Name'),
      tooltip: T('Volume name which appears in the\
 <b>connect to server</b> dialog of the computer.')
    },
    {
      type: 'input',
      name: 'afp_comment',
      placeholder: T('Comment'),
      tooltip: T('Optional comment.')
    },
    {
      type: 'input',
      name: 'afp_allow',
      placeholder: T('Allow list'),
      tooltip: T('Comma-delimited list of allowed users and/or groups\
 where groupname begins with a @. Note that adding an entry will deny\
 any user or group that is not specified.')
    },
    {
      type: 'input',
      name: 'afp_deny',
      placeholder: T('Deny list'),
      tooltip: T('Comma-delimited list of allowed users and/or groups\
 where groupname begins with a @. Note that adding an entry will allow\
 any user or group that is not specified.')
    },
    {
      type: 'input',
      name: 'afp_ro',
      placeholder: T('Read Only Access'),
      tooltip: T('Comma-delimited list of users and/or groups who only\
 have read access where groupname begins with a @.')
    },
    {
      type: 'input',
      name: 'afp_rw',
      placeholder: T('Read/Write Access'),
      tooltip: T('Comma-delimited list of users and/or groups who have\
 who have read and write access where groupname begins with a @.')
    },
    {
      type: 'checkbox',
      name: 'afp_timemachine',
      placeholder: T('Time Machine'),
      tooltip: T('When checked, FreeNAS advertises itself as a Time\
 Machine disk so it can be found by Macs. Due to a limitation in how\
 the Mac deals with low-diskspace issues when multiple Macs share the\
 same volume, checking <b>Time Machine</b> on multiple shares could\
 result in intermittent failed backups.')
    },
    {
      type: 'input',
      name: 'afp_timemachine_quota',
      placeholder: T('Time Machine Quota'),
      inputType: 'number',
      tooltip: T('Quota for each Time Machine backup on this share (in GiB).\
        Please note that this change will be applied only after share re-mount.')
    },
    {
      type: 'checkbox',
      name: 'afp_home',
      placeholder: T('Use as home share'),
      tooltip: T('Check this box if the share is meant to hold user\
      home directories; only one share can be the home share.')
    },
    {
      type: 'checkbox',
      name: 'afp_nodev',
      placeholder: T('Zero Device Numbers'),
      tooltip: T('Enable when the device number is not constant across\
 a reboot.')
    },
    {
      type: 'checkbox',
      name: 'afp_nostat',
      placeholder: T('No Stat'),
      tooltip: T('If checked, AFP does not stat the volume path when\
 enumerating the volumes list. This is useful for automounting or\
 volumes created by a preexec script.')
    },
    {
      type: 'checkbox',
      name: 'afp_upriv',
      placeholder: T('AFP3 Unix Privs'),
      tooltip: T('Enable Unix privileges supported by OSX 10.5 and\
 higher. Do not enable this if the network contains Mac OSX 10.4 clients\
 or lower as they do not support this feature.')
    },
    {
      type: 'permissions',
      name: 'afp_fperm',
      placeholder: T('Default file permissions'),
      tooltip: T('Only works with Unix ACLs. New files created on the\
 share are set with the selected permissions.')
    },
    {
      type: 'permissions',
      name: 'afp_dperm',
      placeholder: T('Default directory permissions'),
      tooltip: T('Only works with Unix ACLs. New directories created on\
 the share are set with the selected permissions.')
    },
    {
      type: 'permissions',
      name: 'afp_umask',
      placeholder: T('Default umask'),
      tooltip: T('Unmask used for newly created files. Defualt is\
 <i>000</i> (anyone can read, write, and execute).')
    },
    {
      type: 'textarea',
      name: 'afp_hostsallow',
      placeholder: T('Hosts Allow'),
      tooltip: T('Comma-, space-, or tab-delimited list of allowed\
 hostnames or IP addresses.')
    },
    {
      type: 'textarea',
      name: 'afp_hostsdeny',
      placeholder: 'Hosts Deny',
      tooltip: T('Comma-, space-, tab-delimited list of denied hostnames\
 or IP addresses.')
    },
    {
      type: 'textarea',
      name: 'afp_auxparams',
      placeholder: 'Auxiliary Parameters',
      tooltip: T('Additional\
 <a href="http://netatalk.sourceforge.net/3.1/htmldocs/afp.conf.5.html"\
 target="_blank">afp.conf</a> parameters not covered by other option\
 fields.')
    },
  ];

  protected advanced_field: Array<any> = [
    'afp_comment',
    'afp_upriv',
    'afp_auxparams',
    'afp_hostsallow',
    'afp_hostsdeny',
    'afp_umask',
    'afp_dperm',
    'afp_fperm',
    'afp_nostat',
    'afp_nodev',
    'afp_ro',
    'afp_rw',
    'afp_allow',
    'afp_deny',
  ];

  public custActions: Array<any> = [
    {
      id : 'basic_mode',
      name : T('Basic Mode'),
      function : () => { this.isBasicMode = !this.isBasicMode; }
    },
    {
      'id' : 'advanced_mode',
      name : T('Advanced Mode'),
      function : () => { this.isBasicMode = !this.isBasicMode; }
    }
  ];

  constructor(protected router: Router) {}

  isCustActionVisible(actionId: string) {
    if (actionId == 'advanced_mode' && this.isBasicMode == false) {
      return false;
    } else if (actionId == 'basic_mode' && this.isBasicMode == true) {
      return false;
    }
    return true;
  }

  afterInit(entityForm: any) {
    if (entityForm.isNew) {
      entityForm.formGroup.controls['afp_umask'].setValue("000", {emitEvent: true});
      entityForm.formGroup.controls['afp_fperm'].setValue("644", {emitEvent: true});
      entityForm.formGroup.controls['afp_dperm'].setValue("755", {emitEvent: true});
      entityForm.formGroup.controls['afp_upriv'].setValue(true);
    }
    this.afp_timemachine_quota = _.find(this.fieldConfig, {'name': 'afp_timemachine_quota'});
    this.afp_timemachine = entityForm.formGroup.controls['afp_timemachine'];
    this.afp_timemachine_quota.isHidden = !this.afp_timemachine.value;
    this.afp_timemachine_subscription = this.afp_timemachine.valueChanges.subscribe((value) => {
      this.afp_timemachine_quota.isHidden = !value;
    });
  }

  ngOnDestroy() {
    this.afp_timemachine_subscription.unsubscribe();
  }
}
