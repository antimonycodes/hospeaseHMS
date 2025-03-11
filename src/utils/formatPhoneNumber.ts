export const formatPhoneNumber = (phone: string): string => {
  // Ensure the phone number starts with +234 and has the correct length
  if (phone.startsWith("+234") && phone.length === 14) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7, 11)} ${phone.slice(11)}`;
  }
  return phone; // Return the original if it doesn't match the expected format
};