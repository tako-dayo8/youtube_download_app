import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'YouTube動画ダウンロードアプリ',
    description: 'YouTubeの動画をダウンロードできるリンクを作成できます!!',
    keywords: ['YouTube', 'ダウンロード', 'api'],
    robots: 'noindex, nofollow',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <script
                type="module"
                defer
                src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/spiral.js"
            ></script>
            <body className={`${inter.className} bg-[#464646]`}>{children}</body>
        </html>
    );
}
