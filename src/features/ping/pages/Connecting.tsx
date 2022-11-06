import axios from 'axios';
import { useEffect } from 'react';
import ReactLoading from 'react-loading';
import vnpost from '../../../assets/images/vnpost.png';
import '../styles.css';

export interface ConnectingProps {}

export default function Connecting(props: ConnectingProps) {
  useEffect(() => {
    axios
      .get('http://js-post-api.herokuapp.com/api')
      .then((response) => {})
      .catch((error) => {
        const result = error?.response;
        if (result.status === 404) {
        }
        console.log(result); // Logs a string: Error: Request failed with status code 404
      });
  });

  return (
    <div className="text-center">
      <div className="ping-logo" style={{ backgroundImage: `url('${vnpost}')` }} />
      <h5 className="system-login">Hệ Thống Đăng Nhập</h5>
      <ReactLoading
        type="spinningBubbles"
        color="#fcaf17"
        height={20}
        width={120}
        className="loadding"
      />
    </div>
  );
}
