import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IscsiService } from '../../../../../services/';
import * as _ from 'lodash';

@Component({
  selector : 'app-iscsi-associated-target-list',
  template : `
    <entity-table [conf]="this"></entity-table>
  `,
  providers: [IscsiService],
})
export class AssociatedTargetListComponent {

  protected queryCall = 'iscsi.targetextent.query';
  protected wsDelete = 'iscsi.targetextent.delete';
  protected route_add: string[] = [ 'sharing', 'iscsi', 'associatedtarget', 'add' ];
  protected route_add_tooltip: string = "Add Target/Extent";
  protected route_edit: string[] = [ 'sharing', 'iscsi', 'associatedtarget', 'edit' ];

  public columns: Array<any> = [
    {
      name : 'Target',
      prop : 'target',
    },
    {
      name : 'LUN ID',
      prop : 'lunid',
    },
    {
      name : 'Extent',
      prop : 'extent',
    }
  ];
  public config: any = {
    paging : true,
    sorting : {columns : this.columns},
    deleteMsg: {
      title: 'Target/Extent',
      key_props: ['target', 'extent']
    },
  };

  constructor(protected router: Router, protected iscsiService: IscsiService) {}

  afterInit(entityList: any) {}

  dataHandler(entityList: any) {
    this.iscsiService.getTargets().subscribe((targets) => {
      const target_list = targets;
      this.iscsiService.getExtents().subscribe((res) => {
        const extent_list = res;

        for (let i = 0; i < entityList.rows.length; i++) {
          entityList.rows[i].target =  _.find(target_list, {id: entityList.rows[i].target})['name'];
          entityList.rows[i].extent = _.find(extent_list, {id: entityList.rows[i].extent})['name'];
        }
      });
    });
  }
}
