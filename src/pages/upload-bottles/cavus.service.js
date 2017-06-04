var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by loicsalou on 28.02.17.
 */
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
var CavusService = (function () {
    function CavusService(http) {
        this.http = http;
    }
    CavusService.prototype.connectToCavus = function () {
        var _this = this;
        var headers = new Headers();
        //headers.set('Accept-Encoding', 'gzip, deflate, sdch');
        headers.set('Accept-Language', 'fr-CH,fr-FR;q=0.8,fr;q=0.6,en-US;q=0.4,en;q=0.2');
        headers.set('Upgrade-Insecure-Requests', '1');
        headers.set('Referer', 'http://www.cavusvinifera.com/fr/');
        //headers.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
        headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        //headers.set('Cookie', 'PHPSESSID=dc7aef947fe61c3d11c7d06e129f5cbd; LB=w3; phpsessid=dc7aef947fe61c3d11c7d06e129f5cbd; __utma=117453595.1118202897.1496177400.1496177400.1496177400.1; __utmb=117453595.2.10.1496177400; __utmc=117453595; __utmz=117453595.1496177400.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)');
        //headers.set('Connection', 'keep-alive');
        var opts = { headers: headers };
        var obs = this.http.get('http://www.cavusvinifera.com/', opts);
        obs.subscribe(function (response) { return _this.analyzeReaponse(response); });
    };
    CavusService.prototype.analyzeReaponse = function (response) {
        console.info(response.toString());
    };
    return CavusService;
}());
CavusService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], CavusService);
export { CavusService };
//# sourceMappingURL=cavus.service.js.map