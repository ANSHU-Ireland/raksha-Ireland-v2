// Mock RNEdgeToEdge module to prevent crash
const RNEdgeToEdge = {
  setStatusBarStyle: () => {},
  setNavigationBarStyle: () => {},
  setBackgroundColor: () => {},
  setSystemUIOverlayStyle: () => {},
  getSystemUIOverlayStyle: () => ({}),
  isAvailable: () => false,
};

module.exports = RNEdgeToEdge;