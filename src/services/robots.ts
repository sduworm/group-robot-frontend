import request from 'umi-request';

export async function queryRobotList() {
  return request('/api/robot_list');
}

export async function setRobot(robot: any) {
  return request('/api/robot', {
    method: 'POST',
    body: JSON.stringify(robot),
    headers: { 'Content-type': 'application/json' },
  });
}
