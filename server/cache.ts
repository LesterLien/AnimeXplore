type CacheEntry<T> = {
  data: T | null;
  timestamp: number;
  ttl: number;
};

export class Cache<T> {
  private entry: CacheEntry<T>;

  constructor(private ttl: number) {
    this.entry = { data: null, timestamp: 0, ttl };
  }

  get(): T | null {
    if (this.entry.data && Date.now() - this.entry.timestamp < this.entry.ttl) {
      return this.entry.data;
    }
    return null;
  }

  set(data: T) {
    this.entry = { data, timestamp: Date.now(), ttl: this.ttl };
  }
}
