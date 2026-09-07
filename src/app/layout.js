import "./globals.css";
import { RECRUITMENT_YEAR_LABEL } from "@/config/recruitment";

export const metadata = {
  title: `E-CELL MET Recruitment ${RECRUITMENT_YEAR_LABEL}`,
  description: `E-CELL MET recruitment application and tracking platform for ${RECRUITMENT_YEAR_LABEL}.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
