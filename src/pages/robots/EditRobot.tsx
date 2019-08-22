import { Form, Input, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '@/models/robots';
import { CardListItemDataType } from '@/pages/robots/data';

interface RobotProps {
  robots: { currentRobot: CardListItemDataType };
  dispatch: Dispatch<any>;
  form: any;
}

@connect(({ robots }: { robots: StateType }) => ({
  robots,
}))
class EditRobotForm extends Component<RobotProps> {
  handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const {
          robots: { currentRobot },
          dispatch,
        } = this.props;

        dispatch({
          type: 'robots/createOrEditRobot',
          payload: { ...currentRobot, ...values },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      robots: { currentRobot },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            initialValue: currentRobot.name,
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Webhook">
          {getFieldDecorator('webhook', {
            initialValue: currentRobot.webhook,
            rules: [
              {
                required: true,
                message: '请输入Webhook',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({ name: 'editRobot' })(EditRobotForm);
