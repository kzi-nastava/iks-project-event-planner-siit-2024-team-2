import { HttpParams } from '@angular/common/http';

export function buildHttpParams(filters: Record<string, unknown> | null | undefined): HttpParams {
  let params = new HttpParams();

  if (!filters) return params;

  Object.entries(filters).forEach(([key, value]) => {
    if (value != null) {
      if (Array.isArray(value)) {
        value.forEach(v => {
          params = params.append(key, v.toString());
        });
      } else {
        params = params.set(key, value.toString());
      }
    }
  });

  return params;
}