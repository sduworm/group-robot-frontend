import { Form, Input, Button, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { StateType } from '@/models/robots';
import { CardListItemDataType } from '@/pages/robots/data';
import { ROBOT_TYPES, ROBOT_SCHEDULES } from '@/utils/dict';

const { Option } = Select;

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
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('type', {
            initialValue: currentRobot.type || 'ps4.discount.hk',
          })(
            <Select>
              {Object.keys(ROBOT_TYPES).map(type => (
                <Option key={type} value={type}>
                  {ROBOT_TYPES[type]}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="策略">
          {getFieldDecorator('schedule', {
            initialValue: currentRobot.schedule || 'everyday.9',
          })(
            <Select>
              {Object.keys(ROBOT_SCHEDULES).map(type => (
                <Option key={type} value={type}>
                  {ROBOT_SCHEDULES[type]}
                </Option>
              ))}
            </Select>,
          )}
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
