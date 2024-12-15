import "./globals.css";

export const metadata = {
  title: "smart visitor system ",
  description: "smart visitor system for iot endterm project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  );
}
