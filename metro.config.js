const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

config.watchFolders = config.watchFolders || [];
config.resolver.blacklistRE = /(.*\/.cxx\/.*|.*\/\.gradle\/.*|.*\/build\/.*|.*\/CMakeFiles\/.*)/;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'event-target-shim') {
    try {
        return context.resolveRequest(context, 'event-target-shim', platform);
    } catch (e) {
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
