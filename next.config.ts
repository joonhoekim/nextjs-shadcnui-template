import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  turbopack: {
    // oracledb 라이브러리의 문제 해결을 위한 설정 (선택적 require이나 없으면 오류를 발생시키는 번들러측 문제)
    resolveAlias: {
      '@azure/app-configuration': 'data:text/javascript,export default {};',
      '@azure/identity': 'data:text/javascript,export default {};',
      '@azure/keyvault-secrets': 'data:text/javascript,export default {};',
      'oci-common': 'data:text/javascript,export default {};',
      'oci-objectstorage': 'data:text/javascript,export default {};',
      'oci-secrets': 'data:text/javascript,export default {};',
    },
  },

  webpack: config => {
    /**
     * oracledb 라이브러리의 문제 해결을 위한 설정 (선택적 require이나 없으면 오류를 발생시키는 번들러측 문제)
     * These packages need to be added as external, else Oracle DB will try to load them due to a
     * Webpack bug.
     *
     * See these two issues for more information:
     * - https://github.com/oracle/node-oracledb/issues/1688
     * - https://github.com/oracle/node-oracledb/issues/1691
     **/
    config.externals.push(
      ...[
        "@azure/app-configuration",
        "@azure/identity",
        "@azure/keyvault-secrets",
        "oci-common",
        "oci-objectstorage",
        "oci-secrets",
      ],
    )

    return config
  },

};

export default nextConfig;
