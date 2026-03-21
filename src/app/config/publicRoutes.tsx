// config/publicRoutes.ts
export const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/forgotpassword',
  '/reset-password',
  '/verify-email',
  '/privacy-policy',
  '/terms',
  '/about',
  // Add any other public routes here
];

// Helper function to check if current path is public
export const isPublicRoute = (pathname: string | null): boolean => {
  return publicRoutes.some(route => 
    pathname && pathname.startsWith(route) || pathname === route
  );
};