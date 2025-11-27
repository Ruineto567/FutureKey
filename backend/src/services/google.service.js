import { google } from 'googleapis';
export function getOAuthClient(){ const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env; return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI); }
export async function getAuthUrl(){ const o = getOAuthClient(); return o.generateAuthUrl({ access_type:'offline', scope:['https://www.googleapis.com/auth/calendar'], prompt:'consent' }); }
export async function exchangeCode(code){ const o = getOAuthClient(); const { tokens } = await o.getToken(code); return tokens; }
export async function insertCalendarEvent(tokens,{summary,startISO,endISO}){ const o = getOAuthClient(); o.setCredentials(tokens); const calendar = google.calendar({version:'v3',auth:o}); const event={ summary, start:{dateTime:startISO}, end:{dateTime:endISO} }; const r = await calendar.events.insert({ calendarId:'primary', requestBody:event }); return r.data; }
