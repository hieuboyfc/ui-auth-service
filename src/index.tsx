import { ConfigProvider } from 'antd';
import App from 'App';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { history } from 'utils';
import './index.css';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  // <React.StrictMode></React.StrictMode>,
  <Provider store={store}>
    <HistoryRouter history={history}>
      <ConfigProvider direction="ltr">
        <App />
      </ConfigProvider>
    </HistoryRouter>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
