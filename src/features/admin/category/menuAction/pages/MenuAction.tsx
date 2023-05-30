import { EditOutlined, MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { Button, Card, Form, Result, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import StyledModal from 'components/UI/StyledModal/StyledModal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { SIZE_OF_PAGE } from 'utils';
import { notifyError, notifySuccess } from 'utils/notification';
import { FormMenuActionSave } from '../components/FormMenuActionSave';
import { FormMenuActionSearch } from '../components/FormMenuActionSearch';
import { MenuActionById, MenuActionModel, MenuActionParams } from '../menuActionModel';
import {
  deleteMenuAction,
  fetchMenuAction,
  getMenuAction,
  insertMenuAction,
  updateMenuAction,
} from '../menuActionService';
import './style.css';

export interface MenuActionProps {}

const dataTable: MenuActionModel[] = [
  {
    key: 1,
    name: 'Chạy ngay đi 1',
    menuCode: 'abc',
    parentCode: 'abc',
    appCode: 'abc',
    url: 'xxx',
    type: 1,
    orderNo: 1,
    status: 1,
    description: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'Chạy ngay đi',
        menuCode: 'abc',
        parentCode: 'abc',
        appCode: 'abc',
        url: 'xxx',
        type: 1,
        orderNo: 1,
        status: 1,
        description: 'New York No. 1 Lake Park',
      },
    ],
  },
  {
    key: 2,
    name: 'Chạy ngay đi',
    menuCode: 'abc',
    parentCode: 'abc',
    appCode: 'abc',
    url: 'xxx',
    type: 1,
    orderNo: 1,
    status: 1,
    description: 'New York No. 1 Lake Park',
  },
];

const defaultParams: MenuActionParams = {
  page: 0,
  size: SIZE_OF_PAGE,
  sort: 'DESC',
  menuCode: null,
  name: null,
  status: 1,
};

