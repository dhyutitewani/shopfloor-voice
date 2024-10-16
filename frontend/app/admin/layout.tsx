import ClientLayout from './clientLayout';

export const metadata = {
  title: "shopfloorvoice",
  description: "created to collect suggestions",
};

export default function ARootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}  