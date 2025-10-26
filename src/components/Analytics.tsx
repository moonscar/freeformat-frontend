"use client";

import Script from 'next/script';

export default function Analytics() {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {umamiSrc && umamiWebsiteId && (
        <Script
          src={umamiSrc}
          data-website-id={umamiWebsiteId}
          strategy="afterInteractive"
        />
      )}
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-setup" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  );
}
