import { afterNextRender, Component, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MqttService } from '../services/mqtt.service';
import { addIcons } from 'ionicons';
import { happy, sad } from 'ionicons/icons';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonNote,
    IonIcon,
    JsonPipe,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title> Client </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @for (entry of messages().entries(); track entry[0]) {
        @let developer = entry[1];
        <ion-item>
          <ion-icon
            [name]="developer.emotion.name === 'happy' ? 'happy' : 'sad'"
            slot="start"
          ></ion-icon>
          <ion-label>
            <h2>{{ developer.name }}</h2>
            <p>
              Chance of being <strong>{{ developer.emotion.name }}</strong> is
              {{ developer.emotion.score * 100 }}%
            </p>
          </ion-label>
          <ion-note slot="end">
            {{ developer.timestamp }}
          </ion-note>
        </ion-item>
      }
    </ion-content>
  `,
})
export class ClientComponent {
  private readonly mqtt = inject(MqttService);
  readonly messages = signal<
    Map<
      string,
      {
        name: string;
        emotion: {
          name: string;
          score: number;
        };
        timestamp: number;
      }
    >
  >(new Map());

  constructor() {
    addIcons({
      happy,
      sad,
    });
    afterNextRender(() => {
      this.mqtt.subscribeTopic('developers/#', (topic, payload: any) => {
        const newMap = new Map(this.messages());
        this.messages.set(newMap.set(topic, payload));
      });
    });
  }
}
