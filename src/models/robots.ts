import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { queryRobotList } from '@/services/robots';

export interface StateType {
  list: any[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchRobotList: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Robots: ModelType = {
  namespace: 'robots',

  state: {
    list: [],
  },

  effects: {
    *fetchRobotList(_, { call, put }) {
      const response = yield call(queryRobotList);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

export default Robots;