export function MenuAction() {
  const navigate = useNavigate();
  const backHome = () => {
    navigate('/admin', { replace: true });
  };
  const dispatch = useAppDispatch();
  const { loading, menuActions } = useAppSelector((state) => state.menuAction);
  const { currentMenuActionAll } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [requestParams, setRequestParams] = useState<MenuActionParams>(defaultParams);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('Thêm mới Chức năng');
  const [modalButtonTitle, setModalButtonTitle] = useState<string>('Lưu');
  const [typeSubmit, setTypeSubmit] = useState<string>('AddNew');
  const [spin, setSpin] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean>(true);
  const [dataPermission, setDataPermission] = useState<any>();

  useEffect(() => {
    if (currentMenuActionAll !== undefined) {
      setDataPermission(currentMenuActionAll);
    }
  }, [currentMenuActionAll]);

  function checkPermission(menuCode: string) {
    let check = false;
    if (dataPermission !== undefined) {
      check = dataPermission.filter((item: string) => {
        if (item === menuCode) {
          return true;
        }
        return false;
      });
    }
    return check;
  }

  function fetchDataMenuAction(params: MenuActionParams) {
    dispatch(fetchMenuAction(params))
      .then((result) => {
        const data: any = { ...result };
        if (data.meta.requestStatus === 'rejected') {
          notifyError(data.payload.message);
        }
      })
      .catch((e) => {
        notifyError(e);
      });
  }

  useEffect(() => {
    fetchDataMenuAction(requestParams);
  }, []);

  const onSearch = () => {
    const values = formSearch.getFieldsValue();
    const params: MenuActionParams = {
      ...requestParams,
      menuCode: values.menuCode ? values.menuCode : null,
      name: values.name ? values.name : null,
    };
    fetchDataMenuAction(params);
    setRequestParams(params);
  };

  const onSearchFailed = () => {
    notifyError('Có lỗi xảy ra trong quá trình thao tác');
  };

  const onSubmit = async () => {
    const values = form.getFieldsValue();
    const payload: MenuActionModel = {
      id: form?.getFieldValue('id') || '',
      menuCode: values.menuCode ? values.menuCode : null,
      appCode: values.appCode ? values.appCode : null,
      name: values.name ? values.name : null,
      status: values.status ? Number(values.status) : 0,
    };
    setConfirmLoading(true);
    setSpin(true);
    if (typeSubmit === 'AddNew') {
      const response = await dispatch(insertMenuAction(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        setTimeout(() => {
          setOpenModal(false);
          setConfirmLoading(false);
          dispatch(fetchMenuAction(requestParams));
          form.resetFields();
          notifySuccess('Thêm mới dữ liệu thành công');
        }, 2000);
      } else {
        notifyError(response.payload);
        setTimeout(() => {
          setSpin(false);
          setConfirmLoading(false);
        }, 1500);
      }
    }
    if (typeSubmit === 'Update') {
      const response = await dispatch(updateMenuAction(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        setTimeout(() => {
          setOpenModal(false);
          setConfirmLoading(false);
          dispatch(fetchMenuAction(requestParams));
          form.resetFields();
          notifySuccess('Cập nhật dữ liệu thành công');
        }, 2000);
      } else {
        notifyError(response.payload);
        setTimeout(() => {
          setSpin(false);
          setConfirmLoading(false);
        }, 1500);
      }
    }
  };

  const onSubmitMenuAction = async () => {};

  const onSubmitFailed = () => {
    setConfirmLoading(false);
    notifyError('Có lỗi xảy ra trong quá trình thao tác');
  };

  const showModal = async (type: string, values?: MenuActionById) => {
    setTypeSubmit(type);
    if (type === 'AddNew') {
      form.resetFields();
      setModalTitle('Thêm mới chức năng');
      setModalButtonTitle('Lưu');
      setOpenModal(true);
    }
    if (type === 'Update') {
      if (values?.appCode !== undefined && values?.menuCode !== undefined) {
        setSpin(true);
        const params = {
          appCode: values.appCode,
          menuCode: values.menuCode,
        };
        const response = await dispatch(getMenuAction(params));
        if (response.meta.requestStatus === 'fulfilled') {
          const dataResponse: any = response.payload;
          const { status, ...newData } = dataResponse;
          const result = {
            ...newData,
            id: newData.id,
            status: status ? String(status) : '0',
          };
          form.setFieldsValue(result);
          setModalTitle('Cập nhật chức năng');
          setModalButtonTitle('Cập nhật');
          setOpenModal(true);
        } else {
          notifyError(response.payload);
        }
        setSpin(false);
      }
    }
  };

  const deleteItem = async (appCode: string, menuCode: string) => {
    if (appCode !== undefined && menuCode !== undefined) {
      const params = {
        appCode,
        menuCode,
      };
      const response = await dispatch(deleteMenuAction(params));
      if (response.meta.requestStatus !== 'rejected') {
        dispatch(fetchMenuAction(requestParams));
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
    if (typeSubmit !== '') {
      form.resetFields();
      setOpenModal(false);
    }
  };

  const columns: ColumnsType<MenuActionModel> = [
    {
      title: 'Tên chức năng',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      ellipsis: true,
      width: '14%',
    },
    {
      title: 'Mã chức năng',
      dataIndex: 'menuCode',
      key: 'menuCode',
      fixed: 'left',
      ellipsis: true,
      width: '10%',
    },
    {
      title: 'Mã chức năng cha',
      dataIndex: 'parentCode',
      key: 'parentCode',
      ellipsis: true,
      width: '10%',
    },
    {
      title: 'Mã ứng dụng',
      dataIndex: 'appCode',
      key: 'appCode',
      ellipsis: true,
      width: '10%',
    },
    {
      title: 'Đường dẫn Url',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      width: '20%',
    },
    {
      title: 'Loại chức năng',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      width: '10%',
    },
    {
      title: 'Thứ tự',
      dataIndex: 'orderNo',
      key: 'orderNo',
      ellipsis: true,
      width: '10%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: '20%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      width: '12%',
      render: ({ status }) => (
        <>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical">
              {status === 1 && (
                <Tag color="blue" key={status}>
                  Đang hoạt động
                </Tag>
              )}
              {status === 0 && (
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
      align: 'center',
      ellipsis: true,
      fixed: 'right',
      width: '8%',
      render: ({ appCode, groupCode, name }) => (
        <>
          <Space wrap>
            {checkPermission('group/update') && (
              <>
                <Button
                  type="link"
                  icon={<EditOutlined type="form" />}
                  //onClick={() => showModal('Update', { appCode, groupCode })}
                />
              </>
            )}
          </Space>
        </>
      ),
    },
  ];

  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<MenuActionModel> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  return (
    <>
      {!permission && (
        <>
          <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không được phép truy cập trang này."
            extra={
              <Button type="primary" onClick={backHome}>
                Trang chủ
              </Button>
            }
          />
        </>
      )}
      {permission && (
        <>
          {menuActions && menuActions.result && (
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Card title="Tìm kiếm dữ liệu" size="small">
                <FormMenuActionSearch
                  loading={loading}
                  form={formSearch}
                  onSearch={onSearch}
                  onFinishFailed={onSearchFailed}
                  showModal={() => showModal('AddNew')}
                />
              </Card>
              <Card title="Danh sách chức năng" size="small">
                {/* <div className="total-elements">{`Tổng số bản ghi: ${menuActions.totalElements}`}</div> */}
                {/* <StyledTable
                  loading={loading}
                  rowSelection={rowSelection}
                  columns={columns}
                  response={menuActions}
                  onPageChange={onPageChange}
                  onSizeChange={onSizeChange}
                /> */}
                <Table
                  size="small"
                  indentSize={0}
                  columns={columns}
                  rowSelection={{ ...rowSelection }}
                  dataSource={dataTable}
                  scroll={{ x: 2000 }}
                  pagination={false}
                  bordered
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
              <FormMenuActionSave
                spin={spin}
                form={form}
                onFinish={onSubmit}
                onFinishFailed={onSubmitFailed}
              />
            }
            buttonTitle={modalButtonTitle}
            form="menuAction"
            htmlType="submit"
            width="600px"
          />
        </>
      )}
    </>
  );
}
