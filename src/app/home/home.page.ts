import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  connection = false;
  mower = 0;
  mower_spin = 0;
  action = "stop";
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    this.GetConnect();
  }
  async GetConnect() {
    let loading: any;
    loading = await this.loadingCtrl.create({
      message: "กำลังประมวลผล",
    });
    await loading.present();
    this.http.get("http://192.168.4.1/connect?t=" + new Date().getTime(), { responseType: 'text' })
      .pipe(
        timeout(1000)
      )
      .subscribe((response: any) => {
        loading.dismiss();
        this.connection = true;
        var a = response.split(",");
        this.mower = parseInt(a[0]);
        this.mower_spin = parseInt(a[1]);
      }, error => {
        loading.dismiss();
        this.ShowAlert("ไม่สามารถเชื่อมต่อได้");
      });
  }
  GetSend(act) {
    this.action = act;
    this.http.get("http://192.168.4.1/" + act + "?t=" + new Date().getTime())
      .pipe(
        timeout(1000)
      )
      .subscribe((response: any) => {
        this.action = response;
      }, error => {
      });
  }
  Mowen() {
    console.log(this.mower);
    if (this.mower == 1) {
      this.http.get("http://192.168.4.1/mower-open?t=" + new Date().getTime())
        .pipe(
          timeout(1000)
        )
        .subscribe((response: any) => {
        }, error => {
        });
    } else {
      this.http.get("http://192.168.4.1/mower-close?t=" + new Date().getTime())
        .pipe(
          timeout(1000)
        )
        .subscribe((response: any) => {
        }, error => {
        });
    }

  }
  MowenSpin() {
    this.http.get("http://192.168.4.1/mower-spin?val=" + this.mower_spin + "&t=" + new Date().getTime())
      .pipe(
        timeout(1000)
      )
      .subscribe((response: any) => {
      }, error => {
      });
  }
  public ShowAlert(message) {
    let msg: any = message;
    if (typeof message === 'object') msg = JSON.stringify(message);
    if (typeof message === 'string') msg = message;
    return new Promise(async resolve => {
      const alert = await this.alertCtrl.create({
        header: "แจ้งข้อความ",
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: "ตกลง",
            handler: () => {
              resolve(true);
            }
          },
        ]
      });
      await alert.present();
    });
  }
}
