import {
  Component,
  computed,
  ElementRef,
  inject,
  model,
  viewChild,
} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MqttService } from '../services/mqtt.service';
import { FormsModule } from '@angular/forms';
import { HumanService } from '../services/human.service';
import { FaceResult } from '@vladmandic/human';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonInput,
    FormsModule,
    IonCardContent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title> Developer </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col size="9">
            <ion-card>
              <ion-card-header>
                <ion-input
                  label="Name"
                  labelPlacement="stacked"
                  [(ngModel)]="name"
                />
              </ion-card-header>

              <ion-card-content>
                <video #video muted autoplay></video>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-button (click)="startWorking()"> Start working </ion-button>
      <ion-button (click)="stopWorking()"> Stop working </ion-button>
    </ion-content>
  `,
})
export class DeveloperComponent {
  private readonly mqtt = inject(MqttService);
  private readonly human = inject(HumanService);

  readonly name = model<string>('Eduardo');
  readonly video = viewChild<ElementRef>('video');

  private readonly topic = computed(() => this.name().toLowerCase());

  async startWorking() {
    const stream = await this.human.startCamera();
    this.video()!.nativeElement.srcObject = stream;
    this.video()!.nativeElement.onplay = () => {
      this.human.detectGesture(
        this.video()!.nativeElement,
        (emotion: { name: string; score: number }) => {
          this.mqtt.publishMessage(`developers/${this.topic()}`, {
            name: this.topic(),
            emotion,
            timestamp: new Date().getTime(),
          });
        },
      );
    };
    this.video()!.nativeElement.onpause = () => {
      this.human.stopCamera();
    };
    console.log(this.video());
  }

  stopWorking() {
    this.video()!.nativeElement.pause();
  }
}
