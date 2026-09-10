export default function LayoutAutenticacao({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="flex flex-col gap-6">{children}</div>
    </main>
  );
}
