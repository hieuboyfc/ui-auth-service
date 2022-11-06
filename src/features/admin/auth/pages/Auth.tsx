import { SelectOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useMediaQuery } from 'react-responsive';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './style.css';

const { Link } = Typography;

export interface AuthProps {}

export default function Auth(props: AuthProps) {
  const [isPanelRightActive, setIsPanelRightActive] = useState(false);

  const handleClickSignIn = () => {
    setIsPanelRightActive(false);
  };

  const handleClickSignUp = () => {
    setIsPanelRightActive(true);
  };

  const switchMode = () => {
    setIsPanelRightActive(!isPanelRightActive);
  };

  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

  const store = {
    setIsPanelRightActive,
    isPanelRightActive,
  };

  const AuthContext = React.createContext(store);

  return (
    <>
      <AuthContext.Provider value={store} />
      <div className="auth-page">
        <HelmetProvider>
          <Helmet>
            <title>Ứng dụng</title>
            <meta name="description" content="React App authentication" />
          </Helmet>
        </HelmetProvider>

        {isTabletOrDesktop ? (
          <div className="auth-page-wrapper">
            <div className={`auth-container ${isPanelRightActive ? 'right-panel-active' : ''}`}>
              <div className="form-container sign-up-container">
                <SignUp />
              </div>
              <div className="form-container sign-in-container">
                <SignIn />
              </div>

              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-left bg-gradient">
                    <h1>Chào mừng!</h1>
                    <p>
                      Nếu bạn chưa có tài khoản, hãy nhập thông tin cá nhân của bạn và bắt đầu hành
                      trình với chúng tôi
                    </p>
                    <Button
                      shape="round"
                      onClick={handleClickSignIn}
                      icon={<SelectOutlined />}
                      size="large"
                    >
                      Sử dụng tài khoản đã có
                    </Button>
                  </div>
                  <div className="overlay-panel overlay-right bg-gradient">
                    <h1>Xin chào, Bạn!</h1>
                    <p>
                      Nếu bạn chưa có tài khoản, hãy nhập thông tin cá nhân của bạn và bắt đầu hành
                      trình với chúng tôi
                    </p>
                    <Button
                      shape="round"
                      onClick={handleClickSignUp}
                      icon={<SelectOutlined />}
                      size="large"
                    >
                      Tạo tài khoản mới
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mobile-auth-warpper">
            {!isPanelRightActive ? (
              <>
                <SignIn />
                <div className="text-center" onClick={switchMode}>
                  Bạn không có tài khoản? <Link>Đăng ký ngay.</Link>
                </div>
              </>
            ) : (
              <>
                {/* <SignUp /> */}
                <div className="text-center" onClick={switchMode}>
                  Bạn đã có sẵn tài khoản? <Link>Đăng nhập ngay.</Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
