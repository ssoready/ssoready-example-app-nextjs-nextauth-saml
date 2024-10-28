import NextAuth from "next-auth";

export const authOptions = {
  // see: https://ssoready.com/docs/saml-over-oauth-saml-nextauth-integration#code-implementation-for-nextauthjs
  providers: [
    {
      id: "ssoready-saml",
      name: "SSOReady SAML",
      type: "oauth",
      wellKnown:
        "https://auth.ssoready.com/v1/oauth/.well-known/openid-configuration",
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.sub,
          organizationId: profile.organizationId,
          organizationExternalId: profile.organizationExternalId,
        };
      },
      clientId: process.env.SSOREADY_CLIENT_ID,
      clientSecret: process.env.SSOREADY_CLIENT_SECRET,
    },
  ],
};

export default NextAuth(authOptions);
