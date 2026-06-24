import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, ArrowRight, Zap, Brain, FileText, Mic, Volume2, Code, Sparkles, Shield, Rocket } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Real-time Streaming",
      description: "Experience instant AI responses with real-time streaming chat completions.",
      color: "from-[#ff00ff] to-[#ff1493]",
    },
    {
      icon: FileText,
      title: "RAG Document Analysis",
      description: "Upload documents and get AI-powered analysis using Retrieval-Augmented Generation.",
      color: "from-[#00ffff] to-[#00d9ff]",
    },
    {
      icon: Mic,
      title: "Voice I/O",
      description: "Speak to the AI and listen to responses with speech-to-text and text-to-speech.",
      color: "from-[#ff00ff] to-[#00ffff]",
    },
    {
      icon: Code,
      title: "Code Generation",
      description: "Generate code in multiple languages with AI-powered code generation.",
      color: "from-[#00ffff] to-[#00d9ff]",
    },
    {
      icon: Brain,
      title: "Text Summarization",
      description: "Quickly summarize long texts and documents with AI assistance.",
      color: "from-[#ff00ff] to-[#ff1493]",
    },
    {
      icon: Shield,
      title: "Admin Dashboard",
      description: "Manage users, view analytics, and control the system as an administrator.",
      color: "from-[#00ffff] to-[#00d9ff]",
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-[#0a0e27] overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-border dark:border-[#00ffff]/20 bg-card/80 dark:bg-[#050812]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <Brain className="w-8 h-8 text-[#ff00ff] dark:text-[#ff00ff] group-hover:text-[#00ffff] transition-colors" />
              <Sparkles className="w-4 h-4 text-[#00ffff] absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#ff00ff] to-[#00ffff] bg-clip-text text-transparent">OmniMind AI</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10 transition-all hover:scale-110"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/chat")}
                  className="bg-gradient-to-r from-[#ff00ff] to-[#ff1493] text-white hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all"
                >
                  Open Chat
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                {user?.role === "admin" && (
                  <Button
                    onClick={() => navigate("/admin")}
                    variant="outline"
                    className="dark:border-[#00ffff]/50 dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                  >
                    Admin
                  </Button>
                )}
                <Button
                  onClick={logout}
                  variant="outline"
                  className="dark:border-[#ff00ff]/50 dark:text-[#ff00ff] dark:hover:bg-[#ff00ff]/10 hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-[#ff00ff] to-[#ff1493] text-white hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all"
              >
                Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ffff]/30 bg-[#00ffff]/5 dark:bg-[#00ffff]/10 backdrop-blur">
            <Rocket className="w-4 h-4 text-[#00ffff]" />
            <span className="text-sm font-medium text-[#00ffff]">The Future of AI Conversations</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="block mb-2">
              <span className="bg-gradient-to-r from-[#00ffff] via-[#ff00ff] to-[#00ffff] bg-clip-text text-transparent animate-pulse">
                Experience the Future
              </span>
            </span>
            <span className="block">
              <span className="bg-gradient-to-r from-[#ff00ff] to-[#ff1493] bg-clip-text text-transparent">
                of AI Conversations
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground dark:text-[#00ffff]/70 max-w-3xl mx-auto leading-relaxed">
            OmniMind AI is a cyberpunk-themed AI chatbot with advanced features including RAG-powered document analysis, voice I/O, code generation, text summarization, and an intelligent admin dashboard.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-[#ff00ff] to-[#ff1493] text-white hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] transition-all transform hover:scale-105 text-lg px-8 py-6 h-auto"
          >
            {isAuthenticated ? "Start Chatting Now" : "Get Started Free"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-[#00ffff]/50 text-[#00ffff] hover:bg-[#00ffff]/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all text-lg px-8 py-6 h-auto"
            onClick={() => {
              const element = document.getElementById("features");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Features
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-12">
          <div className="p-4 rounded-lg border border-[#00ffff]/20 bg-[#00ffff]/5 dark:bg-[#00ffff]/10 backdrop-blur">
            <div className="text-2xl md:text-3xl font-bold text-[#ff00ff]">20+</div>
            <div className="text-sm text-[#00ffff]/70">AI Features</div>
          </div>
          <div className="p-4 rounded-lg border border-[#ff00ff]/20 bg-[#ff00ff]/5 dark:bg-[#ff00ff]/10 backdrop-blur">
            <div className="text-2xl md:text-3xl font-bold text-[#00ffff]">100%</div>
            <div className="text-sm text-[#ff00ff]/70">Open Source</div>
          </div>
          <div className="p-4 rounded-lg border border-[#00ffff]/20 bg-[#00ffff]/5 dark:bg-[#00ffff]/10 backdrop-blur">
            <div className="text-2xl md:text-3xl font-bold text-[#ff00ff]">Real-time</div>
            <div className="text-sm text-[#00ffff]/70">Streaming</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#ff00ff] to-[#00ffff] bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-[#00ffff]/70">
            Everything you need for advanced AI conversations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative p-6 rounded-xl border border-[#00ffff]/20 bg-card/50 dark:bg-[#1a1f3a]/50 backdrop-blur hover:border-[#ff00ff]/50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${feature.color}`}
                />

                {/* Glow effect */}
                {hoveredFeature === index && (
                  <div className="absolute inset-0 opacity-20 blur-xl bg-gradient-to-br from-[#ff00ff] to-[#00ffff] pointer-events-none" />
                )}

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-lg mb-4 bg-gradient-to-br ${feature.color} text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 group-hover:text-[#ff00ff] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground dark:text-[#00ffff]/70 group-hover:text-[#00ffff] transition-colors">
                    {feature.description}
                  </p>

                  <div className="mt-4 flex items-center text-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#00ffff] to-[#ff00ff] bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Sign In", desc: "Create your account or sign in with OAuth" },
            { step: "2", title: "Start Chat", desc: "Create a new chat session instantly" },
            { step: "3", title: "Upload Files", desc: "Add documents for RAG analysis" },
            { step: "4", title: "Get Results", desc: "Receive AI-powered responses" },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="p-6 rounded-lg border border-[#00ffff]/20 bg-[#00ffff]/5 dark:bg-[#00ffff]/10 backdrop-blur text-center hover:border-[#ff00ff]/50 transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#00ffff] flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground dark:text-white">{item.title}</h3>
                <p className="text-sm text-muted-foreground dark:text-[#00ffff]/70">{item.desc}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-[#ff00ff]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="relative p-12 rounded-2xl border border-[#00ffff]/30 bg-gradient-to-br from-[#1a1f3a]/50 to-[#050812]/50 backdrop-blur overflow-hidden group hover:border-[#ff00ff]/50 transition-all">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] blur-2xl transition-opacity" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#ff00ff] to-[#00ffff] bg-clip-text text-transparent">
                Ready to Chat?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground dark:text-[#00ffff]/70 mb-8 max-w-2xl mx-auto">
              Join the future of AI conversations. Experience real-time streaming, voice I/O, and intelligent document analysis.
            </p>

            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-[#ff00ff] to-[#ff1493] text-white hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] transition-all transform hover:scale-105 text-lg px-10 py-6 h-auto"
            >
              {isAuthenticated ? "Start Chatting Now" : "Get Started - It's Free"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#00ffff]/20 bg-card/50 dark:bg-[#050812]/50 backdrop-blur mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-[#ff00ff]" />
                <span className="font-bold text-[#ff00ff]">OmniMind AI</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-[#00ffff]/60">
                The future of AI conversations
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground dark:text-[#00ffff]/60">
                <li><a href="#features" className="hover:text-[#ff00ff] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground dark:text-[#00ffff]/60">
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground dark:text-[#00ffff]/60">
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[#ff00ff] transition-colors">License</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#00ffff]/20 pt-8 text-center text-sm text-muted-foreground dark:text-[#00ffff]/60">
            <p>&copy; 2024 OmniMind AI. All rights reserved. | Powered by advanced AI technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
