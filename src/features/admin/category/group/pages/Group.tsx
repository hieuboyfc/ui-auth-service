import { DeleteOutlined, EditOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Card, Form, Popconfirm, Space, Spin, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Tree, { DataNode } from 'antd/lib/tree';
import StyledModal from 'components/UI/StyledModal/StyledModal';
import StyledTable from 'components/UI/StyledTable/StyledTable';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { SIZE_OF_PAGE } from 'utils';
import { notifyError, notifySuccess } from 'utils/notification';
import { Sorter } from 'utils/sorter';
import { getMenuActionAllByGroup } from '../../menuAction/menuActionService';
import { FormGroupSave } from '../components/FormGroupSave';
import { FormGroupSearch } from '../components/FormGroupSearch';
import { GroupById, GroupModel, GroupParams } from '../groupModel';
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
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<DataNode[]>([]);

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

  const showModal = async (type: string, values?: GroupById) => {
    setTypeSubmit(type);
    if (type === 'AddNew') {
      form.resetFields();
      setModalTitle('Thêm mới Nhóm người dùng');
      setModalButtonTitle('Lưu');
      setOpenModal(true);
    }
    if (type === 'Update') {
      if (values?.appCode !== undefined && values?.groupCode !== undefined) {
        setSpin(true);
        const params = {
          appCode: values.appCode,
          groupCode: values.groupCode,
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

  const showModalMenuAction = async (values?: GroupById) => {
    if (values?.appCode !== undefined && values?.groupCode !== undefined) {
      const params = {
        appCode: values.appCode,
        groupCode: values.groupCode,
      };
      setSpin(true);
      setModalButtonTitle('Cập nhật');
      setModalTitle('Phân quyền chức năng cho Nhóm người dùng');
      const response = await dispatch(getMenuActionAllByGroup(params));
      if (response?.meta?.requestStatus === 'fulfilled') {
        const result: any = response.payload;
        setOpenModalMenu(true);
        setTreeData(result.children);
        setExpandedKeys(result.items.expanded);
        setCheckedKeys(result.items.checked);
        setSpin(false);
      } else {
        notifyError('Đã xảy ra lỗi khi thực hiện Phân quyền chức năng cho Nhóm người dùng');
      }
    } else {
      notifyError('Không lấy được thông tin Mã ứng dụng hoặc Mã nhóm người dùng');
    }
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
              onClick={() => showModal('Update', { appCode, groupCode })}
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
              onClick={() => showModalMenuAction({ appCode, groupCode })}
            />
          </Space>
        </>
      ),
    },
  ];

  const onExpandMenuAction = (expandedKeysValue: React.Key[]) => {
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

  const renderMenuAction = () => (
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
            <FormGroupSearch
              loading={loading}
              form={formSearch}
              onSearch={onSearch}
              onFinishFailed={onSearchFailed}
              showModal={() => showModal('AddNew')}
            />
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
        content={
          <FormGroupSave
            spin={spin}
            form={form}
            onFinish={onSubmit}
            onFinishFailed={onSubmitFailed}
          />
        }
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
        content={renderMenuAction()}
        buttonTitle={modalButtonTitle}
        form="menuAction"
        htmlType="submit"
        width="800px"
      />
    </>
  );
}
