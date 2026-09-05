import { motion } from "framer-motion";
import {
  Search,
  Globe,
  BarChart3,
  Bookmark,
  ArrowRight,
  Check,
  Zap,
  Shield,
  MessageSquare,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: Search,
    title: "Smart Discovery",
    desc: "Search by business category and location to surface local businesses that are missing a web presence.",
  },
  {
    icon: Globe,
    title: "Website Detection",
    desc: "Automatically identifies which businesses have no listed website — your highest-value prospects.",
  },
  {
    icon: BarChart3,
    title: "Lead Scoring",
    desc: "Transparent scoring based on rating, reviews, phone availability, and website status. No black boxes.",
  },
  {
    icon: Bookmark,
    title: "Save & Track",
    desc: "Bookmark leads, move them through your pipeline from first look to signed client.",
  },
  {
    icon: MessageSquare,
    title: "Team Notes",
    desc: "Comment directly on any lead so your team stays aligned on outreach and research.",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    desc: "All API keys stay server-side. Your credentials never touch the browser.",
  },
];

const comparisons = [
  {
    feature: "No website listed",
    withFinder: true,
    withoutFinder: "Manual research",
  },
  {
    feature: "Lead scoring",
    withFinder: true,
    withoutFinder: "Guesswork",
  },
  {
    feature: "Status tracking",
    withFinder: true,
    withoutFinder: "Spreadsheets",
  },
  {
    feature: "Team comments",
    withFinder: true,
    withoutFinder: "Scattered messages",
  },
  {
    feature: "API-key security",
    withFinder: true,
    withoutFinder: "Risky exposure",
  },
  {
    feature: "Mobile-ready",
    withFinder: true,
    withoutFinder: "Desktop only",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0EEE6] text-[#1a1a18] font-editorial">
      {/* Navigation */}
      <nav className="border-b-2 border-[#1a1a18]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦅</span>
            <div>
              <span className="text-lg font-bold tracking-wide uppercase">
                Falcon Lead Finder
              </span>
              <span className="ml-2 text-xs text-[#6b6860] tracking-widest uppercase hidden sm:inline">
                Internal Tool — Falcon Sector 1
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-[#6b6860] hover:text-[#1a1a18] transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="rounded bg-[#1a1a18] px-5 py-2 text-sm font-bold text-[#F0EEE6] hover:bg-[#2a2a28] transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#1a1a18] bg-[#FAF9F5] px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
              <span className="inline-block size-2 rounded-full bg-[#E05252] animate-pulse" />
              Built for Falcon Sector 1
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Find every shop
              <br />
              that needs a
              <br />
              <span className="text-[#E05252]">website.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#6b6860]">
              Falcon Lead Finder scans local business directories to surface
              companies with no web presence. Transparent lead scores, team
              notes, and a full pipeline — all in one internal tool.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/auth")}
                className="inline-flex items-center justify-center gap-2 rounded bg-[#1a1a18] px-7 py-3 text-sm font-bold text-[#F0EEE6] hover:bg-[#2a2a28] transition-colors"
              >
                Start Finding Leads
                <ArrowRight className="size-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded border-2 border-[#1a1a18] px-7 py-3 text-sm font-bold text-[#1a1a18] hover:bg-[#E8E5DB] transition-colors"
              >
                See How It Works
              </a>
            </div>
          </motion.div>

          <div className="mt-16 h-px bg-[#D4D0C4]" />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t-2 border-[#1a1a18]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E05252]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Three steps to your next client.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Search",
                desc: "Enter a business category and location — salons in Bengaluru, cafes in Mumbai, gyms in Delhi.",
              },
              {
                step: "02",
                title: "Discover",
                desc: "We query business directories and check each listing for a website. No website means potential lead.",
              },
              {
                step: "03",
                title: "Act",
                desc: "Review transparent lead scores, save promising prospects, add team notes, and track your outreach.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                custom={i + 1}
                className="border-t-2 border-[#1a1a18] pt-6"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-[#E05252]">
                  {item.step}
                </span>
                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b6860]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t-2 border-[#1a1a18] bg-[#FAF9F5]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="text-center"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E05252]">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Built for how your team actually works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#6b6860]">
              Every feature is designed to help your agency find, qualify, and
              track potential web-design clients.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                custom={i + 1}
                className="rounded border-2 border-[#1a1a18] bg-[#F0EEE6] p-6"
              >
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded bg-[#1a1a18] text-[#F0EEE6]">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b6860]">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t-2 border-[#1a1a18]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E05252]">
              Why Falcon Lead Finder
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Stop guessing. Start finding.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={1}
            className="mt-10 overflow-hidden rounded border-2 border-[#1a1a18]"
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-[#1a1a18] bg-[#1a1a18] text-[#F0EEE6]">
                <tr>
                  <th className="px-6 py-3 font-bold">Capability</th>
                  <th className="px-6 py-3 font-bold">With Lead Finder</th>
                  <th className="px-6 py-3 font-bold">Without</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-[#FAF9F5]" : "bg-[#F0EEE6]"}
                  >
                    <td className="px-6 py-3 font-medium">{row.feature}</td>
                    <td className="px-6 py-3">
                      <Check className="inline size-4 text-[#2C5F2D]" />
                    </td>
                    <td className="px-6 py-3 text-[#6b6860]">
                      {row.withoutFinder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-2 border-[#1a1a18] bg-[#1a1a18]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-[#F0EEE6] md:text-4xl">
              Ready to find your next client?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#9B978E]">
              Start with demo data or connect your Google Places API key for
              live results. Setup takes minutes.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="mt-8 inline-flex items-center gap-2 rounded bg-[#F0EEE6] px-8 py-3 text-sm font-bold text-[#1a1a18] hover:bg-white transition-colors"
            >
              Launch Falcon Lead Finder
              <ArrowRight className="size-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#1a1a18] bg-[#F0EEE6]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg">🦅</span>
            <span className="text-sm font-bold tracking-wide uppercase">
              Falcon Lead Finder
            </span>
          </div>
          <p className="text-xs text-[#6b6860]">
            &copy; {new Date().getFullYear()} Falcon Sector 1. Internal lead
            discovery tool.
          </p>
        </div>
      </footer>
    </div>
  );
}
