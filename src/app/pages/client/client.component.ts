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
  ],
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title> Client </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @for (message of messages(); track message.timestamp) {
        <ion-item>
          <ion-icon
            [name]="message.emotion.name === 'happy' ? 'happy' : 'sad'"
            slot="start"
          ></ion-icon>
          <ion-label>
            <h2>{{ message.name }}</h2>
            <p>
              Chance of being <strong>{{ message.emotion.name }}</strong> is
              {{ message.emotion.score * 100 }}%
            </p>
          </ion-label>
          <ion-note slot="end">
            {{ message.timestamp }}
          </ion-note>
        </ion-item>
      }
    </ion-content>
  `,
})
export class ClientComponent {
  private readonly mqtt = inject(MqttService);
  readonly messages = signal<
    {
      name: string;
      emotion: {
        name: string;
        score: number;
      };
      timestamp: number;
    }[]
  >([]);
  constructor() {
    addIcons({
      happy,
      sad,
    });
    afterNextRender(() => {
      this.mqtt.subscribeTopic('developers/#', (topic, payload: any) => {
        console.log(payload);
        this.messages.set([payload]);
      });
    });
  }
}
