import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log(`RequestInterceptor - ${req.url}`);

        // console.log(req);
        // let jsonReq: HttpRequest<any> = req.clone({
        //     setHeaders: {'Content-Type': 'application/json'}
        //   });
        console.log(req);
        return next.handle(req);
    }
}
