import {
  DeleteOutlined,
  EditOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Select, Space, Spin, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Tree, { DataNode } from 'antd/lib/tree';
import StyledButton from 'components/UI/StyledButton/StyledButton';
import StyledModal from 'components/UI/StyledModal/StyledModal';
import StyledTable from 'components/UI/StyledTable/StyledTable';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { SIZE_OF_PAGE } from 'utils';
import { notifyError, notifySuccess } from 'utils/notification';
import { Sorter } from 'utils/sorter';
import { GroupModel, GroupParams } from '../groupModel';
import { deleteGroup, fetchGroup, getGroup, insertGroup, updateGroup } from '../groupService';
import './style.css';

export interface GroupProps {}

const buttonProps = {
  style: { width: '25%' },
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

export function Group() {
  const dispatch = useAppDispatch();
  const { loading, groups } = useAppSelector((state) => state.group);
  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('inline');
  const [requestParams, setRequestParams] = useState<GroupParams>(defaultParams);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalMenu, setOpenModalMenu] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('Thêm mới Nhóm người dùng');
  const [modalButtonTitle, setModalButtonTitle] = useState<string>('Lưu');
  const [typeSubmit, setTypeSubmit] = useState<string>('AddNew');
  const [spin, setSpin] = useState<boolean>(false);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['0-0-0-0']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchGroup(requestParams));
  }, []);

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

  const onSearch = () => {
    const values = formSearch.getFieldsValue();
    const params: GroupParams = {
      ...requestParams,
      groupCode: values.groupCode ? values.groupCode : null,
      name: values.name ? values.name : null,
    };
    dispatch(fetchGroup(params));
    setRequestParams(params);
  };

  const onSearchFailed = (errorInfo: any) => {
    notifyError(errorInfo);
  };

  const onSubmit = async (values: any) => {
    const payload: GroupModel = {
      groupCode: values.groupCode ? values.groupCode : null,
      appCode: values.appCode ? values.appCode : null,
      name: values.name ? values.name : null,
      status: values.status ? Number(values.status) : 0,
    };
    setConfirmLoading(true);
    setSpin(true);
    if (typeSubmit === 'AddNew') {
      const response = await dispatch(insertGroup(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        setTimeout(() => {
          setOpenModal(false);
          setConfirmLoading(false);
          setSpin(false);
          dispatch(fetchGroup(requestParams));
          form.resetFields();
          notifySuccess('Thêm mới dữ liệu thành công');
        }, 2000);
      } else {
        notifyError(response.payload);
      }
    }
    if (typeSubmit === 'Update') {
      const response = await dispatch(updateGroup(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        setTimeout(() => {
          setOpenModal(false);
          setConfirmLoading(false);
          setSpin(false);
          dispatch(fetchGroup(requestParams));
          form.resetFields();
          notifySuccess('Cập nhật dữ liệu thành công');
        }, 2000);
      } else {
        notifyError(response.payload);
      }
    }
  };

  const onSubmitMenuAction = async () => {};

  const onSubmitFailed = (errorInfo: any) => {
    setConfirmLoading(false);
    notifyError(errorInfo);
  };

  const showModal = async (type: string, appCode?: string, groupCode?: string) => {
    setTypeSubmit(type);
    if (type === 'AddNew') {
      form.resetFields();
      setModalTitle('Thêm mới Nhóm người dùng');
      setModalButtonTitle('Lưu');
      setOpenModal(true);
    }
    if (type === 'Update') {
      if (appCode !== undefined && groupCode !== undefined) {
        setSpin(true);
        const params = {
          appCode,
          groupCode,
        };
        const response = await dispatch(getGroup(params));
        if (response.meta.requestStatus === 'fulfilled') {
          const dataResponse: any = response.payload;
          const { status, ...newData } = dataResponse;
          const result = { ...newData, status: status ? String(status) : '0' };
          form.setFieldsValue(result);
          setModalTitle('Cập nhật Nhóm người dùng');
          setModalButtonTitle('Cập nhật');
          setOpenModal(true);
        } else {
          notifyError(response.payload);
        }
        setSpin(false);
      }
    }
  };

  const showModalMenuAction = async (type: string, appCode?: string, groupCode?: string) => {
    setTypeSubmit(type);
    setModalButtonTitle('Cập nhật');
    setModalTitle('Phân quyền chức năng');
    setOpenModalMenu(true);
  };

  const deleteItem = async (appCode: string, groupCode: string) => {
    if (appCode !== undefined && groupCode !== undefined) {
      const params = {
        appCode,
        groupCode,
      };
      const response = await dispatch(deleteGroup(params));
      if (response.meta.requestStatus !== 'rejected') {
        dispatch(fetchGroup(requestParams));
        notifySuccess('Xóa dữ liệu dữ liệu thành công');
      } else {
        notifyError(response.payload);
      }
    }
  };

  const handleOk = () => {
    // setModalText('The modal will be closed after two seconds');
    // setConfirmLoading(true);
    // setTimeout(() => {
    //   setOpenModal(false);
    //   setConfirmLoading(false);
    // }, 2000);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setOpenModalMenu(false);
  };

  const columns: ColumnsType<GroupModel> = [
    {
      fixed: 'left',
      title: 'Mã ứng dụng',
      width: 100,
      dataIndex: 'appCode',
      key: 'appCode',
      sorter: {
        compare: Sorter.DEFAULT,
        multiple: 3,
      },
      sortDirections: ['descend', 'ascend'],
      ellipsis: true,
    },
    {
      fixed: 'left',
      title: 'Mã nhóm',
      width: 100,
      dataIndex: 'groupCode',
      key: 'groupCode',
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
      render: ({ appCode, groupCode, name }) => (
        <>
          <Space wrap>
            <Button
              type="link"
              icon={<EditOutlined type="form" />}
              onClick={() => showModal('Update', appCode, groupCode)}
            />
            <Popconfirm
              title={`Bạn có muốn xóa (${groupCode} - ${name}) này không? `}
              onConfirm={() => deleteItem(appCode, groupCode)}
              okText="Đồng ý"
              cancelText="Không"
            >
              <Button type="link" danger icon={<DeleteOutlined type="form" />} />
            </Popconfirm>
            <Button
              type="link"
              icon={<MenuUnfoldOutlined type="form" />}
              onClick={() => showModalMenuAction('getMenuAction', appCode, groupCode)}
            />
          </Space>
        </>
      ),
    },
  ];

  const treeData: DataNode[] = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
          ],
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    },
    {
      title: '0-2',
      key: '0-2',
    },
  ];

  const renderSearchForm = () => (
    <>
      <Form form={formSearch} onFinishFailed={onSearchFailed}>
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
                onClick={onSearch}
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
    </>
  );

  const renderForm = () => (
    <>
      <Spin spinning={spin}>
        <Form
          form={form}
          layout="vertical"
          name="group"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          onFinishFailed={onSubmitFailed}
          autoComplete="off"
        >
          <Row>
            <Col span={24}>
              {/* Mã ứng dụng */}
              <Form.Item
                name="appCode"
                label="Mã ứng dụng"
                rules={[{ required: true, message: 'Vui lòng chọn mã ứng dụng!' }]}
              >
                <Select
                  placeholder="Chọn ứng dụng"
                  options={[
                    {
                      value: 'Auth-Service',
                      label: 'Auth-Service',
                    },
                  ]}
                />
              </Form.Item>

              {/* Mã nhóm */}
              <Form.Item
                name="groupCode"
                label="Mã nhóm"
                rules={[{ required: true, message: 'Vui lòng nhập mã nhóm!' }]}
              >
                <Input />
              </Form.Item>

              {/* Tên nhóm */}
              <Form.Item
                name="name"
                label="Tên nhóm"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhóm!' }]}
              >
                <Input />
              </Form.Item>

              {/* Trạng thái */}
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select
                  placeholder="Chọn trạng thái"
                  options={[
                    {
                      value: '1',
                      label: 'Đang hoạt động',
                    },
                    {
                      value: '2',
                      label: 'Ngừng hoạt động',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );

  const onExpandMenuAction = (expandedKeysValue: React.Key[]) => {
    debugger;
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheckMenuAction = (checkedKeysValue: any) => {
    debugger;
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelectMenuAction = (selectedKeysValue: React.Key[], info: any) => {
    debugger;
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const renderMenuActionForm = () => (
    <>
      <Spin spinning={spin}>
        <Tree
          checkable
          onExpand={onExpandMenuAction}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheckMenuAction}
          checkedKeys={checkedKeys}
          onSelect={onSelectMenuAction}
          selectedKeys={selectedKeys}
          treeData={treeData}
        />
      </Spin>
    </>
  );

  return (
    <>
      {groups && groups.data && (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Card title="Tìm kiếm dữ liệu" size="small">
            {renderSearchForm()}
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
        content={renderForm()}
        buttonTitle={modalButtonTitle}
        form="group"
        htmlType="submit"
        width="600px"
      />
      <StyledModal
        title={modalTitle}
        className="modalStyle"
        open={openModalMenu}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        content={renderMenuActionForm()}
        buttonTitle={modalButtonTitle}
        form="menuAction"
        htmlType="submit"
        width="800px"
      />
    </>
  );
}
