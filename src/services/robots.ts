import request from 'umi-request';

export async function queryRobotList() {
  return request('/api/robot_list');
}
