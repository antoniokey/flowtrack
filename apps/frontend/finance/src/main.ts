import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { Router } from '@angular/router';

import { appConfig } from './app/app.config';
import { App } from './app/app';

const ELEMENT_NAME = 'finance-app';

createApplication(appConfig)
  .then((appRef) => {
    if (!customElements.get(ELEMENT_NAME)) {
      customElements.define(ELEMENT_NAME, createCustomElement(App, { injector: appRef.injector }));
    }

    appRef.injector.get(Router).initialNavigation();
  })
  .catch((err) => console.error(err));
