process.env.NODE_ENV = 'test';
import {defaultReporter} from '@web/test-runner';
import {default as specReporter} from './spec-reporter.js';

export default {
  reporters: [
    defaultReporter({reportTestResults: true, reportTestProgress: true}),
    specReporter(),
  ],
};
