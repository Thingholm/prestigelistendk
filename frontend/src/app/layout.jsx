import Footer from "@/components/Footer"
import MobileNavbar from "@/components/MobileNav"
import Navbar from "@/components/Navbar"
import QueryProvider from "@/components/QueryProvider"

export const metadata = {
  title: 'Prestigelisten - Rangliste over de største cykelryttere',
  description: 'Prestigelisten er en opgørelse over de største cykelryttere inden for cykelsporten - mere specifikt landevejscykling. Opgørelsen omfatter data om ryttere helt tilbage fra det første cykelløb i 1876.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          <MobileNavbar />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
