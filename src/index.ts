import { Plugin } from '@hookstate/core';
import { parse, serialize } from 'cookie';

const pluginId = Symbol('hookstate-cookies');
const CookiePersistence = (key: string) => (): Plugin => ({
  id: pluginId,
  init: (state) => {
    const persisted = parse(document.cookie)[key];
    if (persisted) {
      state.set(JSON.parse(persisted));
    } else if (!state.promised && !state.error) {
      document.cookie = serialize(key, JSON.stringify(state.value), {
        expires: new Date(Date.now() + 9e10 * 1000),
      });
    }
    return {
      onSet: function (p) {
        if ('state' in p) {
          document.cookie = serialize(key, JSON.stringify(state.value), {
            expires: new Date(Date.now() + 9e10 * 1000),
          });
        } else {
          document.cookie = serialize(key, '', {
            expires: new Date(0),
          });
        }
      },
    };
  },
});

export default CookiePersistence;
