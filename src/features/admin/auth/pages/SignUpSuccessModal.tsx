import { LoginOutlined } from '@ant-design/icons';
import { Button, Modal, Result } from 'antd';

export interface SignUpSuccessProps {}

export default function SignUpSuccess(props: SignUpSuccessProps) {
  return (
    <Modal visible footer={null}>
      <Result
        status="success"
        title="Congratulations! Registration completed successfully!"
        subTitle="Now you can sign in to our system."
        extra={[
          <Button
            type="primary"
            shape="round"
            icon={<LoginOutlined />}
            key="console"
            // onClick={handleRedirect}
          >
            Sign In now
          </Button>,
        ]}
      />
    </Modal>
  );
}
