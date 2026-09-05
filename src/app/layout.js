import "./globals.css";

export const metadata = {
  title: "E-CELL MET Recruitment 2026-27",
  description: "E-CELL MET recruitment application and tracking platform for 2026-27.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
