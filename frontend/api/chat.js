import { request } from './request.js';

// history looks like [{ role: 'user', text: '...' }, { role: 'model', text: '...' }]
export function sendChatMessage(message, history) {
    return request('POST', '/chat', { message: message, history: history });
}
