export class Validator {
    static isValidEmail(email: string): string | null {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email) ? null : 'Please enter a valid email address.';
      }
    
      static isRequired(value: string): string | null {
        return value.trim() === '' ? 'This field is required.' : null;
      }
}