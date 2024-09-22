import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, RouterOutlet, MatGridListModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'unstop';
  tickets = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }];
  seats = [[true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true]];

  emptySeats = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3];

  queryTickets = 1;

  bookedTickets: Array<any> = [];

  book() {
    this.bookedTickets = [];

    // This slighly optimises the solution by filling the rows with least number of empty seats first, if the queried seats are less than those in a particular row.
    let row = -1;
    for (let i = 0; i < 12; i++) {
      if (this.emptySeats[i] >= this.queryTickets) {
        if (row === -1 || this.emptySeats[i] < this.emptySeats[row])
          row = i;
      }
    }

    if (row !== -1) {
      const emptySeatsFixed = this.emptySeats[row];
      if (row === 11)
        for (let i = 4 - this.emptySeats[row]; i <= 3 - emptySeatsFixed + this.queryTickets; i++) {
          this.bookedTickets.push(row * 7 + i);
          this.emptySeats[row]--;
          this.seats[i - 1][row] = false;
        }
      else
        for (let i = 8 - this.emptySeats[row]; i <= 7 - emptySeatsFixed + this.queryTickets; i++) {
          this.bookedTickets.push(row * 7 + i);
          this.emptySeats[row]--;
          this.seats[i - 1][row] = false;
        }
      return;
    }

    //Initialised it such that the range is beyond the maximum range of the first and last rows of the compartment.
    let possibleRowRange = [-14, -1];

    let sumOfSeats = 0;
    let i = 0;

    //We go over all rows and find the smallest row range that has at least the queried number of seats.

    for (let j = 0; j < 12; j++) {
      sumOfSeats += this.emptySeats[j];
      while (sumOfSeats >= this.queryTickets) {
        if (j - i < possibleRowRange[1] - possibleRowRange[0])
          possibleRowRange = [i, j];
        sumOfSeats -= this.emptySeats[i++];
      }
    }
    if (possibleRowRange[0] < 0) {
      if (sumOfSeats === 0)
        this.bookedTickets = ['REGRET. No seats available.'];
      else
        this.bookedTickets = ['Only ' + sumOfSeats + ' seats available.'];
      return;
    }

    for (i = possibleRowRange[0]; i <= possibleRowRange[1]; i++) {
      let j = 8 - this.emptySeats[i];
      if (i === 11)
        j = 4 - this.emptySeats[i];
      for (; j <= 7 && this.queryTickets > 0; j++) {
        this.bookedTickets.push(i * 7 + j);
        this.emptySeats[i]--;
        this.seats[j - 1][i] = false;
        this.queryTickets--;
      }
    }
  }
}
