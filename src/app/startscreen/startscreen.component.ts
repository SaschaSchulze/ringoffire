import { Component } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../models/game';


@Component({
  selector: 'app-startscreen',
  standalone: true,
  imports: [],
  templateUrl: './startscreen.component.html',
  styleUrl: './startscreen.component.scss'
})
export class StartscreenComponent {
  game: Game = new Game();

  constructor(private firestore: Firestore,  private router: Router, private route: ActivatedRoute) { }

  async newGame() {
    try {
      const docRef = await addDoc(collection(this.firestore, 'games'), this.game.toJson());
      const gameId = docRef.id;
      this.router.navigateByUrl(`/game/${gameId}`);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
}
