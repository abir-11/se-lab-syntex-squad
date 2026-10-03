import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { cookies } from "next/headers";
import MentorApplicationSection from "./_components/MentorApplicationSection";

const contacts = [
  { icon: MapPin, label: "Address",      value: "Madani Avenue, Vatara, Dhaka 1212, Bangladesh" },
  { icon: Mail,   label: "Email",        value: "campusguide@uiu.ac.bd" },
  { icon: Phone,  label: "Phone",        value: "+880 2-XXXXXXXX" },
  { icon: Clock,  label: "Office Hours", value: "Sun – Thu, 9:00 AM – 5:00 PM" },
];

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://campus-guide-backend.vercel.app";

/** Normalise any known paginated shape into a flat array */
function extractList(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  const d = (data as any)?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  return [];
}

async function getAuthState() {
  const fallback = { isLoggedIn: false as const, role: null, userId: null, application: null };

  try {
    const store = await cookies();
    const token = store.get("accessToken")?.value;
    if (!token) return fallback;

    // 1. Get current user
    const meRes = await fetch(`${BACKEND}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!meRes.ok) return fallback;

    const meJson = await meRes.json();
    const u      = meJson?.data?.result ?? meJson?.data ?? meJson;
    const userId = u?.id as string | undefined;
    const role   = String(u?.role ?? "STUDENT").toUpperCase();

    if (!userId) return fallback;

    // 2. Check for an existing mentor application
    // The backend exposes /pending-applications (ADMIN+STUDENT) and /approved (public).
    // We try both to cover PENDING and APPROVED states.
    let application: any = null;

    const [pendingRes, approvedRes] = await Promise.allSettled([
      fetch(`${BACKEND}/api/mentors-apply/pending-applications?limit=500`, {
        headers: { Authorization: `Bearer ${token}` },
        cache:   "no-store",
      }),
      fetch(`${BACKEND}/api/mentors-apply/approved?limit=500`, {
        cache: "no-store",
      }),
    ]);

    if (pendingRes.status === "fulfilled" && pendingRes.value.ok) {
      const json = await pendingRes.value.json();
      application = extractList(json).find((a: any) => a.userId === userId) ?? null;
    }

    if (!application && approvedRes.status === "fulfilled" && approvedRes.value.ok) {
      const json = await approvedRes.value.json();
      application = extractList(json).find((a: any) => a.userId === userId) ?? null;
    }

    return { isLoggedIn: true as const, role, userId, application };
  } catch {
    return fallback;
  }
}

export default async function ContactPage() {
  const auth = await getAuthState();

  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Contact & Mentor
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Have a question? Or ready to share your knowledge as a mentor? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16">

        {/* ── Contact Info + Message Form ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            <p className="text-gray-600">
              Reach out to us through any of the channels below. We aim to respond within one business day.
            </p>

            <div className="space-y-4 mt-6">
              {contacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send a Message</h2>
              <p className="text-sm text-gray-600 mt-1">Fill in the form and we&apos;ll get back to you soon.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="e.g. Md. Arafat Alam"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="e.g. General Enquiry"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Write your message here…"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <button
                type="button"
                className="w-full bg-orange-500 text-white text-sm font-bold py-3 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-sm shadow-orange-200"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* ── Become a Mentor ── */}
        <MentorApplicationSection auth={auth} />
      </div>
    </div>
  );
}
