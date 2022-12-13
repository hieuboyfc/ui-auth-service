import { Button } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import propTypes from 'prop-types';

export interface StyledButtonProps {
  htmlType?: any;
  form?: any;
  type?: any;
  title?: string;
  icon?: any;
  size?: SizeType;
  onClick?: any;
  loading?: boolean;
  className?: string;
}

export default function StyledButton(props: StyledButtonProps) {
  const { ...result } = props;
  const cssStyle = {
    width: '100%',
  };
  return (
    <>
      <Button {...result} style={cssStyle}>
        {result.title}
      </Button>
    </>
  );
}

StyledButton.defaultProps = {
  htmlType: [],
  form: [],
  type: [],
  title: propTypes.string,
  icon: propTypes.element,
  size: propTypes.element,
  onClick: propTypes.element,
  loading: false,
  className: propTypes.string,
};
