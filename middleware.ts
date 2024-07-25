// import { authMiddleware } from '@clerk/nextjs';

// export default authMiddleware({
//   publicRoutes: [
//     '/',
//     '/tags',
//     '/tags/:id',
//     '/profile/:id',
//     '/community',
//     '/jobs',
//     '/question/:id',
//     '/api/webhook',
//   ],
//   ignoredRoutes: ['/api/webhook', '/api/chatgpt'],
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
  publicRoutes: [
    '/',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/community',
    '/jobs',
    '/question/:id',
    '/api/webhook',
  ],
  ignoredRoutes: ['/api/webhook', '/api/chatgpt'],
};
