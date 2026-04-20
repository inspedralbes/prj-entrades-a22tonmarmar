jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/',
  }),
  createRouter: () => ({
    install: jest.fn(),
  }),
  createWebHistory: () => jest.fn(),
}));

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

global.window = global.window || {};
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.navigator = global.navigator || {
  userAgent: 'node',
};