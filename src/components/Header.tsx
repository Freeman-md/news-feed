import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="NewsFeed home">
          NewsFeed<span aria-hidden="true">.</span>
        </Link>
        <p className="header-note">Room for the everyday.</p>
      </div>
    </header>
  );
}
