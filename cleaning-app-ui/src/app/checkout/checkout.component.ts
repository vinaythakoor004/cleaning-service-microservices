import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonService } from '../common/service/common/common.service';

@Component({
  selector: 'app-checkout',
  imports: [ TranslatePipe ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  loginUserDetails: any = {};
  selectedPlan: any = {}
  constructor( private commonService: CommonService) {

  }

  ngOnInit() {
    this.loginUserDetails = this.commonService.loggedInUser;
    this.selectedPlan = this.commonService.selectedPlan;
  }
}
