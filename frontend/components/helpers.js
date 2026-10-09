// Turns text into safe HTML. Use it for anything a user typed
// before putting it inside an innerHTML template.
export function esc(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// What a person who is signed in can do, in one place.
// Only patients can book, so everybody else sees no Book button.
export function canBook(user) {
    return user !== null && user.Role === 'Patient';
}
