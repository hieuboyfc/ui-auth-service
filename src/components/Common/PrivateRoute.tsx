import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

export function PrivateRoute() {
  const isLoggedIn = Boolean(Cookies.get('accessToken'));
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" state={null} />;
  }
  return <Outlet />;
}
