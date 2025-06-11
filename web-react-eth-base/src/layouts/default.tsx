import { PropsWithChildren } from 'react';

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Chalee DApp Client</h1>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>由 ❤️ 和 🌈 构建</p>
      </footer>
    </div>
  );
}
