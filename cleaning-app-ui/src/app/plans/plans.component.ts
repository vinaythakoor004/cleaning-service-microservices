import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common/service/common/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plans',
  imports: [ CommonModule ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent {
  plans: any = [];
  constructor(private router: Router, private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.getPlanDetails().subscribe({
      next: (data) => {
        this.commonService.selectedPlan = {};
        this.plans = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  selectPlan(plan: any): void {
    this.commonService.selectedPlan = plan;
    const url = this.router.url + '/checkout';
    const params = {
      queryParams: {
          name: plan.name
      }
  };
  this.router.navigate([url], params);  }
  
}
