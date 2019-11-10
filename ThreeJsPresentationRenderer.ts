import {
  ThreeJsDAELoader as DAELoader,
  ThreeJsOBJLoader as OBJLoader,
  ThreeJsFBXLoader as FBXLoader
} from "./ThreeJsModelLoaders";
import { ThreeJsModelRenderer as ModelRenderer } from "./ThreeJsModelRenderer";

import { Manifest } from "./types/Manifest.type";
import { PromiseHelper } from "./helpers/PromiseHelper";
import { mapRange } from './utils/Math';

export class ThreeJsPresentationRenderer {
  container: HTMLElement | null = null;
  content: HTMLElement | null = null;
  modelContainer: HTMLElement = null;

  manifest: Manifest = null;
  buttonView: ButtonView = null;
  loadingIndicator: LoadingIndicator = null;

  modelLoader: DAELoader | OBJLoader | FBXLoader;
  modelRenderer: ModelRenderer;

  isLoading = false;
  isActive = false;

  constructor(public assetViewerView: any, public presentation: any) {
    this.onButtonViewClickHandler = this.onButtonViewClickHandler.bind(this);
    this.onModelLoaderProgess = this.onModelLoaderProgess.bind(this);
    this.onModelLoaderLoaded = this.onModelLoaderLoaded.bind(this);
    this.onModelLoaderError = this.onModelLoaderError.bind(this);
  }

  get url() {
    return this.assetViewerView.assetViewerItem.previewUrl;
  }

  // to confirm
  get manifestJsonUrl(): string {
    return this.presentation.urls[0];
  }

  load(): Promise<any> {
    this.isLoading = true;
    return this.loadManifest()
      .then((manifest) => {
        this.manifest = manifest as Manifest;
      });
  }

  // Check for ie also add this to helper perhaps?..
  loadManifest(): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('get', this.manifestJsonUrl, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        var status = xhr.status;
        if (status == 200) {
          resolve(xhr.response);
        } else {
          reject(status);
        }
      };
      xhr.send();
    });
  }

  render(container: HTMLElement): Promise<any> {
    this.container = container;
    return Promise.resolve().then(() => {

      this.content = document.createElement("div");
      this.content.style.backgroundImage = `url('${this.url}')`;
      this.content.style.backgroundSize = `contain`;
      this.content.style.backgroundRepeat = `no-repeat`;
      this.content.style.backgroundPosition = `center`;
      this.content.style.width = "100%";
      this.content.style.height = "100%";

      this.renderButtonView();

      container.appendChild(this.content);
    });
  }

  renderButtonView(): void {
    this.buttonView = new ButtonView(this.content);
    this.buttonView.htmlElement.onclick = this.onButtonViewClickHandler;
  }

  onButtonViewClickHandler(): void {
    this.buttonView.destroy();

    this.loadingIndicator = new LoadingIndicator(this.content);
    this.loadingIndicator.onAnimationComplete = () => {
      this.loadingIndicator.destroy();
    }
    this.loadingIndicator.update('indeterminate', 25);

    // Load javascript deps....

    // This will change depending on type......

    try {

      this.modelLoader = new DAELoader();
      this.modelLoader.onProgress = this.onModelLoaderProgess;
      this.modelLoader.onLoaded = this.onModelLoaderLoaded;
      this.modelLoader.onError = this.onModelLoaderError;
      this.modelLoader.load(this.manifest.model);
    }
    catch (error) {
      console.log(error);
    }
  }

  onModelLoaderProgess(percent: number): void {
    this.loadingIndicator.update('determinate', mapRange(percent, 0, 100, 25, 100));
  }

  onModelLoaderLoaded(model: any): void {
    this.modelContainer = document.createElement("div");
    this.modelContainer.className = 'sv-model-container';
    this.content.appendChild(this.modelContainer);
    this.modelRenderer = new ModelRenderer();
    this.modelRenderer.render(this.modelContainer, model);
  }

  onModelLoaderError(error: any): void {
  }

  destroy(): void {
    if (this.container) {
      this.container.innerHTML = "";
      this.container = null;
    }
  }

  destroyFinal(): void {
    this.destroy();
  }
}

