import Script from 'next/script';
import Navbar from '../components/Navbar';
import SwapCard from '../components/SwapCard';
import TawkToChat from '../components/TawkTo';

export default function Page() {
  console.log("log from page------");
  
  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#222222]">

    <Script
        id="tawk-to-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();

            (function () {
              var s1 = document.createElement("script");
              var s0 = document.getElementsByTagName("script")[0];

              s1.async = true;
              s1.src = "https://embed.tawk.to/6a79f52eccab7e1d4937dd0f/1jvm6bghf";
              s1.charset = "UTF-8";
              s1.setAttribute("crossorigin", "*");

              if (s0 && s0.parentNode) {
                s0.parentNode.insertBefore(s1, s0);
              } else {
                document.head.appendChild(s1);
              }
            })();
          `,
        }}
      />

       <TawkToChat />

      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1280px] items-start justify-center px-4 pb-16 pt-10">
        <SwapCard />
      </div>
    </main>
  );
}
