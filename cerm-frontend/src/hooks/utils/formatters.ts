export function formatPhoneNumber(value: string): string {
    // Strip all non-digits and cap at 11 digits (1 country + 3 area + 3 prefix + 4 line)
    const digits = value.replace(/\D/g, '').slice(0, 11);
    
    if (digits.length === 0) return '';
    
    let formatted = '+';
    
    // Country code (1 digit)
    formatted += digits[0];
    
    // Area code (up to 3 digits)
    if (digits.length > 1) {
        formatted += ' (' + digits.slice(1, 4);
    }
    
    // Prefix (up to 3 digits) - closes the parenthesis automatically
    if (digits.length >= 5) {
        formatted += ') ' + digits.slice(4, 7);
    }
    
    // Line number (up to 4 digits) - adds the hyphen automatically
    if (digits.length >= 8) {
        formatted += '-' + digits.slice(7, 11);
    }
    
    return formatted;
}