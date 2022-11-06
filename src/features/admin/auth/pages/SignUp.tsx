import { UserAddOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Row, Typography } from 'antd';
import { useState } from 'react';
import SocialNetworks from './SocialNetworks';
import SignUpSuccessModal from './SignUpSuccessModal';

const { Title } = Typography;

export interface SignUpProps {}

export default function SignUp(props: SignUpProps) {
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onCheckboxChange = (e: any) => {
    setChecked(e.target.checked);
  };

  const validation = (rule: any, value: any, callback: any) => {
    if (checked) {
      return callback();
    }
    return callback('Vui lòng đồng ý Điều khoản Sử dụng & Chính sách quyền riêng tư');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && <SignUpSuccessModal />}

      <Form
        name="signup"
        initialValues={{}}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Title level={2} className="text-center">
          Tạo Tài Khoản
        </Title>
        <SocialNetworks />

        <div className="option-text">hoặc sử dụng email của bạn để đăng ký</div>

        <Row gutter={{ xs: 8, sm: 16 }}>
          <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item
              hasFeedback
              name="fullName"
              label="Họ và tên"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ và tên của bạn.',
                },
                {
                  min: 6,
                  message: 'Họ và tên của bạn phải có ít nhất 6 ký tự.',
                },
              ]}
            >
              <Input placeholder="Họ và tên" size="large" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item
              hasFeedback
              name="username"
              label="Tài khoản"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tài khoản của bạn.',
                },
                {
                  min: 6,
                  message: 'Tài khoản của bạn phải có ít nhất 6 ký tự.',
                },
              ]}
            >
              <Input placeholder="Tài khoản" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Địa chỉ Email"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ email của bạn.',
            },
            {
              type: 'email',
              message: 'Địa chỉ email của bạn không hợp lệ.',
            },
          ]}
        >
          <Input placeholder="Địa chỉ Email" size="large" />
        </Form.Item>

        <Row gutter={{ xs: 8, sm: 16 }}>
          <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              hasFeedback
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
          </Col>

          <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Xác nhận mật khẩu của bạn.',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Hai mật khẩu bạn đã nhập không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Form.Item
            name="agree"
            valuePropName="checked"
            noStyle
            rules={[{ validator: validation }]}
          >
            <Checkbox checked={checked} onChange={onCheckboxChange}>
              Tôi đồng ý <a href="#">Điều khoản & chính sách quyền riêng tư</a>.
            </Checkbox>
          </Form.Item>
        </Form.Item>

        <Button
          loading={loading}
          className="form-submit-btn mb-10 ant-btn-pink"
          htmlType="submit"
          shape="round"
          icon={<UserAddOutlined />}
          size="large"
        >
          Đăng Ký
        </Button>
      </Form>
    </>
  );
}
