import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, MenuProps, message, Space, Spin } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useAppDispatch, useAppSelector } from 'configs/hooks';
import { authActions, selectCurrentMenuAction } from 'features/admin/auth/authSlice';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './style.css';

const { Header, Content, Footer, Sider } = Layout;

// type MenuItem = Required<MenuProps>['items'][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//   } as MenuItem;
// }

// const items: MenuItem[] = [
//   getItem('Tổng quan', '/admin/dashboard', <DesktopOutlined />),
//   getItem('Quản trị người dùng', 'menu-sub', <TeamOutlined />, [
//     getItem('Quản lý ứng dụng', '/admin/managerApplication', <UserOutlined />),
//     getItem('Quản lý chức năng', '/admin/managerMenu', <UserOutlined />),
//     getItem('Quản lý nhóm người dùng', '/admin/managerGroup', <UserOutlined />),
//     getItem('Quản lý người dùng', '/admin/managerUser', <UserOutlined />),
//   ]),
// ];

// const menuItems = [
//   { label: 'Tổng quan', key: '/admin/dashboard', icon: <DesktopOutlined /> },
//   {
//     label: 'Quản trị người dùng',
//     key: 'menu-sub',
//     children: [
//       { label: 'Quản lý ứng dụng', key: '/admin/managerApplication', icon: <UserOutlined /> },
//       { label: 'Quản lý chức năng', key: '/admin/managerMenu', icon: <UserOutlined /> },
//       {
//         label: 'Quản lý nhóm người dùng',
//         key: '/admin/managerGroup',
//         icon: <UserOutlined />,
//       },
//       { label: 'Quản lý người dùng', key: '/admin/managerUser', icon: <UserOutlined /> },
//     ],
//     icon: <TeamOutlined />,
//   },
// ];

const handleMenuClick: MenuProps['onClick'] = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [menuActive, setMenuActive] = useState('/');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentMenuAction = useAppSelector(selectCurrentMenuAction);

  const listMenuAction = (): any => {
    const menu: any = currentMenuAction?.children;
    const menuAction = menu !== undefined ? menu[0] : null;
    if (menuAction !== null) {
      const items: any = [];
      const data = [menuAction];
      data.forEach((item: any) => {
        items.push({
          label: item.label,
          key: item.key,
          icon: <UserOutlined />,
          children: listMenuActionChildren(item.children),
        });
      });
      return items[0];
    }
    return [];
  };

  const listMenuActionChildren = (children: any): any => {
    const menuChildren: any = [];
    if (children.length > 0) {
      children.forEach((item: any) => {
        menuChildren.push({
          label: item.label,
          key: item.key,
          icon: <UserOutlined />,
          children: item?.children?.length > 0 ? listMenuActionChildren(item.children) : null,
        });
      });
    }
    return menuChildren;
  };

  const menuItems = [listMenuAction()];
  const items: MenuProps['items'] = [listMenuAction()];

  useEffect(() => {
    setMenuActive('/');
    findMenuDefault();
  }, [menuActive]);

  const handleLogoutClick: MenuProps['onClick'] = () => {
    dispatch(authActions.logout());
  };

  const avatarItems: MenuProps['items'] = [
    {
      label: '1st menu item',
      key: '1',
      icon: <UserOutlined />,
      onClick: handleMenuClick,
    },
    {
      label: '2nd menu item',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: 'Đăng xuất',
      key: '3',
      icon: <UserOutlined />,
      onClick: handleLogoutClick,
    },
  ];

  const findMenuDefault = () => {
    let menuDefault = '';
    const path = window.location.pathname;
    const menuAction = menuItems[0]?.key === undefined ? [] : [menuItems[0]];
    if (menuAction.length > 0) {
      menuAction.forEach((item: any) => {
        const child = item.children;
        if (child !== undefined) {
          child.forEach((o: any) => {
            if (path === o.key) {
              menuDefault = item.key;
            }
          });
        }
      });
    }
    if (menuDefault !== '') {
      setMenuActive(menuDefault);
    }
    return menuDefault;
  };

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0, color: 'white' }}>
          <div className="header-title">
            <Title style={{ color: 'white' }} level={3}>
              Hieu Boy
            </Title>
          </div>
          <div className="header-avatar">
            <Space direction="vertical">
              <Space wrap>
                <span onClick={(e) => e.preventDefault()}>
                  <Dropdown menu={{ items: avatarItems }} placement="bottomRight">
                    <Avatar size="large" icon={<UserOutlined />} />
                  </Dropdown>
                </span>
              </Space>
            </Space>
          </div>
        </Header>
        <Layout>
          <Sider
            width={300}
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <Spin
              spinning={items.length > 0 ? false : !false}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            >
              <Menu
                theme="light"
                defaultSelectedKeys={[window.location.pathname]}
                defaultOpenKeys={[`${menuActive}`]}
                mode="inline"
                items={items}
                onClick={({ key }) => {
                  navigate(key);
                }}
              />
            </Spin>
          </Sider>
          <Layout className="site-layout">
            <Content>
              <div className="content-breadcrumb">
                <Breadcrumb>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <Content className="site-layout-background">
                <Outlet />
              </Content>
            </Content>
            <Footer className="footer">Ant Design ©2022 Created by Hieu Boy</Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}
