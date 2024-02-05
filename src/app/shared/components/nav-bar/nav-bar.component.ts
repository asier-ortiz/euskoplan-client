import {Component} from '@angular/core';
import {AuthService} from "@shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private readonly _authService: AuthService, private _router: Router) {
  }

  public _onSessionCloseButtonPressed() {
    this._authService.logout().subscribe({
      next: _ => this._router.navigate(['auth/login']),
      error: err => {
        console.log(err);
        this._router.navigate(['auth/login']);
      }
    });
  }

  public setLanguageSpanish(): void {
    localStorage.setItem('lang', 'es');
    window.location.reload();
  }

  public setLanguageBasque(): void {
    localStorage.setItem('lang', 'eu');
    window.location.reload();
  }

}
