import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════
   LAYOUT CONSTANTS
   ═══════════════════════════════════════════════════ */

// Wide grid: applies to all sections
const W = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 xl:px-28';

/* ═══════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════ */

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(entry.target); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════ */

function Counter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();
  const done = useRef(false);

  useEffect(() => {
    if (!isVisible || done.current) return;
    done.current = true;
    let cur = 0;
    const step = end / 80;
    const id = setInterval(() => {
      cur += step;
      if (cur >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(cur));
    }, 20);
    return () => clearInterval(id);
  }, [isVisible, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString('ru-RU')}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════
   BACK TO TOP
   ═══════════════════════════════════════════════════ */

function BackToTop() {
  const scrollY = useScrollY();
  const show = scrollY > 600;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/30 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-brand/40 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Наверх"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   DECORATIVE SHAPES
   ═══════════════════════════════════════════════════ */

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[15%] left-[8%] w-20 h-20 border border-brand/10 rounded-2xl rotate-12 animate-float" />
      <div className="absolute top-[30%] right-[12%] w-14 h-14 border border-brand/8 rounded-full animate-float-slow" />
      <div className="absolute top-[60%] left-[5%] w-6 h-6 bg-brand/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[45%] right-[6%] w-24 h-24 border border-white/[0.03] rounded-3xl -rotate-12 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[20%] left-[15%] w-10 h-10 bg-brand/5 rounded-xl rotate-45 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[75%] right-[20%] w-3 h-3 bg-brand/15 rounded-full animate-float-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-brand/[0.04] rounded-full blur-[100px]" />
      <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-brand/[0.03] rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/[0.02] rounded-full blur-[150px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════ */

function Header() {
  const scrollY = useScrollY();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = scrollY > 60;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-dark/90 backdrop-blur-xl shadow-lg shadow-black/10 py-3' : 'bg-transparent py-5'
    }`}>
      <div className={`${W} flex items-center justify-between`}>
        <a href="#hero" className="relative z-10 flex items-center gap-2.5 group">
          <span className="font-montserrat font-bold text-xl text-white">
            yura<span className="text-brand">prom</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {[
            ['Проблемы', '#problems'],
            ['Решения', '#solutions'],
            ['Кейсы', '#cases'],
            ['Обо мне', '#about'],
          ].map(([label, href]) => (
            <a key={label} href={href} className="fancy-underline px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-300">
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-4 inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white text-[13px] font-semibold rounded-full hover:bg-brand-dark transition-all duration-300 hover:shadow-lg hover:shadow-brand/30 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Связаться
          </a>
        </nav>

        <button className="md:hidden relative z-10 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
          <div className="flex flex-col gap-1.5">
            <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
          </div>
        </button>
      </div>

      <div className={`md:hidden absolute top-full left-0 right-0 bg-dark/95 backdrop-blur-xl border-t border-white/5 transition-all duration-400 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="px-6 py-6 space-y-1">
          {[
            ['Проблемы', '#problems'],
            ['Решения', '#solutions'],
            ['Кейсы', '#cases'],
            ['Обо мне', '#about'],
            ['Связаться', '#contact'],
          ].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-all">
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════ */

function Hero() {

  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-dark overflow-hidden grain">
      <FloatingShapes />

      <div className={`relative z-10 ${W} w-full py-28 md:py-40`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 xl:gap-24 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass mb-6 sm:mb-8" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] sm:text-[12px] text-white/50 font-medium tracking-wide uppercase">Продюсирование · Маркетинг · Автоворонки</span>
            </div>

            <h1 className="font-montserrat font-extrabold text-[clamp(2rem,5vw,4.5rem)] sm:text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.1] sm:leading-[1.08] tracking-tight mb-5 sm:mb-7" style={{ animation: 'fadeInUp 0.8s ease-out 0.35s both' }}>
              <span className="text-white">Автоворонки, которые</span><br />
              <span className="text-gradient">приносят заявки</span><br />
              <span className="text-white">каждый день</span>
            </h1>

            <p className="text-[15px] sm:text-[17px] text-white/40 max-w-[560px] leading-[1.7] mb-8 sm:mb-10" style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both' }}>
              Привет, я <span className="text-white/70 font-medium">Юрий</span> — продюсер и маркетолог. За 3+ года настроил
              более <span className="text-white/70 font-medium">100 автоворонок</span> в Telegram и VK. Помогаю бизнесу получать
              стабильный поток клиентов без ручных продаж.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" style={{ animation: 'fadeInUp 0.8s ease-out 0.65s both' }}>
              <a href="#contact" className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-brand text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand/25 hover:scale-[1.02] active:scale-[0.98] text-[14px] sm:text-base">
                <span className="relative z-10 flex items-center gap-2">
                  Получить консультацию
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a href="#cases" className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-white/60 font-medium rounded-2xl border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.03] transition-all duration-300 text-[14px] sm:text-base">
                Смотреть кейсы
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Photo + Stats — desktop only */}
          <div className="hidden lg:flex lg:flex-col items-center gap-6" style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}>
            <div className="relative w-[200px] h-[240px] sm:w-[260px] sm:h-[310px] md:w-[320px] md:h-[380px] lg:w-[380px] lg:h-[440px] rounded-3xl overflow-hidden ring-1 ring-white/10 flex-shrink-0">
              <img src="https://res.cloudinary.com/dtc5ancbn/image/upload/v1776948113/photo_2025-05-31_16-01-12_2_i6cl52.jpg" alt="Юрий — продюсер и маркетолог" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="font-montserrat font-bold text-white text-base sm:text-lg">Юрий</div>
                <div className="text-white/50 text-xs sm:text-sm">Продюсер · Маркетолог</div>
              </div>
              {/* Decorative rings — desktop only */}
              <div className="hidden lg:block absolute -inset-3 rounded-3xl border border-brand/20 animate-pulse-glow pointer-events-none" />
              <div className="hidden lg:block absolute -inset-6 rounded-3xl border border-brand/[0.07] pointer-events-none" />
              {/* Floating shapes — desktop only */}
              <div className="hidden lg:block absolute -top-4 -right-4 w-8 h-8 rounded-lg bg-brand/80 rotate-12 animate-float shadow-lg shadow-brand/30" />
              <div className="hidden lg:block absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-brand/60 animate-float-slow" />
              <div className="hidden lg:block absolute top-1/2 -right-6 w-4 h-4 rounded-md border-2 border-brand/40 rotate-45 animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
              {[
                { num: '100+', label: 'воронок' },
                { num: '3+', label: 'года' },
                { num: '₽1М+', label: 'рекорд' },
              ].map((s, i) => (
                <div key={i} className="glass rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 text-center hover:border-brand/20 transition-all duration-300 cursor-default">
                  <div className="font-montserrat font-extrabold text-sm sm:text-lg text-gradient">{s.num}</div>
                  <div className="text-white/35 text-[9px] sm:text-[10px] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-20" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MARQUEE
   ═══════════════════════════════════════════════════ */

function MarqueeBand() {
  const items = ['АВТОВОРОНКИ', 'TELEGRAM-БОТЫ', 'VK-БОТЫ', 'МАРКЕТИНГ', 'ЧАТ-БОТЫ', 'ПРОДЮСИРОВАНИЕ', 'КОНТЕНТ-СТРАТЕГИЯ', 'АВТОВОРОНКИ', 'TELEGRAM-БОТЫ', 'VK-БОТЫ', 'МАРКЕТИНГ', 'ЧАТ-БОТЫ', 'ПРОДЮСИРОВАНИЕ', 'КОНТЕНТ-СТРАТЕГИЯ'];
  return (
    <div className="py-3 sm:py-6 bg-dark border-y border-white/[0.04] overflow-hidden">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-white/20 font-montserrat font-bold text-sm tracking-[0.2em]">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand/40" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION TITLE
   ═══════════════════════════════════════════════════ */

function SectionTitle({ sub, children, light = false }: { sub?: string; children: ReactNode; light?: boolean }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className="text-center mb-12 sm:mb-16 md:mb-20">
      <h2 className={`reveal ${isVisible ? 'visible' : ''} font-montserrat font-bold text-[1.75rem] sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] leading-tight tracking-tight ${light ? 'text-white' : 'text-dark'}`}>
        {children}
      </h2>
      {sub && (
        <p className={`reveal stagger-2 ${isVisible ? 'visible' : ''} mt-3 sm:mt-4 text-[14px] sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed ${light ? 'text-white/40' : 'text-gray-400'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROBLEMS (TWO-COLUMN)
   ═══════════════════════════════════════════════════ */

function Problems() {
  const { ref, isVisible } = useInView();

  const leftItems = [
    'Уже вкладывали деньги в рекламу, но заявок нет или они слишком дорогие',
    'Не знаете, как выстроить автоматическую систему продаж',
    'Потеряли клиентов из-за медленной обработки заявок',
    'Ведёте Telegram-канал, но нет монетизации',
    'Нужен чат-бот, но непонятно с чего начать',
    'Конкуренты забирают клиентов через автоворонки',
    'Ограниченный бюджет на маркетинг',
    'Нет чёткой стратегии продвижения',
  ];

  const rightItems = [
    'Настрою автоворонку, которая будет приводить целевые заявки автоматически',
    'Соберу полный цикл: от первого касания до закрытой сделки',
    'Чат-бот ответит и прогреет клиента за секунды — 24/7, без выходных',
    'Настрою монетизацию канала через автоворонку и продуктовую лестницу',
    'Проведу бесплатную консультацию и предложу готовое решение',
    'Сделаю воронку, которая даст лучший опыт, чем у конкурентов',
    'Предложу решение под ваш бюджет — от простого бота до полной системы',
    'Разработаю стратегию продвижения под вашу нишу и цели',
  ];

  const renderList = (items: string[], accent: 'red' | 'green') => (
    <div className="space-y-5">
      {items.map((text, i) => (
        <div key={i} className={`reveal stagger-${Math.min(i + 1, 8)} ${isVisible ? 'visible' : ''} flex gap-4 items-start group`}>
          <div className={`flex-shrink-0 mt-[3px] w-[22px] h-[22px] rounded-lg flex items-center justify-center transition-colors duration-300 ${accent === 'red' ? 'bg-red-500/10 group-hover:bg-red-500/20' : 'bg-emerald-500/10 group-hover:bg-emerald-500/20'}`}>
            {accent === 'red' ? (
              <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            )}
          </div>
          <span className="text-[15px] text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{text}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section id="problems" className="py-16 sm:py-20 md:py-28 lg:py-36 bg-white relative">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] dot-pattern opacity-50" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] dot-pattern opacity-30" />

      <div ref={ref} className={`relative ${W}`}>
        <SectionTitle sub="С этими болями ко мне приходят клиенты. И я знаю, как их решить">
          Знакомые <span className="text-brand">проблемы</span>?
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className={`reveal-left ${isVisible ? 'visible' : ''}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <h3 className="font-montserrat font-bold text-xl text-dark">Проблемы и сомнения</h3>
            </div>
            {renderList(leftItems, 'red')}
          </div>

          <div className={`reveal-right ${isVisible ? 'visible' : ''}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-montserrat font-bold text-xl text-dark">Как я их решаю</h3>
            </div>
            {renderList(rightItems, 'green')}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SOLUTIONS (FEATURE CARDS)
   ═══════════════════════════════════════════════════ */

function Solutions() {
  const { ref, isVisible } = useInView();

  const features = [
    { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>, title: 'Говорю на языке заказчика', desc: 'Понимаю, как решить проблему, и объясняю простым языком, как будет строиться работа для крутого результата.', accent: '15 МИНУТ' },
    { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Брифинг за 15 минут', desc: 'Комфортный брифинг — 10-25 минут, и вы получаете первые результаты и чёткий план дальнейшей работы.', accent: '15 МИН' },
    { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, title: 'Структура воронки за 3 дня', desc: 'Через 3 дня — полная структура автоворонки с текстовым наполнением и сценариями для чат-бота.', accent: '3 ДНЯ' },
    { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>, title: 'Создаю визуальный стиль', desc: 'Нет брендбука — не проблема. Разработаю визуальное оформление: аватарки, картинки, шаблоны постов.', accent: null },
    { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, title: 'Текст, который продаёт', desc: 'Пишу без воды — интересно читать и ведёт к действию: покупке, подписке, регистрации.', accent: null },
    { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, title: 'Ваше участие — 3 часа', desc: 'Каждый занимается своей работой. Я не отвлекаю вас от бизнеса — ваше участие за весь проект минимально.', accent: '3 ЧАСА' },
  ];

  return (
    <section id="solutions" className="py-16 sm:py-20 md:py-28 lg:py-36 bg-light-bg relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-brand/[0.04] rounded-full blur-[100px]" />

      <div ref={ref} className={`relative ${W}`}>
        <SectionTitle sub="Подход к работе, который экономит ваше время и приносит результат">
          Почему <span className="text-brand">со мной</span> работают
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <div key={i} className={`reveal-scale stagger-${i + 1} ${isVisible ? 'visible' : ''} group relative bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-black/[0.04] hover:border-brand/20 hover:shadow-2xl hover:shadow-brand/[0.06] transition-all duration-500 hover-lift cursor-default overflow-hidden`}>
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center text-brand mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
                <h3 className="font-montserrat font-bold text-[17px] text-dark mb-2.5 leading-snug">{f.title}</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
              {f.accent && <div className="absolute bottom-5 right-6 font-montserrat font-extrabold text-[3rem] leading-none text-brand/[0.06] group-hover:text-brand/[0.12] transition-colors duration-500">{f.accent}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CASES
   ═══════════════════════════════════════════════════ */

function Cases() {
  const { ref, isVisible } = useInView();

  const cases = [
    { niche: 'Инфобизнес', title: 'Автоворонка для онлайн-школы', desc: 'Настроил автоворонку в Telegram: чат-бот прогревает, проводит вебинар и закрывает на покупку курса.', metrics: [{ value: 340, label: 'заявок/мес', isText: false }, { value: '₽180', label: 'стоимость заявки', isText: true }, { value: '12%', label: 'конверсия', isText: true }], tags: ['Telegram-бот', 'Автоворонка'], color: 'from-brand to-amber-400' },
    { niche: 'Консалтинг', title: 'Воронка для бизнес-консультанта', desc: 'VK + Telegram: лид-магнит → трипваер → основная услуга. Автоматическая запись на консультации.', metrics: [{ value: 45, label: 'консультаций/мес', isText: false }, { value: '₽850K', label: 'выручка', isText: true }, { value: '×3', label: 'рост за 3 мес', isText: true }], tags: ['VK-бот', 'Telegram'], color: 'from-brand to-amber-400' },
    { niche: 'E-commerce', title: 'Чат-бот для магазина косметики', desc: 'Подбор продукта, автоматические напоминания, промо-рассылки. Бот продаёт 24/7.', metrics: [{ value: 120, label: 'доп. продаж', isText: false }, { value: '+35%', label: 'рост среднего чека', isText: true }, { value: '780%', label: 'ROI воронки', isText: true }], tags: ['Telegram-бот', 'E-commerce'], color: 'from-brand to-amber-400' },
  ];

  return (
    <section id="cases" className="py-16 sm:py-20 md:py-28 lg:py-36 bg-white relative">
      <div ref={ref} className={W}>
        <SectionTitle sub="Реальные результаты, которые получили клиенты после работы со мной">
          Мои <span className="text-brand">кейсы</span>
        </SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {cases.map((c, i) => (
            <div key={i} className={`reveal-scale stagger-${i + 1} ${isVisible ? 'visible' : ''} group bg-dark rounded-2xl overflow-hidden hover-lift transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <div className={`h-1 bg-gradient-to-r ${c.color}`} />
              <div className="p-5 sm:p-6 lg:p-8">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-white/[0.06] text-white/50 mb-5">{c.niche}</span>
                <h3 className="font-montserrat font-bold text-lg text-white mb-3 leading-snug group-hover:text-brand transition-colors duration-300">{c.title}</h3>
                <p className="text-[13.5px] text-white/35 leading-relaxed mb-7">{c.desc}</p>
                <div className="grid grid-cols-3 gap-3 mb-7 py-6 border-y border-white/[0.06]">
                  {c.metrics.map((m, j) => (
                    <div key={j} className="text-center">
                      <div className="font-montserrat font-bold text-xl text-brand">{m.isText ? m.value : <Counter end={m.value as number} />}</div>
                      <div className="text-[10.5px] text-white/30 mt-1 leading-tight">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((tag, j) => <span key={j} className="px-3 py-1 bg-white/[0.04] text-[11px] text-white/30 rounded-lg">{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   NUMBERS
   ═══════════════════════════════════════════════════ */

function Numbers() {
  const { ref, isVisible } = useInView();
  const stats = [
    { num: 100, suffix: '+', label: 'автоворонок', desc: 'настроено для клиентов' },
    { num: 50, suffix: '+', label: 'клиентов', desc: 'возвратов — ноль' },
    { num: 3, suffix: '+', label: 'года опыта', desc: 'в маркетинге' },
    { num: 1, suffix: 'М₽', label: 'рекорд', desc: 'выручка клиента за месяц' },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-36 bg-dark relative overflow-hidden grain">
      <FloatingShapes />
      <div ref={ref} className={`relative z-10 ${W}`}>
        <SectionTitle light>Цифры, которые <span className="text-gradient">говорят</span> за меня</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-16">
          {stats.map((s, i) => (
            <div key={i} className={`reveal stagger-${i + 1} ${isVisible ? 'visible' : ''} text-center`}>
              <div className="font-montserrat font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient mb-2 sm:mb-3"><Counter end={s.num} suffix={s.suffix} /></div>
              <div className="text-white/70 font-semibold text-[13px] sm:text-[15px] mb-0.5 sm:mb-1">{s.label}</div>
              <div className="text-white/25 text-xs sm:text-sm">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════ */

function Services() {
  const { ref, isVisible } = useInView();

  const services = [
    { title: 'Автоворонки в Telegram', desc: 'Полная настройка автоворонки: лид-магнит → прогрев → продажа. Чат-бот работает 24/7.', features: ['Сборка чат-бота', 'Текстовые цепочки', 'Интеграция с CRM', 'Аналитика'], popular: false },
    { title: 'Автоворонки в VK', desc: 'Автоматизация продаж через VK: рассылки, бот-менеджер, лид-формы и прогрев.', features: ['VK Mini Apps', 'Рассылки', 'Лид-боты', 'Аналитика'], popular: false },
    { title: 'Комплексный маркетинг', desc: 'Стратегия + автоворонки + реклама. Полный цикл привлечения клиентов.', features: ['Маркетинг-стратегия', 'Автоворонка', 'Настройка рекламы', 'Сопровождение'], popular: true },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-36 bg-light-bg relative overflow-hidden">
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-brand/[0.03] rounded-full blur-[100px]" />

      <div ref={ref} className={`relative ${W}`}>
        <SectionTitle sub="Выберите подходящий формат сотрудничества">
          Мои <span className="text-brand">услуги</span>
        </SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {services.map((s, i) => (
            <div key={i} className={`reveal-scale stagger-${i + 1} ${isVisible ? 'visible' : ''} group relative rounded-2xl p-5 sm:p-6 lg:p-8 xl:p-10 transition-all duration-500 hover-lift flex flex-col ${s.popular ? 'bg-dark text-white shadow-2xl shadow-black/20 ring-1 ring-brand/30' : 'bg-white border border-black/[0.04] hover:shadow-xl hover:border-brand/20'} ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              {s.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-5 py-1.5 bg-gradient-to-r from-brand to-amber-400 text-white text-[11px] font-bold rounded-full tracking-wide uppercase shadow-lg shadow-brand/30">Популярный</span>
                </div>
              )}
              <h3 className={`font-montserrat font-bold text-lg lg:text-xl mb-3 ${s.popular ? 'text-white' : 'text-dark'}`}>{s.title}</h3>
              <p className={`text-[13px] lg:text-[14px] leading-relaxed mb-6 lg:mb-8 ${s.popular ? 'text-white/40' : 'text-gray-400'}`}>{s.desc}</p>
              <div className="space-y-3 mb-8 flex-grow">
                {s.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${s.popular ? 'bg-brand/20' : 'bg-brand/10'}`}>
                      <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className={`text-sm ${s.popular ? 'text-white/60' : 'text-gray-500'}`}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="#contact" className={`block text-center py-4 rounded-xl font-semibold text-sm transition-all duration-300 mt-auto ${s.popular ? 'bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30' : 'bg-dark text-white hover:bg-dark-card'}`}>Обсудить проект →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════ */

function About() {
  const { ref, isVisible } = useInView();

  const timeline = [
    { year: '2022', text: 'Начал изучать маркетинг и автоворонки. Первые чат-боты для клиентов.' },
    { year: '2023', text: '50+ выполненных проектов. Настроил автоворонки для онлайн-школ и консультантов.' },
    { year: '2024', text: '100+ автоворонок. Запустил обучающие программы для начинающих ботоделов.' },
    { year: '2025', text: 'Путь к 1 000 000₽/мес. Комплексный маркетинг: стратегия + воронки + реклама.' },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 md:py-28 lg:py-36 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[300px] h-[600px] -translate-y-1/2 dot-pattern opacity-40" />

      <div ref={ref} className={`relative ${W}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left - Photo + Info */}
          <div className={`reveal-left ${isVisible ? 'visible' : ''}`}>
            <div className="mb-6 sm:mb-8">
              <img
                src="https://res.cloudinary.com/dtc5ancbn/image/upload/v1776953425/photo_2025-05-31_16-01-13_izdkvs.jpg"
                alt="Юрий — продюсер и маркетолог"
                className="w-full h-[260px] sm:h-[340px] md:h-[380px] lg:h-[500px] object-cover rounded-2xl"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-semibold tracking-wider uppercase mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Обо мне
            </div>

            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-[2.5rem] leading-tight text-dark mb-4 sm:mb-6 tracking-tight">
              Привет, я <span className="text-brand">Юрий</span>
            </h2>
            <p className="text-[14px] sm:text-base text-gray-400 leading-[1.8] mb-4 sm:mb-5">
              Продюсер и маркетолог с опытом 3+ года. Специализируюсь на автоворонках в Telegram и VK — создаю системы, которые продают 24/7 без ручного участия.
            </p>
            <p className="text-[14px] sm:text-base text-gray-400 leading-[1.8] mb-6 sm:mb-8">
              За время работы настроил более 100 автоворонок для клиентов из разных ниш: онлайн-школы, консалтинг, e-commerce, коучинг. Помогаю бизнесу выйти на стабильный поток заявок и автоматизировать продажи.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {['Telegram-боты', 'VK-боты', 'Автоворонки', 'Маркетинг', 'Продюсирование'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-light-bg text-dark/60 text-[12px] font-medium rounded-full border border-black/[0.04] hover:border-brand/30 hover:text-brand transition-all duration-300 cursor-default">{tag}</span>
              ))}
            </div>
          </div>

          {/* Right - Timeline */}
          <div className={`reveal-right ${isVisible ? 'visible' : ''}`}>
            <div className="relative">
              <div className="absolute left-[21px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-brand via-brand/30 to-transparent rounded-full" />
              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <div key={i} className={`reveal stagger-${i + 1} ${isVisible ? 'visible' : ''} flex gap-6 items-start group`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-[11px] font-montserrat font-bold">{item.year}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-[15px] text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════ */

function Testimonials() {
  const { ref, isVisible } = useInView();

  const items = [
    { name: 'Анна К.', role: 'Онлайн-школа', text: 'Юрий настроил автоворонку за неделю. Через месяц — 200+ заявок на пробный урок. До этого рекорд был 30. Очень рекомендую!', stars: 5 },
    { name: 'Дмитрий С.', role: 'Бизнес-консультант', text: 'Раньше тратил часы на переписки. Теперь бот всё делает сам — от первого контакта до записи. Выручка выросла в 3 раза.', stars: 5 },
    { name: 'Мария В.', role: 'Магазин косметики', text: 'Юра создал бота — клиенты получают подборку автоматически. Дополнительные продажи выросли на 35% за первый месяц.', stars: 5 },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-36 bg-light-bg relative">
      <div ref={ref} className={W}>
        <SectionTitle>Что говорят <span className="text-brand">клиенты</span></SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {items.map((t, i) => (
            <div key={i} className={`reveal-scale stagger-${i + 1} ${isVisible ? 'visible' : ''} group bg-white rounded-2xl p-5 sm:p-6 lg:p-8 border border-black/[0.04] hover:shadow-xl hover:border-brand/15 transition-all duration-500 hover-lift ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <div className="flex gap-1 mb-5">
                {[...Array(t.stars)].map((_, j) => (
                  <svg key={j} className="w-4.5 h-4.5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[14px] sm:text-[15px] text-gray-500 leading-[1.7] mb-5 sm:mb-7 group-hover:text-gray-600 transition-colors">«{t.text}»</p>
              <div className="flex items-center gap-3 pt-5 border-t border-black/[0.04]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center">
                  <span className="font-bold text-brand text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-dark">{t.name}</div>
                  <div className="text-[11px] text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════ */

function Contact() {
  const { ref, isVisible } = useInView();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); }, []);

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-28 lg:py-36 bg-dark relative overflow-hidden grain">
      <FloatingShapes />

      <div ref={ref} className={`relative z-10 ${W}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div className={`reveal-left ${isVisible ? 'visible' : ''}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-semibold tracking-wider uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Запишитесь сейчас
            </div>

            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] leading-tight text-white mb-5 sm:mb-6 tracking-tight">
              Давайте обсудим <br /><span className="text-gradient">ваш проект</span>
            </h2>
            <p className="text-[14px] sm:text-base text-white/35 leading-[1.8] mb-8 sm:mb-10 max-w-lg">
              Запишитесь на бесплатную консультацию. За 15 минут разберём вашу ситуацию и предложим решение, которое принесёт результат.
            </p>

            <div className="space-y-5">
              {[
                { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>, label: 'Email', value: 'yurapromarketing@mail.ru', href: 'mailto:yurapromarketing@mail.ru' },
                { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>, label: 'Telegram', value: '@yurapromarketing', href: 'https://t.me/yurapromarketing' },
                { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.853 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.644v3.49c0 .373.17.508.271.508.22 0 .407-.135.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.644-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>, label: 'VK', value: 'yurapromarketing', href: 'https://vk.com/yurapromarketing' },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-brand group-hover:bg-brand/10 group-hover:border-brand/20 transition-all duration-300">{c.icon}</div>
                  <div>
                    <div className="text-[11px] text-white/30 uppercase tracking-wider">{c.label}</div>
                    <div className="text-white/70 font-medium text-sm group-hover:text-brand transition-colors duration-300">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className={`reveal-right ${isVisible ? 'visible' : ''}`}>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-black/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/5 to-transparent rounded-bl-[4rem]" />
              {!submitted ? (
                <form onSubmit={handleSubmit} className="relative z-10">
                  <h3 className="font-montserrat font-bold text-xl text-dark mb-1">Бесплатная консультация</h3>
                  <p className="text-sm text-gray-400 mb-8">Заполните форму и я свяжусь в течение часа</p>
                  <div className="space-y-5">
                    {[
                      { key: 'name', label: 'Ваше имя', placeholder: 'Как к вам обращаться?', type: 'text' },
                      { key: 'phone', label: 'Телефон или Telegram', placeholder: '+7 (___) ___-__-__', type: 'text' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-[12px] font-semibold text-dark/60 uppercase tracking-wider mb-2">{field.label}</label>
                        <input type={field.type} required value={form[field.key as 'name' | 'phone']} onChange={(e) => setForm(s => ({ ...s, [field.key]: e.target.value }))} className="w-full px-5 py-3.5 rounded-xl border border-black/[0.06] text-dark text-sm bg-light-bg/50 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 focus:bg-white transition-all duration-300 placeholder:text-gray-300" placeholder={field.placeholder} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[12px] font-semibold text-dark/60 uppercase tracking-wider mb-2">Опишите задачу</label>
                      <textarea rows={3} value={form.message} onChange={(e) => setForm(s => ({ ...s, message: e.target.value }))} className="w-full px-5 py-3.5 rounded-xl border border-black/[0.06] text-dark text-sm bg-light-bg/50 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 focus:bg-white transition-all duration-300 resize-none placeholder:text-gray-300" placeholder="Что вас интересует?" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-all duration-300 hover:shadow-xl hover:shadow-brand/20 text-sm tracking-wide group">
                      <span className="flex items-center justify-center gap-2">
                        Записаться на консультацию
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                      </span>
                    </button>
                    <p className="text-[11px] text-gray-300 text-center">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="font-montserrat font-bold text-2xl text-dark mb-3">Заявка отправлена!</h3>
                  <p className="text-gray-400 text-sm">Свяжусь с вами в течение часа.<br />Спасибо за доверие!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="bg-[#080808] py-8 sm:py-14 border-t border-white/[0.03]">
      <div className={W}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="font-montserrat font-bold text-white/80 text-lg">yura<span className="text-brand">prom</span></span>
          <div className="flex items-center gap-3">
            {[
              { href: 'https://t.me/yurapromarketing', icon: <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
              { href: 'https://vk.com/yurapromarketing', icon: <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.853 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.644v3.49c0 .373.17.508.271.508.22 0 .407-.135.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.644-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg> },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-brand hover:bg-brand/10 hover:border-brand/20 transition-all duration-300">{s.icon}</a>
            ))}
          </div>
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} yurapromarketing</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════ */

export default function App() {
  return (
    <div className="min-h-screen bg-dark">
      <Header />
      <Hero />
      <MarqueeBand />
      <Problems />
      <Solutions />
      <Cases />
      <Numbers />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}
