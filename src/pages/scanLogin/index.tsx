import { Alert, Checkbox, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

interface ScanLoginProps {
  dispatch: Dispatch<any>;
  scanLogin: StateType;
  submitting: boolean;
}

interface ScanLoginState {
  type: string;
  autoLogin: boolean;
}

export interface FromDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

@connect(
  ({
    scanLogin,
    loading,
  }: {
    scanLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    scanLogin,
    submitting: loading.effects['scanLogin/login'],
  }),
)
class ScanLogin extends Component<ScanLoginProps, ScanLoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: ScanLoginState = {
    type: 'account',
    autoLogin: true,
  };

  componentDidMount(): void {
    // eslint-disable-next-line no-undef
    const ddObj = DDLogin({
      id: 'dingtalkQr',
      goto: encodeURIComponent(
        `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${'dingoabqpoeoug7fyy46z8'}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${'www.baidu.com'}`,
      ),
      style: 'border:none;background-color:#FFFFFF;',
      width: '365',
      height: '400',
    });

    const handleMessage = (event: { origin: string; data: string }) => {
      if (event.origin === 'https://login.dingtalk.com') {
        window.location.replace(`${decodeURIComponent(ddObj.goto)}&loginTmpCode=${event.data}`);
      }
    };
    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', handleMessage, false);
    } else if (typeof window.attachEvent !== 'undefined') {
      window.attachEvent('onmessage', handleMessage);
    }
  }

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: any, values: FromDataType) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'scanLogin/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }
      this.loginForm.validateFields(['mobile'], {}, (err: any, values: FromDataType) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          ((dispatch({
            type: 'scanLogin/getCaptcha',
            payload: values.mobile,
          }) as unknown) as Promise<any>)
            .then(resolve)
            .catch(reject);
        }
      });
    });

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { scanLogin, submitting } = this.props;
    const { status, type: loginType } = scanLogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <div id="dingtalkQr" />
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'scanlogin.login.tab-login-credentials' })}>
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'scanlogin.login.message-invalid-credentials' }),
              )}
            <UserName
              name="userName"
              placeholder={`${formatMessage({ id: 'scanlogin.login.userName' })}: admin or user`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'scanlogin.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'scanlogin.login.password' })}: ant.design`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'scanlogin.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <Tab key="mobile" tab={formatMessage({ id: 'scanlogin.login.tab-login-mobile' })}>
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'scanlogin.login.message-invalid-verification-code' }),
              )}
            <Mobile
              name="mobile"
              placeholder={formatMessage({ id: 'scanlogin.phone-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'scanlogin.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'scanlogin.phone-number.wrong-format' }),
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={formatMessage({ id: 'scanlogin.verification-code.placeholder' })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({ id: 'scanlogin.form.get-captcha' })}
              getCaptchaSecondText={formatMessage({ id: 'scanlogin.captcha.second' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'scanlogin.verification-code.required' }),
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="scanlogin.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="scanlogin.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="scanlogin.login.login" />
          </Submit>
          <div className={styles.other}>
            <FormattedMessage id="scanlogin.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="scanlogin.login.signup" />
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default ScanLogin;
