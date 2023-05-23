import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Form, Popconfirm, Result, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import StyledModal from 'components/UI/StyledModal/StyledModal';
import StyledTable from 'components/UI/StyledTable/StyledTable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { SIZE_OF_PAGE } from 'utils';
import { notifyError, notifySuccess } from 'utils/notification';
import { Sorter } from 'utils/sorter';
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onPageChange = (page: number, pageSize: number) => {
    const params: MenuActionParams = {
      ...requestParams,
      page: page - 1,
      size: pageSize,
    };
    fetchDataMenuAction(params);
    setRequestParams(params);
  };

  const onSizeChange = (current: number, pageSize: number) => {
    const params: MenuActionParams = {
      ...requestParams,
      page: current - 1,
      size: pageSize,
    };
    fetchDataMenuAction(params);
    setRequestParams(params);
  };

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
      title: 'Mã ứng dụng',
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
      title: 'Mã chức năng',
      dataIndex: 'menuCode',
      key: 'menuCode',
      sorter: {
        compare: Sorter.DEFAULT,
        multiple: 2,
      },
      sortDirections: ['descend', 'ascend'],
      ellipsis: true,
    },
    {
      title: 'Tên chức năng',
      dataIndex: 'name',
      key: 'name',
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
      width: 180,
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
      fixed: 'right',
      width: 180,
      align: 'center',
      render: ({ appCode, menuCode, name }) => (
        <>
          <Space wrap>
            <Button
              type="link"
              icon={<EditOutlined type="form" />}
              onClick={() => showModal('Update', { appCode, menuCode })}
            />
            <Popconfirm
              title={`Bạn có muốn xóa (${menuCode} - ${name}) này không? `}
              onConfirm={() => deleteItem(appCode, menuCode)}
              okText="Đồng ý"
              cancelText="Không"
            >
              <Button type="link" danger icon={<DeleteOutlined type="form" />} />
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

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
                <StyledTable
                  loading={loading}
                  rowSelection={rowSelection}
                  columns={columns}
                  response={menuActions}
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
