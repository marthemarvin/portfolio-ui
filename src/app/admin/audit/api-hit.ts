// How often one public endpoint has been called. Admin calls are not counted.
export interface ApiHit {
  id: number;
  endpoint: string;   // route pattern, e.g. /api/courses/{id}
  method: string;     // GET, POST, …
  hitCount: number;
  createdAt: string;  // first call
  updatedAt: string;  // most recent call
}
