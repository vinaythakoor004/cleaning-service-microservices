import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private router: Router, private commonService: CommonService ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.commonService.isLoggedIn) {
          return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.commonService.isLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
}
