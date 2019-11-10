export interface ThreeJsModelLoader {
    model: any;
    onProgress: Function;
    onLoaded: Function;
    onError: Function;
    load(url: string): any;
    destroy(): void;
}