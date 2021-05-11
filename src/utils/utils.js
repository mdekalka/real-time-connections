export const API_URL = 'http://localhost:3002';

export const getSecondsDifference = (startDate, endDate) => {
  return Math.round((endDate.getTime() - startDate.getTime()) / 1000);
}

export const prettyDate = (date) => {
  return date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute:'2-digit', second: '2-digit' });
}
