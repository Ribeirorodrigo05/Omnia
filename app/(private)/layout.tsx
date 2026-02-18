export default async function PrivateLayout({
  children,
}: {    
    children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}