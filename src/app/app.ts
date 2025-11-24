import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorDisplayComponent } from './core/components/error-display.component';
import { LoadingIndicatorComponent } from './core/components/loading-indicator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorDisplayComponent, LoadingIndicatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RestBill_System_Frontend');
}
