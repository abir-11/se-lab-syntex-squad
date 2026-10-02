import { MapPin, Mail, Phone, Clock } from "lucide-react";

const contacts = [
  { icon: MapPin, label: "Address",       value: "Madani Avenue, Vatara, Dhaka 1212, Bangladesh" },
  { icon: Mail,   label: "Email",         value: "campusguide@uiu.ac.bd" },
  { icon: Phone,  label: "Phone",         value: "+880 2-XXXXXXXX" },
  { icon: Clock,  label: "Office Hours",  value: "Sun – Thu, 9:00 AM – 5:00 PM" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Contact</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Get in Touch</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Have a question or need help? We&apos;re here for you.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
          {contacts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-gray-700 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Send a Message</h2>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
            <input type="text" placeholder="Md. Arafat Alam"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input type="email" placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
            <input type="text" placeholder="e.g. Mentor Application"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
            <textarea rows={4} placeholder="Write your message here…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none" />
          </div>
          <button className="w-full bg-orange-500 text-white text-sm font-semibold py-3 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-sm shadow-orange-200">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
