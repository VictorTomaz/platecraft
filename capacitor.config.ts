import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.platecraft.app',
  appName: 'platecraft',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: false
    }
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
