import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page-header',
  templateUrl: './landing-page-header.component.html',
  styleUrls: ['./landing-page-header.component.css']
})
export class LandingPageHeaderComponent implements OnInit {

  public _formSearch: FormGroup;
  public lang: string;
  public place: string = "";
  constructor(private _router: Router, private _formBuilder: FormBuilder, public translate: TranslateService) {
    translate.addLangs(['es', 'eu']);
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    //Leo el idioma de localStorage
    if(!localStorage.getItem('lang')==null)  {
      this.lang = "es";
      this.place ="Busca un plan";
      localStorage.setItem('lang', 'es');
  } else {
      this.lang = localStorage.getItem('lang');
  }

  if(this.lang =="es") {
    this.place = "Busca un plan";
  } else {
    this.place ="Aurkitu plan bat";
  }

  this.switchLang(this.lang);



    this._formSearch = this._formBuilder.record({
      searchInput: new FormControl(null, [
        Validators.required,
        Validators.minLength(1)
      ])
    });
  }

  public _onFormSearchSubmit() {
    let {searchInput} = this._formSearch.getRawValue();
    searchInput = searchInput.trim();
    if (searchInput) searchInput = searchInput.split(' ').join('+');
    console.log(searchInput)
    this._router.navigate(
      ['/', 'search'],
      {queryParams: {q: searchInput}}
    );
  }

  //Metodo que cambia el idioma
  switchLang(lang: string) {
    this.translate.use(this.lang);
  }


}
