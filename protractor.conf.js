export const config = {
    framework: 'jasmine',
    specs: ['./e2e/**/*.e2e-spec.ts'], 
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    capabilities: {
      browserName: 'chrome',
    },
  };
  