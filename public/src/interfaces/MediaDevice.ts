import Emitter from './Emitter'

class MediaDevice extends Emitter {
  private stream: any;

  start() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true
      })
      .then((stream) => {
        this.stream = stream
        this.emit('stream', stream)
      })
      .catch(console.error)

    return this
  }

  toggle(type: any, on: any) {
    if (this.stream) {
      this.stream[`get${type}Tracks`]().forEach((t: any) => {
        t.enabled = on ? on : !t.enabled
      })
    }

    return this
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((t: any) => { t.stop() })
    }
    // удаляем все обработчики всех событий
    this.off();

    return this;
  }
}

export default MediaDevice