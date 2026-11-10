import './globals.css';

export const metadata = {
  title: 'Mozilla Otari Chatbot',
  description: 'Powered by Otari AI Gateway',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
