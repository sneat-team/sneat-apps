import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {SneatUserService} from '@sneat/auth';
import {IUser} from '@sneat/auth-models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {

  public user: IUser;
  public userTitle = new FormControl('', [Validators.required]);

  edit = false;

  constructor(
    private readonly userService: SneatUserService,
  ) {
    userService.userRecord.subscribe(user => {
      console.log('UserProfilePage => user:', user);
      this.user = user?.data;
      this.userTitle.setValue(user?.data.title || '');
    })
  }

}
