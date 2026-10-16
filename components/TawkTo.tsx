
'use client';

import { useEffect } from 'react';

export default function TawkToChat() {
  useEffect(() => {
    console.log('TawkToChat mounted');

    if (document.getElementById('tawk-to-script')) {
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');

    script.id = 'tawk-to-script';
    script.async = true;
    script.src =
      'https://embed.tawk.to/6a79f52eccab7e1d4937dd0f/1jvm6bghf';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onload = () => {
      console.log('Tawk.to script loaded successfully');
    };

    script.onerror = () => {
      console.error('Failed to load Tawk.to script');
    };

    document.head.appendChild(script);
  }, []);

  return null;
}
