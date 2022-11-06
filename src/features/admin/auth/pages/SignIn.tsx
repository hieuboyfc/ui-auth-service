import { LoginOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useAppDispatch } from 'configs/hooks';
import { authActions } from '../authSlice';
import SocialNetworks from './SocialNetworks';

const { Title } = Typography;

export default function SignIn() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    dispatch(
      authActions.login({
        username: values.email,
        password: values.password,
      }),
    );
  };

  const onFinishFailed = () => {
    console.log('Failed:');
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
        name="email"
        hasFeedback
        label="Địa chỉ Email"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập email của bạn.',
          },
          {
            type: 'email',
            message: 'Địa chỉ email của bạn không hợp lệ.',
          },
        ]}
      >
        <Input placeholder="Địa chỉ Email" size="large" />
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
        loading={false}
        htmlType="submit"
        shape="round"
        icon={<LoginOutlined />}
        size="large"
        className="mb-10 ant-btn-pink"
      >
        Đăng nhập
      </Button>
    </Form>
  );
}
