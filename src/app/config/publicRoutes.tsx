// config/publicRoutes.ts
export const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/email-verification',
  '/otpverification',
  '/forgot-password',
  '/forgotpassword',
  '/reset-password',
  '/verify-email',
  '/privacy-policy',
  '/terms',
  '/about',
  '/products',
  '/product-details',
  '/categories',
  '/contact',
  // Add any other public routes here
];

// Helper function to check if current path is public
export const isPublicRoute = (pathname: string | null): boolean => {
  return publicRoutes.some(route => 
    pathname && pathname.startsWith(route) || pathname === route
  );
};