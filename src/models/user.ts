import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';

export interface UserModelState {
  currentUser?: any;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const defaultState = {
  currentUser: {},
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: defaultState,

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state = defaultState, { payload }) {
      const user = payload;
      if (user && user.id) {
        setAuthority('user');
        console.log('SaveCurrentUser', user);
        return {
          ...state,
          currentUser: user || {},
        };
      }
      return state;
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
