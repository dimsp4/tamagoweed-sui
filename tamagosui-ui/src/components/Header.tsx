import { ConnectButton } from "@mysten/dapp-kit";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl text-white font-bold tracking-tighter">TAMAGOSUI</h1>
        <ConnectButton className="text-shadow-indigo-800" />
      </div>
    </header>
  );
}
