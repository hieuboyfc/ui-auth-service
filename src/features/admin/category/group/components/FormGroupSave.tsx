import { Col, Form, Input, Row, Select, Spin } from 'antd';
import propTypes from 'prop-types';

export interface FormGroupSaveProps {
  spin?: boolean;
  form?: any;
  onFinish?: any;
  onFinishFailed?: any;
}

export function FormGroupSave(props: FormGroupSaveProps) {
  const { ...result } = props;

  const selectAppCode = [
    {
      value: 'Auth-Service',
      label: 'Auth-Service',
    },
  ];

  const selectStatus = [
    {
      value: '1',
      label: 'Đang hoạt động',
    },
    {
      value: '2',
      label: 'Ngừng hoạt động',
    },
  ];

  return (
    <>
      <Spin spinning={result.spin}>
        <Form
          form={result.form}
          layout="vertical"
          name="group"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={result.onFinish}
          onFinishFailed={result.onFinishFailed}
          autoComplete="off"
        >
          <Row>
            <Col span={24}>
              {/* Mã ứng dụng */}
              <Form.Item
                name="appCode"
                label="Mã ứng dụng"
                rules={[{ required: true, message: 'Vui lòng chọn Mã ứng dụng!' }]}
              >
                <Select placeholder="Chọn ứng dụng" options={selectAppCode} />
              </Form.Item>

              {/* Mã nhóm */}
              <Form.Item
                name="groupCode"
                label="Mã nhóm"
                rules={[{ required: true, message: 'Vui lòng nhập Mã nhóm!' }]}
              >
                <Input />
              </Form.Item>

              {/* Tên nhóm */}
              <Form.Item
                name="name"
                label="Tên nhóm"
                rules={[{ required: true, message: 'Vui lòng nhập Tên nhóm!' }]}
              >
                <Input />
              </Form.Item>

              {/* Trạng thái */}
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn Trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái" options={selectStatus} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
}

FormGroupSave.defaultProps = {
  spin: propTypes.bool,
  form: propTypes.element,
  onFinish: propTypes.element,
  onFinishFailed: propTypes.element,
};
