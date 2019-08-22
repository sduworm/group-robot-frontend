import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { queryRobotList, setRobot } from '@/services/robots';
import { CardListItemDataType } from '@/pages/robots/data';

export interface StateType {
  list: CardListItemDataType[];
  currentRobot: CardListItemDataType | {};
  editMode: string;
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
    createOrEditRobot: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    setCurrent: Reducer<StateType>;
  };
}

const defaultState = {
  list: [],
  currentRobot: {},
  editMode: 'create',
};

const Robots: ModelType = {
  namespace: 'robots',

  state: defaultState,

  effects: {
    *fetchRobotList(_, { call, put }) {
      const response = yield call(queryRobotList);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *createOrEditRobot({ payload }, { call, put }) {
      const res = yield call(setRobot, payload);
      if (res) {
        yield put({
          type: 'setCurrent',
          payload: {
            currentRobot: payload,
          },
        });
      }
    },
  },

  reducers: {
    queryList(state = defaultState, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    setCurrent(state = defaultState, { payload }) {
      const { currentRobot, editMode = state.editMode } = payload;
      return {
        ...state,
        currentRobot,
        editMode,
      };
    },
  },
};

export default Robots;