class ButtonView {
  htmlElement: HTMLElement = null;
  constructor(container: HTMLElement) {
    this.htmlElement = document.createElement("button");
    this.htmlElement.className = 'sv-button-view';
    container.appendChild(this.htmlElement);
    this.render();
  }

  render(): void {
    this.htmlElement.innerHTML =
      `<div class="sv-button-view__container"><svg width="20" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M12 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0c0 .79-.43.97-1.903 2.38C15.36 11 13.014 11.994 10 12c-3.014-.006-5.361-1-8.097-3.62C.43 6.97 0 6.79 0 6c0-.79.43-.97 1.903-2.38C4.64 1 6.986.006 10 0c3.014.006 5.361 1 8.097 3.62C19.57 5.03 20 5.21 20 6zm-6 .5C14 4.015 12.21 2 10 2S6 4.015 6 6.5 7.79 11 10 11s4-2.015 4-4.5z" fill="#4D4D4D" fill-rule="evenodd"/></svg><span>View 3D object</span></div>`;
  }

  destroy(): void {
    this.htmlElement.parentNode.removeChild(this.htmlElement)
  }
}

class LoadingIndicator {
  htmlElement: HTMLElement = null;
  status: 'indeterminate' | 'determinate' = 'indeterminate';
  size: number = 26;
  strokeWidth: number = 4;
  radius: number = null;
  dashArray: number = null;
  percent: number = null;

  onAnimationComplete: Function = null;

  constructor(container: HTMLElement) {
    this.onTransitionEndHandler = this.onTransitionEndHandler.bind(this);
    this.htmlElement = document.createElement("div");
    this.htmlElement.className = 'sv-loading-indicator';
    this.radius = (this.size / 2) - (this.strokeWidth / 2)
    this.dashArray = 2 * Math.PI * this.radius;
    container.appendChild(this.htmlElement);
    this.htmlElement.addEventListener('transitionend', this.onTransitionEndHandler);
    this.render();
  }

  render(): void {
    this.htmlElement.innerHTML =
      `<svg data-scope="progress" 
          class="progress progress--${this.status}" 
          width="${this.size}" 
          height="${this.size}" 
          viewBox="0 0 ${this.size} ${this.size}">
          <circle 
            cx="${this.size / 2}" 
            cy="${this.size / 2}" 
            r="${this.radius}" 
            fill="none" 
            stroke="#5f6061" 
            stroke-width="${this.strokeWidth}" 
          />
          <circle 
            class="progress__indeterminate"
            data-scope="progressValue"
            cx="${this.size / 2}" 
            cy="${this.size / 2}"
            r="${this.radius}" 
            fill="none" 
            stroke="#00bb8b" 
            stroke-width="${this.strokeWidth}" 
            stroke-dasharray="${this.dashArray}"
            stroke-dashoffset="${this.dashArray}"
          />
          <circle 
            class="progress__determinate"
            data-scope="progressValue"
            cx="${this.size / 2}" 
            cy="${this.size / 2}" 
            r="${this.radius}" 
            fill="none"
            stroke="#00bb8b"
            stroke-width="${this.strokeWidth}"
            stroke-dasharray="${this.dashArray}"
            stroke-dashoffset="${this.dashArray}"
          />
        </svg>
        <span>Loading 3D object</span>`;
  }

  onTransitionEndHandler(event: TransitionEvent): void {
    if (event.propertyName === 'stroke-dashoffset' && this.percent === 100 && this.onAnimationComplete) {
      this.onAnimationComplete();
    }
  }

  update(status: string, percent: number = null): void {
    this.percent = percent;

    const progressHtmlElement = (this.htmlElement.querySelector(`[data-scope='progress']`) as SVGSVGElement);
    progressHtmlElement.className.baseVal = `progress progress--${status}`;

    const strokeDashoffset = mapRange(this.percent, 0, 100, this.dashArray, 0);
    const progressValues = this.htmlElement.querySelectorAll(`[data-scope='progressValue']`) as NodeListOf<HTMLElement>;
    for (let i = 0; i < progressValues.length; i++) {
      progressValues[i].style.strokeDashoffset = String(strokeDashoffset);
    }
  }

  destroy(): void {
    this.htmlElement.parentNode.removeChild(this.htmlElement)
  }
}