import Header from "@/components/shared/header"
import Footer from "@/components/footer"
import AnimatedBackground from "@/components/animate-background/animated-background"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      {/* MUST be near the top so it's behind everything */}
      <AnimatedBackground />
      <Header />
      {/* make sure this doesn't paint white */}
      <main className="flex-1 wrapper">{children}</main>

      <Footer />
    </div>
  )
}
