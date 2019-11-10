import { ThreeJsModelLoader } from "./types/ThreeJsModelLoader.type";
import { mapRange } from './utils/Math';

export class ThreeJsDAELoader implements ThreeJsModelLoader {
  model: any = null;
  onProgress: Function = null;
  onLoaded: Function = null;
  onError: Function = null;
  
  loadingManager: any;
  colladaUrl: string;
  colladaLoader: any;
  collada: any;
  tgaLoader: any;

  constructor() {
    this.loadingManagerOnLoad = this.loadingManagerOnLoad.bind(this);
    this.loadingManagerOnProgress = this.loadingManagerOnProgress.bind(this);
    this.loadingManagerOnError = this.loadingManagerOnError.bind(this);
    this.colladaLoaderOnLoad = this.colladaLoaderOnLoad.bind(this);
    this.colladaLoaderOnProgress = this.colladaLoaderOnProgress.bind(this);
    this.colladaLoaderOnError = this.colladaLoaderOnError.bind(this);
  }

  load(url: string): void {
    this.colladaUrl = url;
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onLoad = this.loadingManagerOnLoad;
    this.loadingManager.onProgress = this.loadingManagerOnProgress;
    this.loadingManager.onError = this.loadingManagerOnError;

    // If we tga => png
    /*
    this.loadingManager.setURLModifier((url) => {
      const replaced = url.replace('.tga', '.png');
      return replaced;
    });
    */

    this.colladaLoader = new THREE.ColladaLoader(this.loadingManager);
    this.colladaLoader.load(url, this.colladaLoaderOnLoad, this.colladaLoaderOnProgress, this.colladaLoaderOnError);
  }

  loadingManagerOnLoad(): void {
    this.onLoaded(this.collada.scene);
  }

  loadingManagerOnProgress(url: string, itemsLoaded: number, itemsTotal: number): void {
    const percentComplete = (itemsLoaded-1) / (itemsTotal-1) * 100;
    this.onProgress(mapRange(percentComplete, 0, 100, 50, 100));
  }

  loadingManagerOnError(): void {
    console.log('arse');
    this.onError();
  }

  colladaLoaderOnLoad(collada: any): void {
    this.collada = collada;
  }

  colladaLoaderOnProgress(xhr: ProgressEvent): void {
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      this.onProgress(mapRange(percentComplete, 0, 100, 0, 50));
    }
  }

  colladaLoaderOnError(): void {
  }

  destroy(): void { }
}

export class ThreeJsOBJLoader implements ThreeJsModelLoader {
  model: any = null;
  onProgress: Function = null;
  onLoaded: Function = null;
  onError: Function = null;
  constructor() { }
  load(url: string): void { }
  destroy(): void { }
}

export class ThreeJsFBXLoader implements ThreeJsModelLoader {
  onProgress: Function = null;
  onLoaded: Function = null;
  onError: Function = null;
  constructor() { }
  load(url: string) { }
  destroy(): void { }
}