import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogSearchService {
  private readonly searchSubject = new BehaviorSubject<string>('');
  readonly search$ = this.searchSubject.asObservable();

  setSearch(term: string): void {
    this.searchSubject.next(term);
  }
}
