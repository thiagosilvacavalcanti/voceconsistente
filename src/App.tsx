/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import videoSrc from './corelacao.mp4';
import logoImg from './logo.png';
import media1 from './media1.jpeg';
import media2 from './media2.jpeg';
import media3 from './media3.jpeg';
import media4 from './media4.jpeg';
import { 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Zap, 
  ArrowRight, 
  Play, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Target,
  Award,
  Clock,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  User
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Components ---

const LeadForm = ({ onComplete }: { onComplete: () => void }) => {
  const [formData, setFormData] = useState({ name: '', alreadyOperates: '', phone: '' });
  const [errors, setErrors] = useState({ alreadyOperates: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const alreadyOperatesValid = formData.alreadyOperates !== '';
    const phoneValid = validatePhone(formData.phone);

    setErrors({
      alreadyOperates: alreadyOperatesValid ? '' : 'Selecione uma opção',
      phone: phoneValid ? '' : 'Telefone inválido (DDD + Número)',
    });

    if (alreadyOperatesValid && phoneValid && formData.name.length > 2) {
      setIsSubmitting(true);
      
      try {
        // Envio para Google Sheets (Webhook)
        const webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors', // Necessário para Google Apps Script
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              alreadyOperates: formData.alreadyOperates,
              phone: formData.phone,
              date: new Date().toISOString()
            })
          });
        }
      } catch (error) {
        console.error("Erro ao enviar para planilha:", error);
      }

      setTimeout(() => {
        localStorage.setItem('lead_captured', 'true');
        localStorage.setItem('timer_expiry', (Date.now() + 600000).toString());
        onComplete();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4 leading-tight">Você está a um passo de garantir sua condição especial</h2>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-2">
            <p className="text-zinc-300 text-base font-medium mb-1">
              Preencha seus dados e libere:
            </p>
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0px rgba(239, 68, 68, 0)",
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                  "0 0 0px rgba(239, 68, 68, 0)"
                ]
              }} 
              transition={{ repeat: Infinity, duration: 1.5 }} 
              className="text-4xl md:text-5xl font-black text-red-500 tracking-tighter"
            >
              75% DE DESCONTO
            </motion.div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                required
                type="text"
                placeholder="Seu nome aqui"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Você já opera?</label>
            <div className="relative">
              <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <select 
                required
                value={formData.alreadyOperates}
                onChange={(e) => setFormData({ ...formData, alreadyOperates: e.target.value })}
                className={cn(
                  "w-full bg-zinc-800/50 border rounded-2xl py-3.5 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all",
                  errors.alreadyOperates ? "border-red-500/50 ring-1 ring-red-500/20" : "border-zinc-700"
                )}
              >
                <option value="" disabled className="bg-zinc-900">Selecione uma opção</option>
                <option value="sim" className="bg-zinc-900">Sim</option>
                <option value="nao" className="bg-zinc-900">Não</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
            </div>
            {errors.alreadyOperates && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.alreadyOperates}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                required
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                className={cn(
                  "w-full bg-zinc-800/50 border rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all",
                  errors.phone ? "border-red-500/50 ring-1 ring-red-500/20" : "border-zinc-700"
                )}
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.phone}</p>}
          </div>

          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                ACESSAR AGORA
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-[10px] text-zinc-500 mt-6 uppercase tracking-widest">
          Ambiente 100% Seguro e Privado
        </p>
      </motion.div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const expiry = localStorage.getItem('timer_expiry');
      if (!expiry) {
        setTimeLeft(null);
        return;
      }
      const now = Date.now();
      const diff = Math.max(0, parseInt(expiry, 10) - now);
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 10);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const ms = Math.floor((timeLeft % 1000) / 10);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: [1, 1.02, 1],
      }}
      transition={{
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="flex flex-col items-center mt-6"
    >
      <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
        Oferta expira em:
      </span>
      <div className="flex gap-2">
        <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl min-w-[50px] shadow-xl">
          <span className="text-2xl font-black text-white tabular-nums">
            {minutes.toString().padStart(2, '0')}
          </span>
          <span className="block text-[8px] text-zinc-500 uppercase font-bold text-center mt-0.5">Min</span>
        </div>
        <span className="text-2xl font-black text-emerald-500 self-center">:</span>
        <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl min-w-[50px] shadow-xl">
          <span className="text-2xl font-black text-white tabular-nums">
            {seconds.toString().padStart(2, '0')}
          </span>
          <span className="block text-[8px] text-zinc-500 uppercase font-bold text-center mt-0.5">Seg</span>
        </div>
        <span className="text-2xl font-black text-emerald-500 self-center">:</span>
        <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl min-w-[50px] shadow-xl">
          <span className="text-2xl font-black text-emerald-400 tabular-nums">
            {ms.toString().padStart(2, '0')}
          </span>
          <span className="block text-[8px] text-zinc-500 uppercase font-bold text-center mt-0.5">Ms</span>
        </div>
      </div>
    </motion.div>
  );
};

const TopBannerTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const expiry = localStorage.getItem('timer_expiry');
      if (!expiry) {
        setTimeLeft(null);
        return;
      }
      const now = Date.now();
      const diff = Math.max(0, parseInt(expiry, 10) - now);
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <motion.div 
      animate={{ backgroundColor: ['#f59e0b', '#fbbf24', '#f59e0b'] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full py-2 px-4 flex items-center justify-center gap-2 text-zinc-900 font-bold text-sm md:text-base sticky top-0 z-[60]"
    >
      <Clock className="w-4 h-4 animate-pulse" />
      <span>DESCONTO VÁLIDO POR:</span>
      <span className="font-black tabular-nums">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </motion.div>
  );
};

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20',
    outline: 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500/10',
    ghost: 'text-zinc-400 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
    xl: 'px-10 py-5 text-xl font-bold uppercase tracking-wider',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const SectionTitle = ({ children, subtitle, light = false }: { children: React.ReactNode; subtitle?: string; light?: boolean }) => (
  <div className="text-center mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "text-3xl md:text-5xl font-black mb-4 tracking-tight",
        light ? "text-white" : "text-zinc-900"
      )}
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn(
          "text-lg md:text-xl max-w-2xl mx-auto",
          light ? "text-zinc-400" : "text-zinc-600"
        )}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-emerald-400 transition-colors"
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoInView = useInView(videoRef, { amount: 0.5 });

  useEffect(() => {
    const captured = localStorage.getItem('lead_captured');
    if (captured === 'true') {
      setIsAuthorized(true);
      const expiry = localStorage.getItem('timer_expiry');
      // If authorized but no timer OR timer expired, start/reset it now
      if (!expiry || parseInt(expiry, 10) <= Date.now()) {
        localStorage.setItem('timer_expiry', (Date.now() + 600000).toString());
      }
      setTimerActive(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized && isVideoInView && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay blocked:", err));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVideoInView, isAuthorized]);
  
    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const scrollToOffer = () => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };
  
    const salesLink = "https://hotmart.com/pt-br/marketplace/produtos/correlacao-o-guia-definitivo/S104098964K";
    const whatsappLink = "http://wa.me/5511966510350";
  
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        {isAuthorized && <TopBannerTimer />}
        <AnimatePresence>
          {!isAuthorized && (
            <LeadForm onComplete={() => {
              setIsAuthorized(true);
              setTimerActive(true);
              localStorage.setItem('timer_expiry', (Date.now() + 600000).toString());
            }} />
          )}
        </AnimatePresence>
  
        {isAuthorized && (
          <>
            {/* Header */}
        <header className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
          isAuthorized ? "top-10" : "top-0",
          scrolled ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800" : "bg-transparent"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img 
                src={logoImg} 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Você<span className="text-emerald-500">Consistente</span>
            </span>
          </div>
          <a href={salesLink} target="_blank" rel="noopener noreferrer" className="hidden md:flex">
            <Button variant="primary" size="sm">
              Quero ser Consistente
            </Button>
          </a>
        </header>
  
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[120px]" />
          </div>
  
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-8"
              >
                <Zap className="w-4 h-4" />
                Mentoria Exclusiva 2026
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]"
              >
                PARE DE PERDER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">DINHEIRO NO DAY TRADE</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Domine a técnica exata que gera consistência real no mercado financeiro, sem precisar de setups mágicos ou indicadores milagrosos.
              </motion.p>
  
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <a href={salesLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button size="xl" className="w-full group">
                      Quero Garantir Minha Vaga
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </motion.div>
  
              {/* Video Section */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-20 relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                  <video 
                    ref={videoRef}
                    className="w-full aspect-video object-cover"
                    controls
                    muted
                    playsInline
                    poster={media3}
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                  <div className="absolute bottom-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                    Aula Exclusiva
                  </div>
                </div>
                <p className="mt-4 text-zinc-500 text-sm italic">
                  Assista ao vídeo acima para entender a estratégia de correlação na prática.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
  
        {/* What You Get Section (Moved Up) */}
        <section className="py-24 bg-zinc-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <SectionTitle light subtitle="Treinamento completo com métodos validados.">
              O QUE VOCÊ TERÁ <span className="text-emerald-500">ACESSO</span>
            </SectionTitle>
  
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                { title: "Cálculo Exclusivo", icon: <Target className="w-6 h-6" /> },
                { title: "Indicadores Exclusivos", icon: <Zap className="w-6 h-6" /> },
                { title: "Correlação", icon: <Clock className="w-6 h-6" /> },
                { title: "Planilha em Tempo Real", icon: <TrendingUp className="w-6 h-6" /> },
                { title: "Cálculo de Spread e Correlação", icon: <ShieldCheck className="w-6 h-6" /> },
                { title: "Suporte Vitalício", icon: <Users className="w-6 h-6" /> }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-all group flex items-center gap-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <a href={salesLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="primary">Garantir Meu Acesso Completo</Button>
              </a>
            </div>
          </div>
        </section>

      {/* Why Section */}
      <section className="py-24 bg-white text-zinc-950">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="A dura realidade que ninguém te conta sobre o mercado financeiro.">
            Por que 95% dos Traders <span className="text-red-600">Fracassam?</span>
          </SectionTitle>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: <Zap className="w-8 h-8 text-amber-500" />,
                title: "Excesso de Informação",
                desc: "Você tenta usar 10 indicadores ao mesmo tempo e acaba travado na hora de tomar uma decisão."
              },
              {
                icon: <Target className="w-8 h-8 text-emerald-500" />,
                title: "Falta de Método",
                desc: "Você opera por intuição ou segue 'dicas' de grupos de WhatsApp, sem um plano claro e testado."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
                title: "Psicológico Frágil",
                desc: "O medo de perder ou a ganância excessiva fazem você abandonar a estratégia no meio do caminho."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200 hover:shadow-xl transition-shadow"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center">
            <a href={salesLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="primary">Quero Mudar Minha Realidade</Button>
            </a>
          </div>
        </div>
      </section>

      {/* The Method Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                  O MÉTODO QUE <span className="text-emerald-500">GERA CONSISTÊNCIA</span>
                </h2>
                <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                  Indicador exclusivo plotado diretamente no gráfico para acompanhamento spread entre IBOV e WIN.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    "O mercado não se move sozinho — ele é impulsionado pelos setores e pela relação entre eles",
                    "Identifique quando o mercado está alinhado e quando está divergente, evitando entradas precipitadas",
                    "Correlação em tempo real entre o índice e os principais setores",
                    "Confirmações claras de compra e venda"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-medium">
                      <CheckCircle2 className="text-emerald-500 w-6 h-6 flex-shrink-0 mt-1" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={salesLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg">Quero o Indicador Exclusivo</Button>
                </a>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl"
              >
                <img 
                  src={media3} 
                  alt="Operação Real" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 bg-zinc-900/30">
        <div className="container mx-auto px-6">
          <SectionTitle light subtitle="Um passo a passo completo, do zero ao avançado.">
            O Que Você Vai <span className="text-emerald-500">Aprender</span>
          </SectionTitle>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <BookOpen />, title: "Fundamentos", desc: "A base sólida que todo trader consistente precisa ter." },
                { icon: <TrendingUp />, title: "A Técnica", desc: "O passo a passo da nossa estratégia vencedora." },
                { icon: <ShieldCheck />, title: "Risco", desc: "Como proteger seu capital e nunca quebrar a banca." },
                { icon: <Users />, title: "Comunidade", desc: "Acesso ao grupo exclusivo de alunos para troca de experiências." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="relative bg-zinc-900 rounded-3xl p-4 border border-zinc-800 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-4 w-32 bg-zinc-800 rounded-full" />
                </div>
                <img 
                  src={media4} 
                  alt="Módulos do Curso" 
                  className="w-full rounded-2xl border border-zinc-800"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black italic shadow-xl shadow-emerald-500/20">
                  PLATAFORMA EXCLUSIVA
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Get Section (Original Location - Removed) */}

      {/* Spreadsheet Showcase Section */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle light subtitle="Visualize o mercado como os profissionais. Nossa planilha exclusiva entrega os pontos exatos de entrada.">
            Nossa Ferramenta de <span className="text-emerald-500">Elite</span>
          </SectionTitle>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
                <img src={media1} alt="Planilha de Correlação 1" className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
              <p className="text-zinc-500 text-sm text-center italic">Monitoramento em tempo real dos setores e correlações.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
                <img src={media2} alt="Planilha de Correlação 2" className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
              <p className="text-zinc-500 text-sm text-center italic">Confirmações visuais de força e exaustão do preço.</p>
            </motion.div>
          </div>
          <div className="flex justify-center">
            <a href={salesLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="primary">Quero Acesso à Ferramenta</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm">PARA TER ACESSO AO MÉTODO COMPLETO</span>
            <h2 className="text-4xl md:text-6xl font-black mt-2">VOCÊ PAGARIA:</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {[
              { title: "TREINAMENTO", price: "R$ 600,00", period: "VITALÍCIO", icon: <BookOpen className="w-10 h-10" /> },
              { title: "PLANILHA", price: "R$ 2.400,00", period: "ANUAL", icon: <TrendingUp className="w-10 h-10" /> },
              { title: "INDICADORES", price: "R$ 1.200,00", period: "ANUAL", icon: <ShieldCheck className="w-10 h-10" /> }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6 border border-emerald-500/20">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tighter">{item.title}</h3>
                <div className="h-px w-12 bg-emerald-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white">{item.price}</div>
                <div className="text-xs text-zinc-500 font-bold tracking-widest mt-1">{item.period}</div>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-2">TOTALIZANDO MAIS DE:</p>
            <p className="text-4xl md:text-5xl font-black text-red-600 line-through tracking-tighter">R$ 4.000,00</p>
          </div>
          
          <div className="max-w-3xl mx-auto p-1 rounded-[2.5rem] bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-2xl shadow-emerald-500/20">
            <div className="bg-zinc-950 rounded-[2.3rem] p-8 md:p-16 text-center border border-white/5">
              <h2 className="text-2xl sm:text-5xl md:text-7xl font-black mb-8 text-emerald-500 tracking-tighter italic whitespace-nowrap">INVESTIMENTO</h2>
              
              <p className="text-xl md:text-2xl font-bold text-white mb-12 leading-tight max-w-md mx-auto">
                Por menos da metade do valor total receba acesso a todo o conteúdo
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                <div className="text-left">
                  <span className="text-red-500 font-bold text-sm block mb-1">De</span>
                  <span className="text-2xl font-bold text-zinc-500 line-through">R$ 4.200,00</span>
                </div>
                <div className="text-left">
                  <span className="text-emerald-500 font-bold text-sm block mb-1">Por:</span>
                  <span className="text-6xl md:text-8xl font-black text-emerald-500 tracking-tighter">R$1097,70</span>
                </div>
              </div>

              <a href={salesLink} target="_blank" rel="noopener noreferrer" className="block group">
                <Button size="xl" className="w-full py-8 text-2xl md:text-3xl font-black tracking-tighter relative overflow-hidden">
                  <span className="relative z-10">GARANTIR MINHA VAGA</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </Button>
              </a>
              
              <CountdownTimer />
              
              <p className="mt-8 text-zinc-500 text-sm font-medium">
                Acesso imediato após a confirmação do pagamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-zinc-900/30">
        <div className="container mx-auto px-6">
          <SectionTitle light subtitle="O que dizem os alunos que já aplicam o método de correlação.">
            Depoimentos de <span className="text-emerald-500">Alunos</span>
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: "GUSTAVO RIBEIRO", comment: "Bem objetivo. Peguei algumas ideias e já apliquei no meu operacional." },
              { name: "CAMILA TEIXEIRA", comment: "Conteúdo direto e prático. Já senti diferença na forma de operar." },
              { name: "LUCAS FERREIRA", comment: "Conteúdo bem estruturado. Facilitou minha análise antes das entradas." },
              { name: "RAFAELA SOUZA", comment: "Curti a explicação. Pequenos detalhes melhoraram minha leitura do mercado." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col h-full"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow italic">
                  "{item.comment}"
                </p>
                <div className="font-bold text-white text-sm uppercase tracking-wider">
                  {item.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6 max-w-3xl">
          <SectionTitle light>Perguntas <span className="text-emerald-500">Frequentes</span></SectionTitle>
          <div className="bg-zinc-900/30 rounded-3xl p-8 border border-zinc-800">
            <FAQItem 
              question="Preciso de muito dinheiro para começar?" 
              answer="Não. Você pode começar com o capital que tiver disponível, focando primeiro no aprendizado e na consistência. O gerenciamento de risco que ensinamos protege seu capital independente do valor."
            />
            <FAQItem 
              question="Quanto tempo demora para ter resultados?" 
              answer="Isso varia de pessoa para pessoa, mas nossos alunos costumam ver uma mudança clara na assertividade nas primeiras 4 semanas de aplicação do método."
            />
            <FAQItem 
              question="E se eu não gostar do conteúdo?" 
              answer="Você tem 7 dias de garantia incondicional. Se por qualquer motivo você achar que a mentoria não é para você, devolvemos 100% do seu dinheiro sem perguntas."
            />
            <FAQItem 
              question="As aulas são ao vivo ou gravadas?" 
              answer="Temos um conteúdo base gravado para você assistir no seu ritmo e encontros semanais ao vivo para tirar dúvidas e analisar o mercado juntos."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
              <img 
                src={logoImg} 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">
              Você<span className="text-emerald-500">Consistente</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm max-w-2xl mx-auto mb-8">
            AVISO LEGAL: Investimentos em renda variável envolvem riscos. Resultados passados não garantem lucros futuros. Nunca invista dinheiro que você não pode perder.
          </p>
          <p className="text-zinc-600 text-xs">
            © 2026 Você Consistente. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-2">
        <motion.a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -15, 0]
          }}
          transition={{
            scale: { duration: 0.3 },
            opacity: { duration: 0.3 },
            y: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }
          }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-600 transition-colors group"
        >
          <MessageCircle className="w-8 h-8 text-white fill-white/20 group-hover:scale-110 transition-transform" />
        </motion.a>
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-zinc-300 uppercase tracking-widest border border-zinc-800 shadow-lg"
        >
          fale diretamente comigo
        </motion.span>
      </div>

        </>
      )}
    </div>
  );
}
