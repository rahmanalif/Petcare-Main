"use client";
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Navbar from '../component/global/Navbar';
import SitterNavbar from '../component/global/SitterNavbar';
import Footer from '../component/global/Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const { role } = useSelector((state) => state.auth);

  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith('/login') ||
                     pathname?.startsWith('/signup') ||
                     pathname?.startsWith('/verifycode') ||
                     pathname?.startsWith('/verify-email') ||
                     pathname?.startsWith('/verify-identity') ||
                     pathname?.startsWith('/forgotpassword') ||
                     pathname?.startsWith('/changepassword');

  if (isAuthPage) {
    // Render without Navbar and Footer for auth pages
    return <>{children}</>;
  }

  // Support both legacy and current sitter role values from backend
  const isSitterRole = role === 'pet_sitter' || role === 'sitter';
  const NavbarComponent = isSitterRole ? SitterNavbar : Navbar;

  // Render with appropriate Navbar and Footer for all other pages
  return (
    <div className="min-h-screen bg-[#F8F4EF] overflow-hidden">
      <NavbarComponent />
      <main className="pt-20 pb-0 mb-0">{children}</main>
      <Footer />
    </div>
  );
}
