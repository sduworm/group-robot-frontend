import { Button, Card, Icon, List, Typography } from 'antd';
import React, { Component } from 'react';
import router from 'umi/router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '@/models/robots';
import { CardListItemDataType } from './data.d';
import styles from './style.less';

const { Paragraph } = Typography;

interface RobotsProps {
  robots: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface RobotsState {
  visible: boolean;
  done: boolean;
  current?: Partial<CardListItemDataType>;
}

@connect(
  ({
    robots,
    loading,
  }: {
    robots: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    robots,
    loading: loading.models.list,
  }),
)
class Robots extends Component<RobotsProps, RobotsState> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'robots/fetch',
      payload: {
        count: 8,
      },
    });
  }

  onClickEdit(id: any, editMode: string) {
    const {
      robots: { list },
      dispatch,
    } = this.props;

    dispatch({
      type: 'robots/setCurrent',
      payload: {
        editMode,
        currentRobot: editMode === 'create' ? {} : list.find(item => item.id === id),
      },
    });

    router.push('/editRobot');
  }

  render() {
    const {
      robots: { list },
      loading,
    } = this.props;

    const nullData: Partial<CardListItemDataType> = {};
    return (
      <div className={styles.cardList}>
        <List<Partial<CardListItemDataType>>
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={[nullData, ...list]}
          renderItem={item => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <a key="option1" onClick={() => this.onClickEdit(item.id, 'edit')}>
                        操作一
                      </a>,
                      <a key="option2">操作二</a>,
                    ]}
                  >
                    <Card.Meta
                      title={<a>{item.name}</a>}
                      description={
                        <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {item.webhook}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item>
                <Button
                  type="dashed"
                  className={styles.newButton}
                  onClick={() => this.onClickEdit(item.id, 'create')}
                >
                  <Icon type="plus" /> 新增
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
}

export default Robots;
