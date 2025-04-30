import Image from 'next/image';

export function AppLogo() {
  return (
    <Image
      src="/club-share-logo.svg"
      alt="App Logo"
      width={32}
      height={32}
      className="dark:invert transition-transform duration-300 group-hover:scale-110"
    />
  );
}
