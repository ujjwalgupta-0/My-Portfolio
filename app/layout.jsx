import "./globals.css";

export const metadata = {
  title: "Ujjwal Gupta — Computer Engineering Student & Developer",
  description:
    "Ujjwal Gupta is a computer engineering student who builds thoughtful web experiences and practical software.",
  keywords: ["Ujjwal Gupta", "portfolio", "computer engineering", "web development", "C++"],
  openGraph: {
    title: "Ujjwal Gupta — Developer",
    description: "A computer engineering student exploring the craft of building for the web.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f3ed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
