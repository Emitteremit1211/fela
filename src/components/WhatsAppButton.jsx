
import { useEffect, useState } from "react";

const messages = [
  "Having issues? Chat with us.",
  "Need help planning your visit?",
  "Have a question about the exhibition?",
  "Want to know more? We're here to help.",
  "We're just a message away.",
];

const phoneNumber = "2349136896548";

export default function WhatsAppButton() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const whatsappMessage =
    "Hello, I would like some assistance with the Fela Anikulapo-Kuti: A Retrospective exhibition.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-5 z-[100] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {/* Thought Bubble */}
      <div className="relative max-w-[220px] animate-[fadeIn_0.4s_ease] rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-lg">
        <p className="text-[11px] font-medium leading-5 text-neutral-800 sm:text-xs">
          {messages[messageIndex]}
        </p>

        {/* Bubble Tail */}
        <span className="absolute -bottom-[6px] left-6 h-3 w-3 rotate-45 border-b border-r border-neutral-200 bg-white" />
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20BD5A] hover:shadow-2xl sm:h-16 sm:w-16"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7 sm:h-8 sm:w-8"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.04 2.003C8.32 2.003 2.04 8.283 2.04 16.003c0 2.47.65 4.79 1.79 6.8L2 30l7.38-1.79a13.9 13.9 0 0 0 6.66 1.7h.01c7.72 0 14-6.28 14-14s-6.28-13.907-14.01-13.907zm0 25.53h-.01a11.56 11.56 0 0 1-5.89-1.61l-.42-.25-4.38 1.06 1.1-4.27-.28-.44a11.48 11.48 0 0 1-1.77-6.02c0-6.39 5.2-11.59 11.6-11.59 3.1 0 6.01 1.21 8.2 3.4a11.53 11.53 0 0 1 3.39 8.2c0 6.4-5.2 11.6-11.54 11.6zm6.36-8.68c-.35-.18-2.08-1.03-2.4-1.15-.32-.12-.55-.18-.78.18-.23.35-.9 1.15-1.1 1.39-.2.23-.4.26-.75.09-.35-.18-1.47-.54-2.8-1.72-1.03-.92-1.72-2.06-1.92-2.4-.2-.35-.02-.54.15-.71.16-.15.35-.4.53-.6.18-.2.23-.35.35-.58.12-.23.06-.44-.03-.62-.09-.17-.78-1.87-1.07-2.56-.28-.67-.57-.58-.78-.59h-.66c-.23 0-.61.09-.93.44-.32.35-1.22 1.19-1.22 2.9s1.25 3.36 1.42 3.59c.17.23 2.46 3.76 5.96 5.27.83.36 1.48.58 1.99.74.84.27 1.6.23 2.2.14.67-.1 2.08-.85 2.37-1.67.29-.82.29-1.52.2-1.67-.09-.15-.32-.24-.67-.41z" />
        </svg>
      </a>
    </div>
  );
}
