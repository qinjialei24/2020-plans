import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Banner } from './data-types/common.types';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) { }

  getBanners(): Observable<Banner[]> {
    console.log('this.uri 的值是：', this.uri);
    return this.http.get(this.uri + 'banner').pipe(
      map((res: { banners: Banner[]; }) => res.banners)
    );
  }
}
