import React, { Component } from 'react';
import styles from './style.less';

class ScanLogin extends Component {
  componentDidMount(): void {
    // eslint-disable-next-line no-undef
    const ddObj = {
      id: 'dingtalkQr',
      goto: encodeURIComponent(
        `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${'dingoabqpoeoug7fyy46z8'}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${'http://localhost:5050/user/ddLogin'}`,
      ),
      style: 'border:none;background-color:#FFFFFF;',
      width: '365',
      height: '400',
    };
    DDLogin(ddObj);

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

  render() {
    return (
      <div className={styles.main}>
        <div id="dingtalkQr" />
      </div>
    );
  }
}

export default ScanLogin;
