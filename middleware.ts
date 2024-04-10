import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth({
    ...authConfig,
    providers: [], // Add your providers here
}).auth;
 
export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};