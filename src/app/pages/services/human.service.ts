import { Injectable } from '@angular/core';
import { Human } from '@vladmandic/human';

@Injectable({
  providedIn: 'root',
})
export class HumanService {
  private stopped = false;
  private readonly human = new Human({
    cacheSensitivity: 0,
    debug: true,
    modelBasePath: 'https://vladmandic.github.io/human-models/models/',
    filter: { enabled: true, equalization: false, flip: false },
    face: {
      enabled: true,
      detector: {
        rotation: false,
        maxDetected: 100,
        minConfidence: 0.2,
        return: true,
      },
      iris: { enabled: true },
      description: { enabled: true },
      emotion: { enabled: true },
      antispoof: { enabled: true },
      liveness: { enabled: true },
    },
    body: { enabled: false },
    hand: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: true },
    segmentation: { enabled: false },
  });

  constructor() {
    this.init();
  }

  async init() {
    await this.human.load();
    await this.human.warmup();
  }

  async detectGesture(
    input: MediaStream,
    cb: (emotion: { name: string; score: number }) => void,
  ) {
    this.human.detect(input).then((result) => {
      try {
        const face = result.face[0];
        if (face.emotion) {
          // emotion is automatically sorted by the highest match
          cb({
            name: face.emotion[0].emotion,
            score: face.emotion[0].score,
          });
        }
      } catch (err) {}
      if (!this.stopped) {
        this.detectGesture(input, cb);
      }
    });
  }

  async startCamera() {
    if (!navigator.mediaDevices) {
      throw new Error('Camera not supported');
    }
    const constraints = {
      audio: false,
      video: {
        facingMode: 'user',
      },
    };
    try {
      this.stopped = false;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (err) {
      throw new Error('Not supported device stream');
    }
  }

  async stopCamera() {
    this.stopped = true;
  }
}
