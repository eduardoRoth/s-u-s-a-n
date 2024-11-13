import { Injectable } from '@angular/core';
import mqtt from 'mqtt';
@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private readonly client = mqtt.connect(`ws://143.244.209.146:8080`, {
    username: 'hero',
    password: 'dev',
  });

  subscribeTopic(topic: string, cb: (topic: string, payload: unknown) => void) {
    this.client.subscribe(topic);

    this.client.on('message', (topic, payload, packet) => {
      try {
        const decoder = new TextDecoder();
        const text = decoder.decode(payload);
        cb(topic, JSON.parse(text));
      } catch (err) {
        console.log(err);
      }
    });
  }

  unsubscribeTopic(topic: string) {
    this.client.unsubscribe(topic);
  }

  publishMessage(topic: string, message: unknown) {
    try {
      const jsonMessage = JSON.stringify(message);
      console.log(topic, jsonMessage);
      this.client.publish(topic, jsonMessage);
    } catch (err) {
      console.log(err);
    }
  }
}
