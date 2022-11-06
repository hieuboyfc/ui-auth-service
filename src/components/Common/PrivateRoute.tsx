import { Navigate, Outlet, RouteProps } from 'react-router-dom';

export function PrivateRoute(props: RouteProps) {
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" state={null} />;
  }
  return <Outlet />;
}
