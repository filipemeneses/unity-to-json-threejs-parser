# unity-to-json-threejs-parser

Node.js and browser package to parser [unity-to-json](https://github.com/filipemeneses/unity-to-json) files into THREE.js instances

---

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]


## Install

```bash
npm install unity-to-json-threejs-parser
```

```bash
yarn add unity-to-json-threejs-parser
```

## Usage

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import unityScene from './unity-scene.json'; // generated using unity-to-json

const parseUnityJsonToThreejs = createUnityJsonToThreeJsParser({
    THREE,
    GLTFLoader
});
const instances = await parseUnityJsonToThreejs(unityScene);

instance.forEach(threejsItem => {
    if (threejsItem instanceof THREE.Group) {
        // add to scene
        // scene.add(threeJsGroup)
    }
})
```



[build-img]:https://github.com/filipemeneses/unity-to-json-threejs-parser/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/filipemeneses/unity-to-json-threejs-parser/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/unity-to-json-threejs-parser
[npm-img]:https://img.shields.io/npm/v/unity-to-json-threejs-parser
[npm-url]:https://www.npmjs.com/package/unity-to-json-threejs-parser
[issues-img]:https://img.shields.io/github/issues/filipemeneses/unity-to-json-threejs-parser
[issues-url]:https://github.com/filipemeneses/unity-to-json-threejs-parser/issues
[codecov-img]:https://codecov.io/gh/filipemeneses/unity-to-json-threejs-parser/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/filipemeneses/unity-to-json-threejs-parser
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
