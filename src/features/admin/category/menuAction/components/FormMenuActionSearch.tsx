import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd';
import StyledButton from 'components/UI/StyledButton/StyledButton';
import propTypes from 'prop-types';

export interface FormMenuActionSearchProps {
  loading?: boolean;
  form?: any;
  onFinishFailed?: any;
  onSearch?: any;
  showModal?: any;
}

export function FormMenuActionSearch(props: FormMenuActionSearchProps) {
  const { ...result } = props;

  return (
    <>
      <Form form={result.form} onFinishFailed={result.onFinishFailed}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Mã chức năng: " name="menuCode">
              <Input placeholder="Mã chức năng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tên chức năng: " name="name">
              <Input placeholder="Tên chức năng" />
            </Form.Item>
          </Col>
        </Row>
        {/* <Divider orientation="left">Horizontal</Divider> */}
        <Row gutter={16} style={{ justifyContent: 'flex-end' }}>
          <Col style={{ width: '160px' }}>
            <Form.Item>
              <StyledButton
                type="primary"
                loading={result.loading}
                onClick={result.onSearch}
                size="middle"
                icon={<SearchOutlined />}
                title="Tìm kiếm"
              />
            </Form.Item>
          </Col>
          <Col style={{ width: '160px' }}>
            <Form.Item>
              <StyledButton
                type="primary"
                onClick={result.showModal}
                size="middle"
                icon={<PlusOutlined />}
                title="Thêm mới"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

FormMenuActionSearch.defaultProps = {
  loading: propTypes.bool,
  form: propTypes.element,
  onFinishFailed: propTypes.element,
  onSearch: propTypes.element,
  showModal: propTypes.element,
};
