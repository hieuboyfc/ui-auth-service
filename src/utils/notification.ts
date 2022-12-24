import { notification } from 'antd';

notification.config({
  placement: 'topRight',
  bottom: 50,
  duration: 3,
  rtl: true,
});

export const notifySuccess = (message: any) => {
  notification.success({
    message: `Thông báo`,
    description: message,
  });
};

export const notifyError = (error: any) => {
  notification.error({
    message: `Thông báo`,
    description: error?.message || error,
  });
};
