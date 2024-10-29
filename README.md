![](https://i.imgur.com/oaig6Au.gif)

# SSOReady Example App: Next.js + NextAuth with SAML

This repo contains a minimal example app built with Next.js and NextAuth that
supports [SAML](https://ssoready.com/docs/saml/saml-quickstart) using
[SSOReady](https://ssoready.com/), an open-source way to add SAML and SCIM
support to your product.

## Running it yourself

To check out this repo yourself, you'll need a working installation of Node.
Then, run:

```
git clone https://github.com/ssoready-example-app-nextjs-nextauth-saml
cd ssoready-example-app-nextjs-nextauth-saml

npm install
npm run dev
```

Then, visit http://localhost:3000.

## How it works

SSOReady can act as a NextAuth
[provider](https://next-auth.js.org/v3/configuration/providers), a lot like how
you'd add support for "Log in with Google" or "Log in with GitHub".

The result is that there's two steps involved in implementing SAML:

1. Adding SSOReady as a NextAuth provider
2. Calling NextAuth's `signIn` with the `ssoready-saml` provider.

The rest is handled by SSOReady and NextAuth for you.

### Adding SSOReady as a NextAuth provider

In this demo app, NextAuth is configured at
[`pages/api/auth/[...nextauth].js`](/pages/api/auth/[...nextauth.js]):

```js
import NextAuth from "next-auth";

export const authOptions = {
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
```

`SSOREADY_CLIENT_ID` and `SSOREADY_CLIENT_SECRET` are configured in
[`.dev.local`](/.dev.local).

### Calling `signIn` with the `ssoready-saml` provider

The demo app logs a user in with SAML by calling NextAuth's `signIn` with the
`ssoready-saml` provider and an `organizationExternalId`:

```js
// This state also controls the email <input> next to the "Log in with SAML" button.
const [email, setEmail] = useState("john.doe@example.com");

// The handler for the "Log in with SAML" button.
const onLogInWithSAML = () => {
  signIn("ssoready-saml", undefined, {
    // convert "john.doe@example.com" into "example.com"
    organizationExternalId: email.split("@")[1],
  });
};
```

Every customer's SAML servers live on a different URL, so you need to know which
customer is trying to log in with SAML in order to sign in. That's what
`organizationExternalId` does.

### Configuring SSOReady

To make this demo app work out of the box, we did some work for you. You'll need
to follow these steps yourself when you integrate SAML into your app.

The steps we took were:

1. We signed up for SSOReady at https://app.ssoready.com.
2. We created an
   [environment](https://ssoready.com/docs/ssoready-concepts/environments), and
   configured its [redirect
   URL](https://ssoready.com/docs/ssoready-concepts/environments#redirect-url)
   to be `http://localhost:3000/ssoready-callback`.
3. We created a [SAML OAuth
   Client](https://ssoready.com/docs/saml-over-oauth-saml-nextauth-integration#creating-saml-oauth-clients).
   Because this is a demo app, we hard-coded it into `.dev.local`. In
   production, make sure to keep `SSOREADY_CLIENT_SECRET` a secret.
4. We created two
   [organizations](https://ssoready.com/docs/ssoready-concepts/organizations),
   both of which use [DummyIDP.com](https://ssoready.com/docs/dummyidp) as their
   "corporate" identity provider:

   - One organization has [external
     ID](https://ssoready.com/docs/ssoready-concepts/organizations#organization-external-id)
     `example.com` and a [domain
     whitelist](https://ssoready.com/docs/ssoready-concepts/organizations#domains)
     of just `example.com`.
   - The second organization has extnernal ID `example.org` and domain whitelist
     `example.org`.

In production, you'll create a separate organization for each company that wants
SAML. Your customers won't be using [DummyIDP.com](https://dummyidp.com); that's
just a SAML testing service that SSOReady offers for free. Your customers will
instead be using vendors including
[Okta](https://www.okta.com/products/single-sign-on-customer-identity/),
[Microsoft
Entra](https://www.microsoft.com/en-us/security/business/microsoft-entra), and
[Google Workspace](https://workspace.google.com/). From your code's perspective,
those vendors will all look exactly the same.

## Next steps

This demo app gives you a crash-course demo of how to implement SAML end-to-end.
If you want to see how this all fits together in greater detail, with every step
described in greater detail, check out the [SAML NextAuth.js integration
docs](https://ssoready.com/docs/saml-over-oauth-saml-nextauth-integration) or
the rest of the [SSOReady docs](https://ssoready.com/docs).
