import React, { useEffect } from 'react';
import { connect } from 'dva';
import { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';
import { ConnectState, Dispatch } from '@/models/connect';

export interface AuthLayoutProps extends ProLayoutProps {
  dispatch: Dispatch;
}

const AuthLayoutProps: React.FC<AuthLayoutProps> = ({ children, dispatch }) => {
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'robots/fetchRobotList',
      });
    }
  }, []);

  return <div>{children}</div>;
};

export default connect((a: ConnectState) => a)(AuthLayoutProps);
