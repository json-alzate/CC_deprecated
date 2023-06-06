import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Output() closeProfile = new EventEmitter();

  constructor( ) { }

  ngOnInit() {}

  logout() {
    this.closeProfile.emit();
  }

}
