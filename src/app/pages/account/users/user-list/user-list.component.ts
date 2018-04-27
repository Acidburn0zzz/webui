import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../../../services/';
import { TourService } from '../../../../services/tour.service';

@Component({
  selector: 'app-user-list',
  template: `<entity-table [title]="title" [conf]="this"></entity-table>`
})
export class UserListComponent implements OnInit {

  public title = "Users";
  protected resource_name = 'account/users';
  protected route_add: string[] = ['account', 'users', 'add'];
  protected route_add_tooltip = "Add User";
  protected route_edit: string[] = ['account', 'users', 'edit'];
  protected route_delete: string[] = ['account', 'users', 'delete'];

  public columns: Array < any > = [
    { name: 'Username', prop: 'bsdusr_username', freeze: "true" },
    { name: 'UID', prop: 'bsdusr_uid', freeze: "true" },
    { name: 'GID', prop: 'bsdusr_group' },
    { name: 'Home directory', prop: 'bsdusr_home' },
    { name: 'Shell', prop: 'bsdusr_shell', freeze: "true" },
    { name: 'Builtin', prop: 'bsdusr_builtin' },
    { name: 'Full Name', prop: 'bsdusr_full_name' },
    { name: 'Email', prop: 'bsdusr_email' },
    { name: 'Disable Password Login', prop: 'bsdusr_password_disabled' },
    { name: 'Lock User', prop: 'bsdusr_locked' },
    { name: 'Permit Sudo', prop: 'bsdusr_sudo' },
    { name: 'Microsoft Account', prop: 'bsdusr_microsoft_account' },
  ];
  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
  };

  isActionVisible(actionId: string, row: any) {
    if (actionId === 'delete' && row.bsdusr_builtin === true) {
      return false;
    }
    return true;
  }

  getUserList() {
    this.rest.get(this.resource_name, {}).subscribe((res) => {
      console.log(res);
    })
  }

  constructor(protected rest: RestService, private router: Router, private tour: TourService){
    this.getUserList()
  }

  ngOnInit() {
    const showTour = localStorage.getItem(this.router.url) || 'false';
    if (showTour !== "true") {
      hopscotch.startTour(this.tour.startTour(this.router.url));
      localStorage.setItem(this.router.url, 'true');
    }
  }
}
