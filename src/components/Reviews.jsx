import React, { useState } from 'react';
import { REVIEWS, FAQS } from '../data/servicesData';
import { Star, ChevronDown, MessageSquare, CheckCircle } from 'lucide-react';

export const Reviews = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Customer Reviews Section */}
      <div className="mb-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20">
            Real Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3">
            시공을 경험하신 <span className="text-cyan-400">고객님들의 솔직한 후기</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            재이용률 89%, 지인 추천 94%! 직접 경험하신 분들의 목소리를 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div 
              key={rev.id}
              className="glass-card p-6 sm:p-7 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{rev.date}</span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-slate-400">{rev.car} · {rev.region}</p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded bg-slate-800 text-cyan-300 border border-white/5 shrink-0">
                  {rev.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20">
            Frequently Asked Questions
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            자주 묻는 질문 (FAQ)
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:text-cyan-300 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                    <span className="text-cyan-400 font-mono">Q.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                    <p className="pl-6 relative">
                      <span className="absolute left-0 top-0 font-bold text-cyan-400 font-mono">A.</span>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
