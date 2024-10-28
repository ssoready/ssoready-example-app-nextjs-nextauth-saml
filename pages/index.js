import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("john.doe@example.com");

  // This is the handler called when users click "Log in with SAML".
  const onLogInWithSAML = () => {
    // To start a SAML login, you need to use NextAuth's `signIn` method with
    // the `ssoready-saml` provider (defined in
    // pages/api/auth/[...nextauth].js).
    //
    // Every company uses a different SAML identity provider, so you need to
    // indicate which company's identity provider you want to use. You do so
    // using `organizationExternalId`.
    signIn("ssoready-saml", undefined, {
      // convert "john.doe@example.com" into "example.com"
      organizationExternalId: email.split("@")[1],
    });
  };

  // This is the handler called with users click "Sign out".
  const onSignOut = () => {
    signOut();
  };

  return (
    <>
      <Head>
        <title>SAML Demo App using SSOReady</title>
        <script src="https://cdn.tailwindcss.com" />
      </Head>

      <main className="grid min-h-screen place-items-center py-32 px-8">
        <div className="text-center">
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Hello, {session?.user?.email || "logged-out user"}!
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            This is a SAML demo app, built using SSOReady.
          </p>

          <div className="mt-10 max-w-lg mx-auto">
            <div className="flex gap-x-4 items-center">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
              />
              <button
                onClick={onLogInWithSAML}
                className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in with SAML
              </button>
              <button
                onClick={onSignOut}
                className="px-3.5 py-2.5 text-sm font-semibold text-gray-900"
              >
                Sign out
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-900">
              (Try any @example.com or @example.org email address.)
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
