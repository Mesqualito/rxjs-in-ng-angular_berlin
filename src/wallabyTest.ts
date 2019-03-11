/* tslint:disable:ordered-imports file-name-casing */
import './polyfills';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone-testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { ElementRef, OnInit } from '@angular/core';
import { EMLINK } from 'constants';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

