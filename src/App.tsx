import { NotFound, PrivateRoute } from 'components/Common';
import { AdminLayout } from 'components/Layout';
import Auth from 'features/admin/auth/pages/Auth';
import { Group } from 'features/admin/category/group/pages/Group';
import Connecting from 'features/ping/pages/Connecting';
import { Route, Routes, useRoutes } from 'react-router-dom';

const LoadRouter = () => {
  const routes = useRoutes([
    { path: '/admin/login', element: <Auth /> },
    {
      element: <PrivateRoute />,
      children: [{ path: 'admin/*', element: <AdminLayout /> }],
    },
    { path: '/connect', element: <Connecting /> },
    { path: '*', element: <NotFound /> },
  ]);
  return routes;
};

function App() {
  // return <LoadRouter />;
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<Auth />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/managerApplication" element={<div>Quản lý ứng dụng</div>} />
            <Route path="/admin/managerMenu" element={<div>Quản lý chức năng</div>} />
            <Route path="/admin/managerGroup" element={<Group />} />
            <Route path="/admin/managerUser" element={<div>Quản lý người dùng</div>} />
            <Route path="/admin/*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="/connect" element={<Connecting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
