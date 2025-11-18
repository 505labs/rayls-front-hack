import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Cobe } from "@/components/globe-background";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Geometric Background Patterns */}
      <div className="absolute inset-0 pattern-geometric opacity-60" />
      <div className="absolute inset-0 pattern-hexagon opacity-40" />
      <div className="absolute inset-0 pattern-circles opacity-30" />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      
      <Navbar />
      <main className="container mx-auto px-4 py-10 md:py-10 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Title Section */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900">
              Rayls
              <br />
              <span className="text-blue-600">KYC Platform</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Verify your identity using zero-knowledge proofs with Reclaim Protocol.
              <br className="hidden md:block" />
              <span className="text-gray-500">Get verified once, use everywhere with NFT-based credentials.</span>
            </p>
          </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 font-medium"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
              >
                View Demo
              </Button>
            </Link>
          </div>

          {/* Globe Below Title */}
          <Cobe />
        </div>
      </main>
    </div>
  );
}

