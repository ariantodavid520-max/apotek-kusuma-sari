"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const menus = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/products", label: "Rekomendasi" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <Link href="/" className="brand" aria-label="Beranda Apotek Kusuma Sari">
        <Logo />
        <span>Kusuma Sari</span>
      </Link>

      <nav className="navLinks" aria-label="Navigasi utama">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={pathname === menu.href ? "activeNav" : ""}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
