import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertWs: WebSocket | null = null;
  alertsCount = 0;
  alerts = null

  constructor() { }

  connectToAlerts(token: string) {
    this.alertWs = new WebSocket(`ws://127.0.0.1:5002?token=${token}`)
    if(this.alertWs){
      this.alertWs.onopen = (response) => {
        this.getAlertsCount()
      }
      this.alertWs.onmessage = this.handleWebSocketMessage.bind(this)
    }
  }

  handleWebSocketMessage(res: MessageEvent) {
    const { type, data }: { type: string; data: unknown } = JSON.parse(res.data);
    if(type === 'GET_NOTIFICATIONS_COUNT') return this.handleAlertsCount(data as number)
  }

  getAlertsCount() {
    if(this.alertWs){
      this.alertWs.send(
        JSON.stringify({
          type: "GET_NOTIFICATIONS_COUNT",
        })
      )
    }
  }

  handleAlertsCount(count: number) {
    this.alertsCount = count
  }

}
