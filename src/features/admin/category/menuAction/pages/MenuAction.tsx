import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Popconfirm, Result, Row, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import StyledButton from 'components/UI/StyledButton/StyledButton';
import StyledModal from 'components/UI/StyledModal/StyledModal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { notifyError, notifySuccess } from 'utils/notification';
import { FormMenuActionSave } from '../components/FormMenuActionSave';
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
      const result: string[] = [];
      dataPermission.forEach((item: any) => {
        if (item.menuCode === menuCode) {
          result.push(menuCode);
        }
      });
      if (result.includes(menuCode)) {
        check = true;
      }
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
    fetchDataMenuAction(defaultParams);
  }, []);

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
          dispatch(fetchMenuAction(defaultParams));
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
          dispatch(fetchMenuAction(defaultParams));
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
        dispatch(fetchMenuAction(defaultParams));
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
      key: 'type',
      ellipsis: true,
      width: '10%',
      render: ({ type }) => (
        <>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical">
              {type === 1 && (
                <Tag color="purple" key={type}>
                  Frontend
                </Tag>
              )}
              {type === 2 && (
                <Tag color="green" key={type}>
                  Backend
                </Tag>
              )}
            </Space>
          </div>
        </>
      ),
    },
    {
      title: 'Thứ tự',
      key: 'orderNum',
      ellipsis: true,
      width: '10%',
      render: ({ orderNum }) => (
        <>
          <div style={{ textAlign: 'center' }}>
            {orderNum !== undefined && (
              <Space direction="vertical">
                <Tag color="cyan" key={orderNum}>
                  {orderNum}
                </Tag>
              </Space>
            )}
          </div>
        </>
      ),
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
      width: '10%',
      render: ({ appCode, menuCode, type, name }) => (
        <>
          <Space wrap>
            {checkPermission('menu-action/create') && type === 1 && (
              <>
                <Button
                  type="link"
                  icon={<PlusCircleOutlined type="form" />}
                  //onClick={() => showModal('Update', { appCode, groupCode })}
                />
              </>
            )}
            {checkPermission('menu-action/update') && (
              <>
                <Button
                  type="link"
                  icon={<EditOutlined type="form" />}
                  onClick={() => showModal('Update', { appCode, menuCode })}
                />
              </>
            )}
            {checkPermission('menu-action/delete') && type === 2 && (
              <>
                <Popconfirm
                  title={`Bạn có muốn xóa (${menuCode} - ${name}) này không? `}
                  onConfirm={() => deleteItem(appCode, menuCode)}
                  okText="Đồng ý"
                  cancelText="Không"
                >
                  <Button type="link" danger icon={<DeleteOutlined type="form" />} />
                </Popconfirm>
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
          {menuActions && menuActions?.children && (
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Card title="Thao tác chức năng" size="small">
                <Row gutter={16} style={{ justifyContent: 'flex-end' }}>
                  <Col style={{ width: '160px' }}>
                    <StyledButton
                      type="primary"
                      onClick={() => showModal('AddNew')}
                      size="middle"
                      icon={<PlusOutlined />}
                      title="Thêm mới"
                    />
                  </Col>
                </Row>
              </Card>
              <Card title="Danh sách dữ liệu chức năng" size="small">
                <div className="total-elements">{`Tổng số bản ghi: ${
                  menuActions?.totalRecord || 0
                }`}</div>
                <Table
                  size="small"
                  indentSize={0}
                  columns={columns}
                  rowSelection={{ ...rowSelection }}
                  dataSource={menuActions?.children || []}
                  scroll={{ x: 2000 }}
                  pagination={false}
                  defaultExpandAllRows
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
