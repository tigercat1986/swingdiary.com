import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "网球拍档 - Apple Watch 数据自动导入，专业比分速记",
  description:
    "网球拍档是一款专业的网球App，支持自动导入Apple Watch数据、专业比分速记、网球日历、AI生成比赛集锦。和大自然一起，记录每次挥拍的精彩瞬间。",
  keywords: "网球,Apple Watch,比分记录,网球App,网球日历,AI集锦",
  authors: [{ name: "网球拍档" }],
  openGraph: {
    title: "网球拍档 - 专业网球App",
    description:
      "自动导入Apple Watch数据，专业比分速记，AI生成比赛集锦",
    url: "https://tennis-mate.app",
    siteName: "网球拍档",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "网球拍档 - 专业网球App",
    description: "自动导入Apple Watch数据，专业比分速记，AI生成比赛集锦",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A7F64" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "网球拍档",
              applicationCategory: "SportsApplication",
              operatingSystem: "iOS",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                ratingCount: "120",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

