/* eslint-disable no-unused-vars */
import type * as THREE from 'THREE';

export type BlockParsed = {
    sourceGuid?: string,
    props: any
}
export type SceneContext = {
    unityContext: any,
    metaFiles: any[],
    guidMapping: {[key: string]: any},
    filepathMapping: {[key: string]: any},
    fileIdMapping: {[key: string]: any},
    gltfByGuid: {[key: string]: THREE.Group},

    THREE: any,
    cloneGltf: any,
}

export type BlockParser = (
    block: any,
    sceneContext: SceneContext
) => BlockParsed | null

export type UnitySceneBlockParser = {
    isParserType: (block: any, sceneContext?: SceneContext) => boolean,
    parseBlock: BlockParser
}
