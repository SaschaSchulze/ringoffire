import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { inject } from '@angular/core';
import {
  DocumentSnapshot,
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    GameInfoComponent,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    DialogAddPlayerComponent,
    MatDialogModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;
  gameDoc: any;

  // pickCardAnimation = false;
  // currentCard: string = '';
  game: Game = new Game();

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    firestore: Firestore
  ) {
    this.firestore = firestore;
    const gameId = this.route.snapshot.params['id'];
    this.gameDoc = doc(this.firestore, 'games', gameId);
    console.log('Games:', gameId);
  
    // Firestore-Listener für Spieländerungen
    onSnapshot(this.gameDoc, (snapshot: DocumentSnapshot) => {
      const gameData = snapshot.data() as Game;
      if (gameData) {
        this.game = gameData;
      }
    });
    
    this.games$ = collectionData(collection(this.firestore, 'games'));
  }

  // ngOnInit(): void {
  //   // this.newGame();
  // }

  newGame() {
    this.game = new Game();

    // this.route.params.subscribe((params) => {
    //   console.log(params['id']);
    // });

    // try {
    //   addDoc(collection(this.firestore, 'games'), this.game.toJson()); //Json hinzufügen in firebase mit .toJson. toJson befindet sich in game.ts
    // } catch (error) {
    //   console.error('Error adding document: ', error);
    // }
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      // wenn pickCardAnimation false ist-> ! <--. false ist standartmaßig gesetzt, siehe weiter oben.
      this.game.currentCard = this.game.stack.pop()!; // pop() gibt letzten Wert aus Array zurück und entfernt es aus dem Array, != TS überzeugen, dass das Array ein String ist
      this.game.pickCardAnimation = true;
      console.log('new card' + this.game.currentCard);
      console.log('Game is', this.game);
      this.game.currentPlayer++;

      // Stelle sicher, dass der Index des aktuellen Spielers immer im Bereich der Anzahl der Spieler bleibt
      // Wenn die Anzahl der Spieler überschritten wird, wird der Index auf den ersten Spieler zurückgesetzt
      if (this.game.currentPlayer === this.game.players.length) {
        this.game.currentPlayer = 0;
      }

        this.updateFirestore();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.updateFirestore();
      }, 1000);
    }
  }

  updateFirestore() {
    updateDoc(this.gameDoc, {
      currentPlayer: this.game.currentPlayer,
      playedCards: this.game.playedCards,
      players: this.game.players,
      stack: this.game.stack,
      pickCardAnimation: this.game.pickCardAnimation,
      currentCard: this.game.currentCard
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        try {
          this.game.players.push(name);
          updateDoc(doc(this.firestore, 'games', this.route.snapshot.params['id']), {
            players: this.game.players
          });
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      }
    });
  }
}
