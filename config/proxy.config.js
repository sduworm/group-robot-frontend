export const mockConf = {
  exclude: ['mock/user.ts'],
};

export const proxy = {
  '/api': {
    target: 'http://localhost:5050/',
    changeOrigin: true,
  },
};
