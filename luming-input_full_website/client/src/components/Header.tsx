/**
 * Header 导航组件
 * 设计风格：武侠水墨 - 简约优雅的顶部导航
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { INSTALL_URL } from "@/lib/utils";

type NavItem = { label: string; href: string; external?: boolean };

const branches = [
  { label: "纯形·麓鸣", href: "/" },
  { label: "音形·呦呦", href: "/yinxing" },
  { label: "重码测评", href: "/benchmark" },
];

const installNav: NavItem = { label: "安装", href: INSTALL_URL, external: true };

const chunxingNav: NavItem[] = [
  { label: "入门", href: "#intro" },
  { label: "两套功法", href: "#methods" },
  { label: "六脉神剑", href: "#fingering" },
  { label: "字根表", href: "#zigen" },
  { label: "练习", href: "#practice" },
  installNav,
];

const yinxingNav: NavItem[] = [
  { label: "优势", href: "#yx-intro" },
  { label: "原理", href: "#yinxing" },
  { label: "打法", href: "#yinxing-methods" },
  { label: "折梅", href: "#yx-zigen" },
  { label: "练习", href: "#yx-practice" },
  installNav,
];

const benchmarkNav: NavItem[] = [
  { label: "对照表", href: "#collision-table" },
  { label: "击数性能", href: "#stroke-performance" },
  { label: "测评口径", href: "#methodology" },
  installNav,
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const isYinXing = location.startsWith("/yinxing");
  const isBenchmark = location.startsWith("/benchmark");
  const navItems = isBenchmark
    ? benchmarkNav
    : isYinXing
      ? yinxingNav
      : chunxingNav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    const hash = window.location.hash;
    if (hash) {
      const scrollToHash = () => {
        document.querySelector(hash)?.scrollIntoView();
      };
      requestAnimationFrame(scrollToHash);
      const timeout = window.setTimeout(scrollToHash, 600);
      return () => window.clearTimeout(timeout);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-serif font-bold tracking-wider">
              麓鸣
            </span>
            <span className="hidden sm:inline-block text-sm text-muted-foreground font-light">
              输入法
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center border border-border bg-background/70 p-1">
              {branches.map((branch) => {
                const active =
                  branch.href === "/"
                    ? location === "/"
                    : location.startsWith(branch.href);
                return (
                  <Link
                    key={branch.href}
                    href={branch.href}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {branch.label}
                  </Link>
                );
              })}
            </div>
            <span className="w-px h-5 bg-border" aria-hidden="true" />
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={(e) => {
                  if (item.href.startsWith("#")) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
                className="relative inline-flex items-center gap-1 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors duration-300 group"
              >
                {item.label}
                {item.external && (
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/98 backdrop-blur-sm border-t border-border"
          >
            <div className="container py-4">
              <div className="grid grid-cols-3 gap-2 pb-4 mb-2 border-b border-border">
                {branches.map((branch) => {
                  const active =
                    branch.href === "/"
                      ? location === "/"
                      : location.startsWith(branch.href);
                  return (
                    <Link
                      key={branch.href}
                      href={branch.href}
                      className={`px-3 py-3 text-center font-medium border transition-colors ${
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground/75 border-border"
                      }`}
                    >
                      {branch.label}
                    </Link>
                  );
                })}
              </div>
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 py-3 text-lg font-medium text-foreground/80 hover:text-foreground transition-colors border-b border-border/50 last:border-0"
                >
                  {item.label}
                  {item.external && (
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
