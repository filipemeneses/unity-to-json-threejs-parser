import { defineConfig } from 'vite'
import fs from 'fs'
import { unitySyncPlugin } from './vite/unityThreejs'

/** @type {import('vite').Plugin} */
const hexLoader = {
    name: 'hex-loader',
    transform(code, id) {
        const [path, query] = id.split('?');
        if (query != 'raw-hex')
            return null;

        const data = fs.readFileSync(path);
        const hex = data.toString('base64');

        return `export default '${hex}';`;
    }
};

const fullReloadAlways = {
  name: 'fullReloadAlways',
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: './example/index.html', // default
      },
    },
  },
  plugins: [
    hexLoader,
    fullReloadAlways,
    unitySyncPlugin
  ],
  assetsInclude: [
    "**/*.fbx"
  ],
  server: {
    open: './example/index.html',
    watch: {
      ignored: ["**/unity/**"],
    },
  },
})
