import {Injectable} from "@angular/core";
import {Application, BackendService} from "../../services/backend.service";
import {Response} from "@angular/http";

@Injectable()
export class ApplicationsService {
  private _applications: Map<string, Map<string, CachedApplications>> = new Map<string, Map<string, CachedApplications>>();

  constructor(private backend: BackendService) {
    console.log("construct");
  }

  private getMap(year: string): Map<string, CachedApplications> {
    if (!this._applications.has(year)) {
      this._applications.set(year, new Map<string, CachedApplications>());
    }

    return this._applications.get(year);
  }

  getByState(year: string, state: string, forceRefresh: boolean = false): Promise<SortedArray<Application>> {
    const existing = this.getMap(year).get(state);

    if (!existing || forceRefresh || existing.isExpired()) {
      return this.backend.getApplications(year, state)
        .then(res => {
          const map = this.getMap(year);
          map.set(state, new CachedApplications(res));
          console.log(map);
          console.log(this._applications);
          return map.get(state);
        })
        .then(u => u.applications);
    } else {
      return Promise.resolve(existing.applications);
    }
  }

  accept(year: string, application: Application): Promise<Response> {
    application.isAccepted = true;
    application.isRefused = false;
    return this.setStatus(year, application, "accepted");
  }

  refuse(year: string, application: Application): Promise<Response> {
    application.isAccepted = false;
    application.isRefused = true;
    return this.setStatus(year, application, "refused");
  }

  setStatus(year: string, application: Application, newStatus: string): Promise<Response> {
    return this.backend.setApplicationStatus(year, application.userId, newStatus).then(succ => {
      this.getMap(year).forEach((val, key) => {
        // Remove all from this getState
        val.applications = val.applications.filter(app => app.userId !== application.userId);
      });

      this.getByState(year, newStatus).then(applications => {
        if (applications.filter(app => app.userId === application.userId).length === 0) {
          applications.push(application);
        }
      });

      return succ;
    });
  }
}

class CachedApplications {
  applications: SortedArray<Application>;
  cacheDate: Date;

  constructor(app: Application[]) {
    this.applications = new SortedArray(app, (a1, a2) => {
      const a1date = a1.validationDate ? a1.validationDate : 0;
      const a2date = a2.validationDate ? a2.validationDate : 0;

      return a1date - a2date;
    });
    this.cacheDate = new Date();
  }

  isExpired(): boolean {
    return (new Date().getTime() - this.cacheDate.getTime()) >= 1800000; // 30mn
  }
}

export class SortedArray<T> implements Iterable<T> {
  private changeListeners: ((content: SortedArray<T>) => void)[] = [];

  constructor(private underlying: T[], private comparator: (a: T, b: T) => number) {
    underlying.sort(comparator);
  }

  [Symbol.iterator](): Iterator<T> {
    return this.underlying[Symbol.iterator]();
  }

  filter(callbackfn: (value: T, index?: number, array?: T[]) => boolean, thisArg?: any): SortedArray<T> {
    return new SortedArray<T>(this.underlying.filter(callbackfn, thisArg), this.comparator);
  }

  push(...elem: T[]) {
    elem.forEach(e => this.underlying.push(e));
    this.underlying.sort(this.comparator);
    this.changeListeners.forEach(l => l(this));
  }

  get length(): number {
    return this.underlying.length;
  }

  get(n: number): T {
    return this.underlying[n];
  }

  onChange(listener: ((content: SortedArray<T>) => void)) {
    listener(this);
    this.changeListeners.push(listener);
  }
}
