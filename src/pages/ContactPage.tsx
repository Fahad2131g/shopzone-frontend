import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Sparkles,
  HelpCircle,
  Package,
  Briefcase
} from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState('General');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: ''
  });

  const categories = [
    { id: 'General', label: 'General Inquiry', icon: HelpCircle },
    { id: 'Order', label: 'Order Support', icon: Package },
    { id: 'Partnership', label: 'Partnership', icon: Briefcase },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for backend API submission goes here
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 font-sans relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Decorative Glow Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-300/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-amber-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>We're Here To Help</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-amber-950 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500">Touch</span>
          </h1>
          
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
            Have a question about an order, product specs, or just want to collaborate? Drop us a message below and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Main Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Contact Info Block */}
            <div className="bg-white/90 backdrop-blur-xl border border-amber-200/70 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-amber-950 tracking-tight border-b border-amber-100 pb-4">
                Contact Information
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-amber-950">Email Us</p>
                    <p className="text-stone-500 text-xs">Direct responses within a day</p>
                    <a href="mailto:fahadhassan2131@gmail.com" className="text-amber-700 hover:underline text-xs font-medium inline-block pt-1">
                      fahadhassan2131@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-amber-950">Call Us</p>
                    <p className="text-stone-500 text-xs">Mon-Fri from 9am to 6pm PST</p>
                    <a href="tel:+923150122322" className="text-stone-700 font-mono text-xs inline-block pt-1">
                      +92 315 0122322
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-amber-950">Headquarters</p>
                    <p className="text-stone-500 text-xs leading-relaxed">
                      Malir Karachi<br />Sindh, Pakistan
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* AI Teaser Callout (For Future AI Bot) */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200/70 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-5 w-5 text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Instant Answers Coming Soon</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                We are building our instant AI Assistant to solve your queries live! In the meantime, send us a direct message here.
              </p>
            </div>

          </div>

          {/* Right Column: Dynamic Form Container */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-xl border border-amber-200/70 rounded-2xl p-6 sm:p-10 shadow-sm relative">
            
            {submitted ? (
              /* Success Card View */
              <div className="text-center py-12 space-y-5 animate-in fade-in duration-300">
                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-amber-950">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                    Thanks <span className="text-amber-700 font-semibold">{formData.name || 'there'}</span>! We've dispatched your inquiry to our support team.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', orderNumber: '', subject: '', message: '' });
                    }}
                    className="px-6 py-2.5 bg-[#FAF8F3] hover:bg-amber-100 border border-amber-200 text-amber-800 hover:text-amber-900 text-xs font-bold rounded-xl transition duration-200 active:scale-95"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              /* Actual Contact Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Inquiry Type Chips */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const active = inquiryType === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setInquiryType(cat.id)}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-95 ${
                            active
                              ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-md shadow-amber-400/20'
                              : 'bg-[#FAF8F3] border-amber-200 text-stone-500 hover:text-stone-700 hover:border-amber-300'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${active ? 'text-amber-950' : 'text-amber-700'}`} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-stone-600">Your Name *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Morgan"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-amber-200 text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-stone-600">Email Address *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-amber-200 text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
                    />
                  </div>
                </div>

                {/* Optional Order Number (shows if Order Support is selected) */}
                {inquiryType === 'Order' && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="block text-xs font-medium text-stone-600">Order Number (Optional)</label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="#CRFT-84920"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-amber-200 text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
                    />
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-600">Subject *</label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we assist you?"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-amber-200 text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-600">Message *</label>
                  <textarea
                    required
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide as much detail as possible..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-amber-200 text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-400/20 transition duration-200 active:scale-[0.99]"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default ContactPage;