import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";

export default function Contact() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // This function handles the form submission to the web3forms.com service.
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    const formData = new FormData(event.target);
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully!");
        event.target.reset(); // Clears the form fields on success
      } else {
        console.error("Error from web3forms:", data);
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setResult("Network error. Please check your connection and try again.");
    } finally {
      // This block will run regardless of success or failure, ensuring the loading state is always reset.
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      {/* --- HERO / BACKGROUND SECTION --- */}
      <section className="relative py-10 overflow-hidden bg-emerald-700">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-[120px] opacity-50 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-200 rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Text */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 mb-6">
              <MessageSquare size={16} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Support Team
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              Get in{" "}
              <span className="bg-clip-text bg-gradient-to-r text-gray-900">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-800 font-medium leading-relaxed">
              Have a question about booking a turf or organizing a tournament?
              We are here to help you get back in the game.
            </p>
          </div>

          {/* --- MAIN CONTENT GRID --- */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  <Phone size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Phone Support
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Mon-Fri from 9am to 6pm
                </p>
                <p className="text-xl font-bold text-emerald-700 font-mono">
                  +91 98765 43210
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                <p className="text-gray-500 text-sm mb-2">
                  We respond within 24 hours
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  bookmyturf96@gmail.com
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  <MapPin size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Partner With Us...
                </h3>
                <h3 className="text-lg font-bold text-gray-900">
                  Grow Your Turf Business !
                </h3>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
                  Send us a Message
                </h2>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Virat"
                        required
                        className="form-input-style"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Kohli"
                        required
                        className="form-input-style"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="virat@bcci.in"
                        required
                        className="form-input-style"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 00000 00000"
                        required
                        className="form-input-style"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Tell us how we can help..."
                      required
                      className="form-input-style resize-none"
                    ></textarea>
                  </div>

                  {result && (
                    <p
                      className={`text-center font-medium ${result.includes("success") ? "text-green-600" : "text-red-500"}`}
                    >
                      {result}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                  >
                    {loading ? "Sending..." : "Send Message"}
                    {!loading && <Send size={20} />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
