import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import StyledButton from 'components/UI/StyledButton/StyledButton';
import StyledModal from 'components/UI/StyledModal/StyledModal';
import StyledTable from 'components/UI/StyledTable/StyledTable';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { SIZE_OF_PAGE } from 'utils';
import { Sorter } from 'utils/sorter';
import { GroupModel, GroupParams } from '../groupModel';
import { fetchGroup } from '../groupService';
import './style.css';

export interface GroupProps {}

const buttonProps = {
  style: { padding: '5px' },
};

type LayoutType = Parameters<typeof Form>[0]['layout'];

const defaultParams: GroupParams = {
  page: 0,
  size: SIZE_OF_PAGE,
  sort: 'id',
  groupCode: null,
  name: null,
  status: 1,
};

export function Group(props: GroupProps) {
  const dispatch = useAppDispatch();
  const { loading, error, groups } = useAppSelector((state) => state.group);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('inline');
  const [requestParams, setRequestParams] = useState<GroupParams>(defaultParams);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('Thêm mới Nhóm người dùng');
  const [modalButtonTitle, setModalButtonTitle] = useState<string>('Lưu');
  const [modalText, setModalText] = useState<string>('Content of the modal');

  useEffect(() => {
    dispatch(fetchGroup(requestParams));
  }, []);

  const columns: ColumnsType<GroupModel> = [
    {
      title: 'Mã ứng dụng',
      width: 100,
      dataIndex: 'appCode',
      key: 'appCode',
      fixed: 'left',
      sorter: {
        compare: Sorter.DEFAULT,
        multiple: 3,
      },
      sortDirections: ['descend', 'ascend'],
      ellipsis: true,
    },
    {
      title: 'Mã nhóm',
      width: 100,
      dataIndex: 'groupCode',
      key: 'groupCode',
      fixed: 'left',
      sorter: {
        compare: Sorter.DEFAULT,
        multiple: 2,
      },
      sortDirections: ['descend', 'ascend'],
      ellipsis: true,
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      sorter: {
        compare: Sorter.DEFAULT,
        multiple: 1,
      },
      sortDirections: ['descend', 'ascend'],
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 80,
      fixed: 'left',
      render: ({ status }) => (
        <>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical">
              {status === 1 && (
                <Tag color="blue" key={status}>
                  Đang hoạt động
                </Tag>
              )}
              {status === 2 && (
                <Tag color="error" key={status}>
                  Ngừng hoạt động
                </Tag>
              )}
            </Space>
          </div>
        </>
      ),
    },
    {
      title: 'Chức năng',
      key: 'operation',
      width: 60,
      align: 'center',
      render: ({ key, groupCode, name }) => (
        <>
          <Space wrap>
            <Button {...buttonProps} type="link" onClick={() => showModal('Update')}>
              <EditOutlined type="form" /> {key}
            </Button>
            <Popconfirm
              title={`Bạn có muốn xóa (${groupCode} - ${name}) này không? `}
              onConfirm={() => showModal('Update')}
              okText="Đồng ý"
              cancelText="Không"
            >
              <Button {...buttonProps} type="link" danger icon={<DeleteOutlined type="form" />} />
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const start = (index: number) => {
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const onPageChange = (page: number, pageSize: number) => {
    const params: GroupParams = {
      ...requestParams,
      page: page - 1,
      size: pageSize,
    };
    dispatch(fetchGroup(params));
    setRequestParams(params);
  };

  const onSizeChange = (current: number, pageSize: number) => {
    const params: GroupParams = {
      ...requestParams,
      page: current - 1,
      size: pageSize,
    };
    dispatch(fetchGroup(params));
    setRequestParams(params);
  };

  const onFinish = (values: any) => {
    const params: GroupParams = {
      ...requestParams,
      groupCode: values.groupCode ? values.groupCode : null,
      name: values.name ? values.name : null,
    };
    dispatch(fetchGroup(params));
    setRequestParams(params);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const showModal = (type: string) => {
    setModalTitle('Thêm mới Nhóm người dùng');
    if (type === 'AddNew') {
      setModalTitle('Thêm mới Nhóm người dùng');
      setModalButtonTitle('Lưu');
    }
    if (type === 'Update') {
      setModalTitle('Cập nhật Nhóm người dùng');
      setModalButtonTitle('Cập nhật');
    }
    setOpenModal(true);
  };

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenModal(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpenModal(false);
  };

  return (
    <>
      {groups && groups.data && (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Card title="Tìm kiếm dữ liệu" size="small">
            <Form onFinishFailed={onFinishFailed}>
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
                    <StyledButton
                      type="primary"
                      loading={loading}
                      onClick={onFinish}
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
                      onClick={() => showModal('AddNew')}
                      size="middle"
                      icon={<PlusOutlined />}
                      title="Thêm mới"
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={3} offset={18}></Col>
              <Col span={3}></Col> */}
              </Row>
            </Form>
          </Card>
          <Card title="Danh sách nhóm người dùng" size="small">
            {/* <div className="total-elements">{`Tổng số bản ghi: ${groups.totalElements}`}</div> */}
            <StyledTable
              loading={loading}
              rowSelection={rowSelection}
              columns={columns}
              response={groups}
              onPageChange={onPageChange}
              onSizeChange={onSizeChange}
            />
          </Card>
        </Space>
      )}
      <StyledModal
        title={modalTitle}
        className="modalStyle"
        open={openModal}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        content={modalText}
        buttonTitle={modalButtonTitle}
      />
    </>
  );
}
