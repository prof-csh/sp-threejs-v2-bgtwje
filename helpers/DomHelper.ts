export const ORIENTATION_LANDSCAPE = "landscape";
export const ORIENTATION_PORTRAIT = "portrait";

import {PromiseHelper} from "./PromiseHelper";

export class DomHelper {

    static isSvgSupported(): boolean {
        return !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
    }

    static isCanvasSupported(): boolean {
        const element = document.createElement("canvas");
        return !!(element.getContext && element.getContext("2d"));
    }

    static isUint8ArraySupported(): boolean {
        return !!(<any>window).Uint8Array;
    }

    static isPdfJsLoaded(): boolean {
        return !!(<any>window).PDFJS;
    }

    static detectOrientation(dimensions): string {
        return dimensions.height > dimensions.width ? ORIENTATION_PORTRAIT : ORIENTATION_LANDSCAPE;
    }

    static loadScript(url: string): Promise<any> {
        const defer = PromiseHelper.defer();

        // can not be done through Dom.element
        const script = document.createElement("script");

        script.onload = defer.resolve;
        script.onerror = defer.reject;

        script.src = url;
        document.body.appendChild(script);

        return defer.promise;
    }

    static loadLink(url: string): Promise<any> {
        const defer = PromiseHelper.defer();

        const node = document.createElement("link");

        node.onload = defer.resolve;
        node.onerror = defer.reject;

        node.rel = "stylesheet";
        node.href = url;

        document.head.appendChild(node);

        return defer.promise;
    }

    /**
     * Load scripts in order
     * Inspired by: http://www.html5rocks.com/en/tutorials/speed/script-loading/
     */
    static loadScriptsInOrder (scripts: string[]): Promise<any> {
        const pendingScripts = [];
        const firstScript = document.scripts[0];
        const promises = [];
        let src;
        // loop through our script urls
        while (src = scripts.shift()) {
            promises.push(loadScript(src));
        }

        return Promise.all(promises);

        /**
         * Load script, resolve Promise when loaded
         * @param  {String} src
         * @return {Promise}
         */
        function loadScript(src) {
            const defer = PromiseHelper.defer();
            const script = document.createElement("script");
            // modern browsers
            if ("async" in firstScript) {
                script.type = "text/javascript";
                script.async = false;
                script.src = src;
                script.addEventListener('load', () => {
                    prune(src);
                    defer.resolve();
                });
                script.addEventListener('error', () => {
                    prune(src);
                    defer.reject();
                });
                document.head.appendChild(script);
                return defer.promise;
            }
            else if ( (<any>firstScript).readyState) { // IE<10
                pendingScripts.push(script);
                // listen for state changes
                (<any>script).onreadystatechange = stateChange;
                // must set src AFTER adding onreadystatechange listener
                // else we’ll miss the loaded event for cached scripts
                script.src = src;
                script.type = "text/javascript";

                return defer.promise;
            }
            else { // fall back to defer
                script.type = "text/javascript";
                script.defer = true;
                document.head.appendChild(script);
            }

            // Watch scripts load in IE
            function stateChange() {
                // Execute as many scripts in order as we can
                let pendingScript;
                if ((<any>script).readyState === "loaded") {
                    defer.resolve();
                }
                while (pendingScripts[0] && pendingScripts[0].readyState === "loaded") {
                    pendingScript = pendingScripts.shift();
                    // avoid future loading events from this script (eg, if src changes)
                    pendingScript.onreadystatechange = null;
                    // can"t just appendChild, old IE bug if element isn"t closed
                    firstScript.parentNode.insertBefore(pendingScript, firstScript);
                }
            }
        }

        function prune(src: string): void {
            const scripts = document.querySelectorAll(`script[src="${src}"]`);
            for(let i=scripts.length-1; i>0; i--) {
                const script = scripts[i];
                script.parentNode.removeChild(script);
            }
        }
    }

    static isSafari(): boolean {
        return navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1;
    }

    static isUIWebView(): boolean {
        return navigator.userAgent.indexOf("Mobile") !== -1 && navigator.userAgent.indexOf("AppleWebKit") !== -1;
    }

    static isIe(version: number): boolean {
        const myNav = window.navigator.userAgent.toLowerCase();
        // ie? version?
        if (myNav.indexOf("msie") !== -1) {
            return (!version) ? true : parseInt(myNav.split("msie")[1]) === version;
        }
        return false;
    }

    static insertCss(css) {
        const styleElement = document.createElement("style");
        const cssTextNode = document.createTextNode(css);
        try {
            styleElement.setAttribute("type", "text/css");
            styleElement.appendChild(cssTextNode);
        } catch (err) {
            // IE < 9
        }
        document.getElementsByTagName("head")[0].appendChild(styleElement);
        return styleElement;
    }

    static getQueryParams() {
        const regex = /[?&]([^=#]+)=([^&#]*)/g;
        const url = window.location.href;
        const params = {};
        let match;
        while (match = regex.exec(url)) {
            const valueAsInt = parseInt(match[2]);
            const value = isNaN(valueAsInt) ? match[2] : valueAsInt;
            params[match[1]] = value;
        }
        return params;
    }
}
