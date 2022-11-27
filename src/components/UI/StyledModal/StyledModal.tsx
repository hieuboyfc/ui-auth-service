import { CloseSquareOutlined, SaveOutlined } from '@ant-design/icons';
import { Modal, Space } from 'antd';
import propTypes from 'prop-types';
import StyledButton from '../StyledButton/StyledButton';

export interface StyledModalProps {
  title?: string;
  content?: any;
  open?: boolean;
  onOk?: any;
  onCancel?: any;
  confirmLoading?: boolean;
  className?: string;
  buttonTitle?: string;
}

export default function StyledModal(props: StyledModalProps) {
  const { ...result } = props;
  return (
    <>
      <Modal
        {...result}
        maskClosable={false}
        width="1200px"
        footer={
          <>
            <Space wrap>
              <StyledButton
                loading={result.confirmLoading}
                type="primary"
                onClick={result.onOk}
                size="middle"
                icon={<SaveOutlined />}
                title={result.buttonTitle}
              />
              <StyledButton
                type
                onClick={result.onCancel}
                size="middle"
                icon={<CloseSquareOutlined />}
                title="Hủy bỏ"
              />
            </Space>
          </>
        }
      >
        {result.content}
      </Modal>
    </>
  );
}

StyledModal.defaultProps = {
  title: propTypes.string,
  content: propTypes.shape,
  open: propTypes.bool,
  onOk: propTypes.shape,
  onCancel: propTypes.shape,
  confirmLoading: propTypes.bool,
  className: propTypes.string,
  buttonTitle: propTypes.string,
};
