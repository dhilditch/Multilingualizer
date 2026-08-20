import { google } from 'googleapis';

const scopes = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly'
];

export function googleAuth() {
  return new google.auth.GoogleAuth({ scopes });
}

export function searchConsoleClient() {
  return google.searchconsole({ version: 'v1', auth: googleAuth() });
}

export function analyticsClient() {
  return google.analyticsdata({ version: 'v1beta', auth: googleAuth() });
}
