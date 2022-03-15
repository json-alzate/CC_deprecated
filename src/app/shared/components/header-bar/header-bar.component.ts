import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {

  @Input() title: string;
  dropdown = false;
 
  @ViewChild('productbtn', { read: ElementRef })productbtn: ElementRef;
 
  constructor() { }
 
  ngOnInit() { }
 
  hideDropdown(event) {
    const xTouch = event.clientX;
    const yTouch = event.clientY;
    
    const rect = this.productbtn.nativeElement.getBoundingClientRect();
    const topBoundary = rect.top+2;
    const leftBoundary = rect.left+2;
    const rightBoundary = rect.right-2;
 
    if (xTouch < leftBoundary || xTouch > rightBoundary || yTouch < topBoundary) {      
      this.dropdown = false;
    }
  }
}
