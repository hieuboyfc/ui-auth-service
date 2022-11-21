import { LoginOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useAppDispatch } from 'redux/hooks';
import { useState } from 'react';
import { authActions } from '../authSlice';
import SocialNetworks from './SocialNetworks';

const { Title } = Typography;

export default function SignIn() {
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    dispatch(
      authActions.login({
        username: values.username,
        password: values.password,
      }),
    );
  };

  const onFinishFailed = () => {
    enterLoading(0);
    console.log('Failed:');
  };

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  return (
    <Form
      name="signin"
      form={form}
      initialValues={{
        remember: false,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Title level={2} className="text-center">
        Đăng Nhập
      </Title>

      <SocialNetworks />

      <div className="option-text">hoặc sử dụng tài khoản của bạn</div>

      <Form.Item
        name="username"
        hasFeedback
        label="Tài khoản"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tài khoản của bạn.',
          },
        ]}
      >
        <Input placeholder="Tài khoản" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        hasFeedback
        label="Mật khẩu"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập mật khẩu của bạn.',
          },
          { min: 6, message: 'Mật khẩu phải có tối thiểu 6 ký tự.' },
        ]}
      >
        <Input.Password placeholder="Mật khẩu" size="large" />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Ghi nhớ</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="#">
          Quên mật khẩu?
        </a>
      </Form.Item>

      <Button
        loading={loadings[1]}
        htmlType="submit"
        shape="round"
        icon={<LoginOutlined />}
        size="large"
        className="mb-10 ant-btn-pink"
        onClick={() => enterLoading(1)}
      >
        Đăng nhập
      </Button>
    </Form>
  );
}
