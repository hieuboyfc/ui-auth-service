import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { GroupParams } from '../groupModel';
import { fetchGroup } from '../groupService';
import { groupSelector } from '../groupSlice';

export interface GroupProps {}

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

type LayoutType = Parameters<typeof Form>[0]['layout'];

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export function Group(props: GroupProps) {
  const dispatch = useAppDispatch();

  const { ...groupState } = useAppSelector(groupSelector);
  console.log('state: ', groupState);
  const { loading, error } = useAppSelector((state) => state.group);
  console.log('loading: ', loading);
  console.log('error: ', error);

  const defaultParams: GroupParams = {
    page: 0,
    size: 20,
    sort: 'id',
    groupCode: '',
    name: '',
    status: 1,
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('inline');

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const start = (index: number) => {
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const onFinish = (values: any) => {
    const params: GroupParams = {
      ...defaultParams,
      groupCode: values.groupCode,
      name: values.name,
    };
    dispatch(fetchGroup(params));
    console.log('Success:', params);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title="Tìm kiếm dữ liệu" size="small">
          <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Mã nhóm: " name="groupCode">
                  <Input placeholder="Mã nhóm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên nhóm: " name="name">
                  <Input placeholder="Tên nhóm" />
                </Form.Item>
              </Col>
            </Row>
            {/* <Divider orientation="left">Horizontal</Divider> */}
            <Row gutter={16} style={{ justifyContent: 'flex-end' }}>
              <Col style={{ width: '160px' }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Tìm kiếm
                  </Button>
                </Form.Item>
              </Col>
              <Col style={{ width: '160px' }}>
                <Form.Item>
                  <Button type="primary">Thêm mới</Button>
                </Form.Item>
              </Col>
              {/* <Col span={3} offset={18}></Col>
              <Col span={3}></Col> */}
            </Row>
          </Form>
        </Card>
        <Card title="Danh sách nhóm người dùng" size="small">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            scroll={{ x: 1500, y: 320 }}
          />
        </Card>
      </Space>
    </>
  );
}
