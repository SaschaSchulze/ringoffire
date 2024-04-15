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
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
    console.log(this.game);
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation) { // wenn pickCardAnimation false ist-> ! <--. false ist standartmaßig gesetzt, siehe weiter oben. 
      this.currentCard = this.game.stack.pop()!; // pop() gibt letzten Wert aus Array zurück und entfernt es aus dem Array, != TS überzeugen, dass das Array ein String ist
      this.pickCardAnimation = true;
      console.log('new card' + this.currentCard);
      console.log('Game is', this.game);
      this.game.currentPlayer++; // ++ bedeuted nächster Spieler
      
      // Stelle sicher, dass der Index des aktuellen Spielers immer im Bereich der Anzahl der Spieler bleibt
      // Wenn die Anzahl der Spieler überschritten wird, wird der Index auf den ersten Spieler zurückgesetzt
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent)

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) { /*Prüft im ersten Schritt, ob die Variable existiert, &&(wenn ja), dann gehe zum 2. Schritt*/
        this.game.players.push(name);
      }
    });
  }
}
