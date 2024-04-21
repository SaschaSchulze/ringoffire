import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-player',
  standalone: true,
  imports: [],
  templateUrl: './mobile-player.component.html',
  styleUrl: './mobile-player.component.scss'
})
export class MobilePlayerComponent {

  @Input() name!: string;
  @Input() playerActive: boolean = false;

  constructor() {}

}
