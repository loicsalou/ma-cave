/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class CavusService {

  constructor(private http: Http, private notificationService: NotificationService) {
  }

  public connectToCavus() {
    let headers: Headers = new Headers();
    //headers.set('Accept-Encoding', 'gzip, deflate, sdch');
    headers.set('Accept-Language', 'fr-CH,fr-FR;q=0.8,fr;q=0.6,en-US;q=0.4,en;q=0.2');
    headers.set('Upgrade-Insecure-Requests', '1');
    headers.set('Referer', 'http://www.cavusvinifera.com/fr/');
    //headers.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko)
    // Chrome/58.0.3029.110 Safari/537.36');
    headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
    //headers.set('Cookie', 'PHPSESSID=dc7aef947fe61c3d11c7d06e129f5cbd; LB=w3;
    // phpsessid=dc7aef947fe61c3d11c7d06e129f5cbd; __utma=117453595.1118202897.1496177400.1496177400.1496177400.1;
    // __utmb=117453595.2.10.1496177400; __utmc=117453595;
    // __utmz=117453595.1496177400.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'); headers.set('Connection',
    // 'keep-alive');

    let opts: RequestOptionsArgs = {headers: headers};

    let obs: Observable<Response> = this.http.get('http://www.cavusvinifera.com/', opts)
    obs.subscribe(response => this.analyzeReaponse(response));
  }

  private analyzeReaponse(response: Response) {
    this.notificationService.information(response.toString());

  }
}


