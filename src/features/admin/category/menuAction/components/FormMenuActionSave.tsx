import { Col, Form, Input, Row, Select, Spin, TreeSelect } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import { MenuActionTree } from '../menuActionModel';

export interface FormMenuActionSaveProps {
  isUpdate?: boolean;
  spin?: boolean;
  form?: any;
  onFinish?: any;
  onFinishFailed?: any;
}

export function FormMenuActionSave(props: FormMenuActionSaveProps) {
  const { isUpdate, ...result } = props;

  const { menuActionByParent } = useAppSelector((state) => state.menuAction);
  const [selectParentCode, setSelectParentCode] = useState<MenuActionTree[]>([]);
  const [defaultAppCode, setDefaultAppCode] = useState<string>('Auth-Service');
  const [valueDescription, setValueDescription] = useState('');

  useEffect(() => {
    if (menuActionByParent !== undefined) {
      setSelectParentCode(menuActionByParent);
    }
  }, [menuActionByParent]);

  useEffect(() => {
    const description = result.form.getFieldValue('description');
    setValueDescription(description || '');
    const method = result.form.getFieldValue('method');
    if (method === '') {
      result.form.setFieldValue('method', undefined);
    }
  });

  useEffect(() => {
    result.form.setFieldsValue({
      appCode: defaultAppCode,
    });
  }, [])

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

  const selectFunction = [
    {
      value: 1,
      label: 'Frontend',
    },
    {
      value: 2,
      label: 'Backend Private',
    },
    {
      value: 3,
      label: 'Backend Public',
    },
  ];

  const selectMethod = [
    {
      value: '[GET]',
      label: '[GET]',
    },
    {
      value: '[POST]',
      label: '[POST]',
    },
    {
      value: '[PUT]',
      label: '[PUT]',
    },
    {
      value: '[DELETE]',
      label: '[DELETE]',
    },
  ];

  const methodSelector = (
    <Form.Item name="method" noStyle>
      <Select
        style={{ width: 110 }}
        placeholder="Method"
        options={selectMethod}
        allowClear
        disabled={isUpdate}
      />
    </Form.Item>
  );

  return (
    <>
      <Spin spinning={result.spin}>
        <Form
          form={result.form}
          layout="vertical"
          name="menuAction"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={result.onFinish}
          onFinishFailed={result.onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              {/* Mã ứng dụng */}
              <Form.Item
                name="appCode"
                label="Mã ứng dụng"
                rules={[{ required: true, message: 'Vui lòng chọn Mã ứng dụng!' }]}
              >
                <Select
                  placeholder="Chọn ứng dụng"
                  options={selectAppCode}
                  allowClear
                  disabled={isUpdate}
                />
              </Form.Item>

              {/* Mã chức năng */}
              <Form.Item
                name="menuCode"
                label="Mã chức năng"
                rules={[{ required: true, message: 'Vui lòng nhập Mã chức năng!' }]}
              >
                <Input disabled={isUpdate} />
              </Form.Item>

              {/* Đường dẫn Url */}
              <Form.Item
                name="url"
                label="Đường dẫn Url"
                rules={[{ required: true, message: 'Vui lòng nhập Đường dẫn Url của chức năng!' }]}
              >
                <Input addonBefore={methodSelector} style={{ width: '100%' }} disabled={isUpdate} />
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={12}>
              {/* Mã chức năng cha */}
              <Form.Item name="parentCode" label="Mã chức năng cha">
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="Chọn mã chức năng cha"
                  treeData={selectParentCode}
                  allowClear
                  treeDefaultExpandAll
                  disabled={isUpdate}
                />
              </Form.Item>

              {/* Tên chức năng */}
              <Form.Item
                name="name"
                label="Tên chức năng"
                rules={[{ required: true, message: 'Vui lòng nhập Tên chức năng!' }]}
              >
                <Input />
              </Form.Item>

              {/* Loại chức năng */}
              <Form.Item
                name="type"
                label="Loại chức năng"
                rules={[{ required: true, message: 'Vui lòng chọn Loại chức năng!' }]}
              >
                <Select
                  placeholder="Chọn loại chức năng"
                  options={selectFunction}
                  allowClear
                  disabled={isUpdate}
                />
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={24}>
              {/* Mô tả */}
              <Form.Item name="description" label="Mô tả">
                <Col span={24}>
                  <TextArea
                    value={valueDescription}
                    showCount
                    maxLength={500}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Col>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
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

FormMenuActionSave.defaultProps = {
  isUpdate: propTypes.bool,
  spin: propTypes.bool,
  form: propTypes.element,
  onFinish: propTypes.element,
  onFinishFailed: propTypes.element,
};
