import { Injectable } from '@angular/core';

// a closure variable used to call the Dojo require() function
// once we load the ArcGIS API for JavaScript on the page
let dojoRequire;

@Injectable()
export class EsriLoaderService {

  constructor() { }

  isLoaded() {
    // would like to just use window.require, but fucking typescript
    return typeof window['require'] !== 'undefined';
  }

  init(callback: Function, options?: Object) {
    const opts = Object.assign({
      // defalut to latest version of the ArcGIS API for JavaScript
      url: window.location.protocol + '//js.arcgis.com/4.1'
    }, options);

    // don't reload API if it is already loaded
    if (this.isLoaded()) {
      callback(new Error('The ArcGIS API for JavaScript is already loaded.'));
      return;
    }

    // create a script object whose source points to the API
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = opts.url;

    // once the script is loaded...
    script.onload = () => {
      // we can now use Dojo's require() to load esri and dojo AMD modules
      dojoRequire = window['require'];

      // let the caller know that the API has been successfully loaded
      // and as a convenience, return the require function 
      // in case they want to use it directly
      callback(null, dojoRequire);
    };

    // load the script
    document.body.appendChild(script);
  }

  // a thin wrapper around Dojo's require()
  require(modules: string[], callback: Function) {
    if (!this.isLoaded()) {
      throw new Error('The ArcGIS API for JavaScript has not been loaded. You must first call init()');
    } else {
      dojoRequire(modules, callback);
    }
  }
}
