import { request } from './request.js';

// { doctors: 15, hospitals: 10, diseases: 20 }
export function getStats() {
    return request('GET', '/stats');
}
