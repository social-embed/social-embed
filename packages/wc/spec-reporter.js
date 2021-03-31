// Credit: @crisward: https://github.com/modernweb-dev/web/issues/229#issuecomment-732005741
const colour = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  dim: '\x1b[2m',
  yellow: '\x1b[33m',
};

function outputSuite(suite, indent = '') {
  let results = `${indent}${suite.name}\n`;
  results +=
    suite.tests
      .map((test) => {
        let result = indent;
        if (test.skipped) {
          result += `${colour.cyan} - ${test.name}`;
        } else if (test.passed) {
          result += `${colour.green} ✓ ${colour.reset}${colour.dim}${test.name}`;
        } else {
          result += `${colour.red} ${test.name}`;
        }
        result +=
          test.duration > 100
            ? ` ${colour.reset}${colour.red}(${test.duration}ms)`
            : test.duration > 50
            ? ` ${colour.reset}${colour.yellow}(${test.duration}ms)`
            : ``;
        result += `${colour.reset}`;

        return result;
      })
      .join('\n') + '\n';
  if (suite.suites)
    results += suite.suites
      .map((suite) => outputSuite(suite, indent + '  '))
      .join('\n');
  return results;
}

async function generateTestReport(testFile, sessionsForTestFile) {
  let results = '';
  sessionsForTestFile.forEach((session) => {
    results += session.testResults.suites
      .map((suite) => outputSuite(suite, ''))
      .join('\n\n');
  });
  return results;
}

export default function specReporter({
  reportResults = true,
  reportProgress = true,
} = {}) {
  return {
    onTestRunFinished({testRun, sessions, testCoverage, focusedTestFile}) {},
    async reportTestFileResults({logger, sessionsForTestFile, testFile}) {
      if (!reportResults) {
        return;
      }
      const testReport = await generateTestReport(
        testFile,
        sessionsForTestFile
      );

      logger.group();
      console.log(testReport);
      // For some reason this doesn't work
      // logger.log(testReport);
      logger.groupEnd();
    },
  };
}
