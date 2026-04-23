import { useState, useEffect, useRef } from 'react';

const A = '#6a9fc4';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();
  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const animate = (t: number) => { if (!startTime) startTime = t; const p = Math.min((t - startTime) / duration, 1); setCount(Math.floor(p * end)); if (p < 1) requestAnimationFrame(animate); };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView();
  return <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function CheckIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill={A} fillOpacity="0.15" /><path d="M6 10L9 13L14 7" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ArrowIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#22c55e" fillOpacity="0.15" /><path d="M7 10H13M13 10L10 7M13 10L10 13" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TargetIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke={A} strokeWidth="2" strokeOpacity="0.3" /><circle cx="24" cy="24" r="14" stroke={A} strokeWidth="2" strokeOpacity="0.5" /><circle cx="24" cy="24" r="8" stroke={A} strokeWidth="2" /><circle cx="24" cy="24" r="3" fill={A} /></svg>;
}

function FunnelIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M6 10H42L28 26V38L20 42V26L6 10Z" stroke={A} strokeWidth="2" strokeLinejoin="round" /></svg>;
}

function ChartIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M8 40V18M16 40V12M24 40V8M32 40V16M40 40V6" stroke={A} strokeWidth="3" strokeLinecap="round" /><path d="M4 40H44" stroke={A} strokeWidth="2" strokeLinecap="round" /></svg>;
}

function RocketIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 4C24 4 14 14 14 28L20 34L24 30L28 34L34 28C34 14 24 4 24 4Z" stroke={A} strokeWidth="2" strokeLinejoin="round" /><circle cx="24" cy="20" r="4" stroke={A} strokeWidth="2" /><path d="M14 28L8 32L14 34" stroke={A} strokeWidth="2" strokeLinejoin="round" /><path d="M34 28L40 32L34 34" stroke={A} strokeWidth="2" strokeLinejoin="round" /></svg>;
}

function MessageIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="24" rx="4" stroke={A} strokeWidth="2" /><path d="M6 14L24 26L42 14" stroke={A} strokeWidth="2" strokeLinejoin="round" /></svg>;
}

function UsersIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="18" cy="16" r="6" stroke={A} strokeWidth="2" /><circle cx="34" cy="16" r="5" stroke={A} strokeWidth="2" strokeOpacity="0.5" /><path d="M6 38C6 30 11 26 18 26C25 26 30 30 30 38" stroke={A} strokeWidth="2" strokeLinejoin="round" /><path d="M30 36C30 30 33 28 38 28C43 28 46 31 46 36" stroke={A} strokeWidth="2" strokeOpacity="0.5" strokeLinejoin="round" /></svg>;
}

// Shared container class
const container = "max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  const navLinks = [
    { label: 'О мне', href: '#about' }, { label: 'Услуги', href: '#services' }, { label: 'Кейсы', href: '#cases' }, { label: 'Процесс', href: '#process' }, { label: 'Результаты', href: '#results' },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/[0.07] py-3' : 'py-5'}`}>
      <div className={`${container} flex items-center justify-between`}>
        <a href="#" className="font-[Montserrat] font-bold text-xl tracking-tight">
          <span style={{ color: A }}>Продюсер</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (<a key={link.href} href={link.href} className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium">{link.label}</a>))}
          <a href="#contact" className="btn-primary text-sm !py-2.5 !px-5">Связаться</a>
        </div>
        <button className="md:hidden text-white/70 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" /> : <><path d="M4 7H20" strokeLinecap="round" /><path d="M4 12H20" strokeLinecap="round" /><path d="M4 17H20" strokeLinecap="round" /></>}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/[0.07] animate-fade-in">
          <div className="px-8 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (<a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-white transition-colors py-2">{link.label}</a>))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary text-center mt-2 text-sm">Связаться</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <div className={`${container} pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10 w-full`}>
        <div className="max-w-3xl">
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="inline-block font-[Montserrat] font-semibold text-[10px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border bg-[#6a9fc4]/5 border-[#6a9fc4]/20" style={{ color: A }}>
              Продюсирование & Маркетинг
            </span>
          </div>
          <h1 className="font-[Montserrat] font-extrabold text-[28px] sm:text-5xl lg:text-6xl leading-[1.1] mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Строю системы продаж,{' '}
            <span style={{ color: A }}>которые работают 24/7</span>
          </h1>
          <p className="text-base sm:text-xl text-white/50 leading-relaxed mb-6 sm:mb-8 max-w-2xl animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            Автоворонки, маркетинг и продюсирование для экспертов и бизнеса.
            Помогаю выходить на доход <span className="font-semibold" style={{ color: A }}>от 1 000 000 ₽/мес</span> с помощью системного подхода.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <a href="#contact" className="btn-primary text-sm sm:text-base justify-center sm:justify-start">Записаться на консультацию <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            <a href="#cases" className="btn-secondary text-sm sm:text-base text-center">Смотреть кейсы</a>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/[0.07] animate-fade-in-up opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div><div className="font-[Montserrat] font-bold text-xl sm:text-3xl text-white"><AnimatedCounter end={50} suffix="+" /></div><div className="text-white/40 text-xs sm:text-sm mt-1">проектов запущено</div></div>
            <div><div className="font-[Montserrat] font-bold text-xl sm:text-3xl text-white"><AnimatedCounter end={2} suffix=" млн+" /></div><div className="text-white/40 text-xs sm:text-sm mt-1">рекламного бюджета протестировано</div></div>
            <div><div className="font-[Montserrat] font-bold text-xl sm:text-3xl text-white"><AnimatedCounter end={4} suffix=" года" /></div><div className="text-white/40 text-xs sm:text-sm mt-1">в маркетинге</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemsSolutionsSection() {
  const problems = ['Запускали автоворонку, но она не приносит заявок','Трафик есть, но люди не доходят до покупки','Нет понимания, как выстроить систему продаж','Нужен сайт и воронка срочно, а команда не собрана','Реклама съедает бюджет, а ROI отрицательный','Не знаете, как упаковать свою экспертизу','Хочется масштабироваться, но нет системы','Ограниченный бюджет на маркетинг','Как донести ценность продукта аудитории'];
  const solutions = ['Проведу аудит текущей воронки и найду узкие места','Настрою прогрев и цепочки сообщений, которые ведут к покупке','Разработаю пошаговую стратегию продаж под ваш бизнес','Быстрый запуск: MVP воронки за 5 дней','Оптимизирую рекламные кампании и снижаю стоимость лида','Помогу упаковать продукт так, чтобы его хотели купить','Создам масштабируемую систему автоворонок','Подберу оптимальный набор инструментов под ваш бюджет','Разработаю позиционирование и ключевые сообщения'];
  return (
    <section className="py-12 sm:py-20 lg:py-28"><div className={container}><AnimatedSection><div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
      <div><h2 className="font-[Montserrat] font-bold text-xl sm:text-3xl mb-5 sm:mb-8 flex items-center gap-3"><span className="w-2 h-6 sm:h-8 bg-red-500 rounded-full"></span>Проблемы и сомнения</h2><div className="space-y-3 sm:space-y-4">{problems.map((p, i) => (<AnimatedSection key={i} delay={i*80}><div className="flex items-start gap-3 group"><div className="mt-0.5 shrink-0"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#ef4444" fillOpacity="0.15" /><path d="M5 8L7 10L11 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div><p className="text-white/50 text-xs sm:text-sm leading-relaxed group-hover:text-white/70 transition-colors">{p}</p></div></AnimatedSection>))}</div></div>
      <div><h2 className="font-[Montserrat] font-bold text-xl sm:text-3xl mb-5 sm:mb-8 flex items-center gap-3"><span className="w-2 h-6 sm:h-8 bg-green-500 rounded-full"></span>Как я их решаю</h2><div className="space-y-3 sm:space-y-4">{solutions.map((s, i) => (<AnimatedSection key={i} delay={i*80}><div className="flex items-start gap-3 group"><div className="mt-0.5 shrink-0"><ArrowIcon /></div><p className="text-white/60 text-xs sm:text-sm leading-relaxed group-hover:text-white/80 transition-colors">{s}</p></div></AnimatedSection>))}</div></div>
    </div></AnimatedSection></div></section>
  );
}

function ServicesSection() {
  const services = [
    { icon: <FunnelIcon />, title: 'Автоворонки продаж', description: 'Разрабатываю и внедряю автоматические воронки продаж в Telegram, VK и email, которые конвертуют подписчиков в клиентов без участия менеджера.' },
    { icon: <ChartIcon />, title: 'Маркетинговая стратегия', description: 'Анализирую ваш бизнес, конкурентов и ЦА. Разрабатываю пошаговый план продвижения с чёткими KPI и прогнозами.' },
    { icon: <RocketIcon />, title: 'Запуск продуктов', description: 'Полный цикл запуска: от идеи до первых продаж. Упаковка, прогрев, запуск, пост-анализ и масштабирование.' },
    { icon: <MessageIcon />, title: 'Копирайтинг и упаковка', description: 'Пишу тексты, которые продают. Создаю лендинги, рассылки и контент, который ведёт к целевому действию.' },
    { icon: <UsersIcon />, title: 'Продюсирование экспертов', description: 'Помогаю экспертам упаковать знания в продукт, выстроить личный бренд и создать стабильный поток клиентов.' },
    { icon: <TargetIcon />, title: 'Настройка рекламы', description: 'Тестирую и оптимизирую рекламные кампании. Более 2 млн ₽ протестированного бюджета и рабочие связки.' },
  ];
  return (
    <section id="services" className="py-12 sm:py-20 lg:py-28"><div className={container}>
      <AnimatedSection><div className="text-center mb-10 sm:mb-16">
        <span className="font-[Montserrat] font-semibold text-[10px] sm:text-sm tracking-[0.15em] uppercase" style={{ color: A }}>Услуги</span>
        <h2 className="font-[Montserrat] font-bold text-2xl sm:text-4xl mt-3 sm:mt-4">Чем я могу вам <span style={{ color: A }}>помочь</span></h2>
        <p className="text-white/40 mt-3 sm:mt-4 max-w-lg mx-auto text-sm sm:text-base">Комплексный подход к маркетингу и продажам для вашего бизнеса</p>
      </div></AnimatedSection>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">{services.map((s, i) => (
        <AnimatedSection key={i} delay={i*100}><div className="glass-card rounded-2xl p-5 sm:p-6 h-full hover:border-[#6a9fc4]/20 transition-all duration-300 group">
          <div className="mb-4 sm:mb-5 opacity-80 group-hover:opacity-100 transition-opacity">{s.icon}</div>
          <h3 className="font-[Montserrat] font-semibold text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-[#8abbd8] transition-colors">{s.title}</h3>
          <p className="text-white/40 text-xs sm:text-sm leading-relaxed">{s.description}</p>
        </div></AnimatedSection>
      ))}</div>
    </div></section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-20 lg:py-28"><div className={container}><AnimatedSection><div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
      <div className="relative max-w-md mx-auto lg:max-w-none w-full">
        <div className="aspect-[4/5] sm:aspect-[4/5] max-h-[400px] sm:max-h-none rounded-2xl overflow-hidden border border-white/[0.07]">
          <img src="https://res.cloudinary.com/dtc5ancbn/image/upload/v1776948113/photo_2025-05-31_16-01-12_2_i6cl52.jpg" alt="Юрий — Продюсер и Маркетолог" className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-16 sm:w-24 h-16 sm:h-24 rounded-2xl border -z-10" style={{ borderColor: `${A}15` }} />
        <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-20 sm:w-32 h-20 sm:h-32 rounded-2xl border border-white/[0.07] -z-10" />
      </div>
      <div>
        <span className="font-[Montserrat] font-semibold text-[10px] sm:text-sm tracking-[0.15em] uppercase" style={{ color: A }}>Обо мне</span>
        <h2 className="font-[Montserrat] font-bold text-2xl sm:text-4xl mt-3 sm:mt-4 mb-4 sm:mb-6">Юрий — <span style={{ color: A }}>продюсер</span> и маркетолог</h2>
        <div className="space-y-3 sm:space-y-4 text-white/50 text-sm sm:text-base leading-relaxed">
          <p>За последние 4 года я протестировал более <span className="text-white font-medium">2 млн рублей рекламного бюджета</span> и внедрил автоворонки, которые приносят результаты уже с первых дней.</p>
          <p>Моя специализация — автоворонки продаж, маркетинговые стратегии и продюсирование экспертов. Помогаю выстроить систему, которая работает <span className="text-white font-medium">24/7 без вашего участия</span>.</p>
          <p>Каждый проект для меня — это не просто задача, а партнерство. Я погружаюсь в бизнес клиента, чтобы создать решение, которое действительно работает.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/[0.07]">
          <div><div className="font-[Montserrat] font-bold text-lg sm:text-2xl" style={{ color: A }}><AnimatedCounter end={50} suffix="+" /></div><div className="text-white/40 text-xs sm:text-sm mt-1">успешных проектов</div></div>
          <div><div className="font-[Montserrat] font-bold text-lg sm:text-2xl" style={{ color: A }}><AnimatedCounter end={1} suffix=" млн+ ₽" /></div><div className="text-white/40 text-xs sm:text-sm mt-1">доход клиентов в месяц</div></div>
          <div><div className="font-[Montserrat] font-bold text-lg sm:text-2xl" style={{ color: A }}><AnimatedCounter end={2} suffix=" млн+ ₽" /></div><div className="text-white/40 text-xs sm:text-sm mt-1">рекламного бюджета управляю</div></div>
          <div><div className="font-[Montserrat] font-bold text-lg sm:text-2xl" style={{ color: A }}><AnimatedCounter end={5} suffix=" дней" /></div><div className="text-white/40 text-xs sm:text-sm mt-1">средний срок запуска MVP</div></div>
        </div>
      </div>
    </div></AnimatedSection></div></section>
  );
}

function CasesSection() {
  const cases = [
    { category: 'Автоворонка', title: 'Запуск автоворонки для онлайн-школы', description: 'Разработал и внедрил автоворонку в Telegram для онлайн-школы английского языка. Результат: конверсия из подписчика в покупку — 12%.', metrics: [{ label: 'Конверсия', value: '12%' }, { label: 'ROI', value: '340%' }, { label: 'Лиды/мес', value: '200+' }], image: '/images/case1.jpg' },
    { category: 'Стратегия', title: 'Маркетинговая стратегия для эксперта', description: 'Разработал позиционирование, упаковку продукта и стратегию запуска для нутрициолога. Выход на 1 000 000 ₽/мес за 3 месяца.', metrics: [{ label: 'Доход', value: '1М ₽' }, { label: 'Время', value: '3 мес' }, { label: 'Цена лида', value: '-65%' }], image: '/images/case2.jpg' },
    { category: 'Запуск', title: 'Полный запуск продукта с нуля', description: 'От идеи до первых продаж за 14 дней. Создал лендинг, автоворонку, настроил рекламу. Первый запуск принёс 500 000 ₽.', metrics: [{ label: 'Выручка', value: '500К ₽' }, { label: 'Срок', value: '14 дней' }, { label: 'Заявок', value: '150+' }], image: '/images/case3.jpg' },
    { category: 'Реклама', title: 'Оптимизация рекламных кампаний', description: 'Снизил стоимость лида на 60% для онлайн-курса по дизайну. Переработал креативы, настроил ретаргетинг и look-alike аудитории.', metrics: [{ label: 'Снижение CPL', value: '60%' }, { label: 'Бюджет', value: '500К ₽' }, { label: 'Конверсия', value: '8.5%' }], image: '/images/case4.jpg' },
  ];
  return (
    <section id="cases" className="py-12 sm:py-20 lg:py-28"><div className={container}>
      <AnimatedSection><div className="mb-10 sm:mb-16">
        <span className="font-[Montserrat] font-semibold text-[10px] sm:text-sm tracking-[0.15em] uppercase" style={{ color: A }}>Портфолио</span>
        <h2 className="font-[Montserrat] font-bold text-2xl sm:text-4xl mt-3 sm:mt-4">Реальные <span style={{ color: A }}>кейсы</span></h2>
        <p className="text-white/40 mt-3 sm:mt-4 max-w-xl text-sm sm:text-base">Результаты, подкреплённые цифрами и реальными проектами</p>
      </div></AnimatedSection>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">{cases.map((c, i) => (
        <AnimatedSection key={i} delay={i*120}><div className="glass-card rounded-2xl overflow-hidden group hover:border-[#6a9fc4]/15 transition-all duration-300">
          <div className="h-36 sm:h-48 relative overflow-hidden">
            <img src={c.image} alt={c.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-white/10 text-[10px] sm:text-xs font-medium text-white/80 mb-1.5 sm:mb-2">{c.category}</span>
              <h3 className="font-[Montserrat] font-bold text-sm sm:text-lg">{c.title}</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">{c.description}</p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/[0.07]">{c.metrics.map((m, j) => (
              <div key={j}><div className="font-[Montserrat] font-bold text-sm sm:text-lg" style={{ color: A }}>{m.value}</div><div className="text-white/30 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{m.label}</div></div>
            ))}</div>
          </div>
        </div></AnimatedSection>
      ))}</div>
    </div></section>
  );
}

function ProcessSection() {
  const steps = [
    { number: '01', title: 'Выясняю вашу задачу и нахожу решение', description: 'Созвонимся, обсудим задачу и я составлю план работы. За 1 звонок выстрою структуру дальнейшей работы исходя из вашей цели.' },
    { number: '02', title: 'Аудит бизнеса, конкурентов и ЦА', description: 'Погружаюсь в проект. Изучу конкурентов и целевую аудиторию, чтобы понять, на чём сделать акценты и как выделить вас.' },
    { number: '03', title: 'Разработка стратегии и автоворонки', description: 'Создам пошаговую стратегию и спроектирую автоворонку, которая будет конвертировать лидов в клиентов автоматически.' },
    { number: '04', title: 'Создание контента и упаковка', description: 'Пишу продающие тексты, создаю лендинг, настраиваю цепочки сообщений. Упаковываю продукт так, чтобы его хотели купить.' },
    { number: '05', title: 'Запуск и настройка рекламы', description: 'Настраиваю рекламные кампании, запускаю воронку и отслеживаю первые результаты. Оптимизирую в реальном времени.' },
    { number: '06', title: 'Анализ и масштабирование', description: 'Анализирую результаты, масштабирую рабочие связки, увеличиваю бюджет на прибыльные каналы. Система работает на вас.' },
  ];
  return (
    <section id="process" className="py-12 sm:py-20 lg:py-28"><div className={container}>
      <AnimatedSection><div className="text-center mb-10 sm:mb-16">
        <span className="font-[Montserrat] font-semibold text-[10px] sm:text-sm tracking-[0.15em] uppercase" style={{ color: A }}>Процесс</span>
        <h2 className="font-[Montserrat] font-bold text-2xl sm:text-4xl mt-3 sm:mt-4">Как будет строиться <span style={{ color: A }}>работа</span></h2>
        <p className="text-white/40 mt-3 sm:mt-4 max-w-lg mx-auto text-sm sm:text-base">Прозрачный и понятный процесс от первого звонка до первых продаж</p>
      </div></AnimatedSection>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">{steps.map((s, i) => (
        <AnimatedSection key={i} delay={i*100}><div className="glass-card rounded-2xl p-5 sm:p-6 h-full hover:border-[#6a9fc4]/20 transition-all duration-300 group">
          <span className="font-[Montserrat] font-extrabold text-3xl sm:text-4xl text-white/5 group-hover:text-[#6a9fc4]/15 transition-colors">{s.number}</span>
          <h3 className="font-[Montserrat] font-semibold text-sm sm:text-base mt-3 sm:mt-4 mb-2 sm:mb-3 group-hover:text-[#8abbd8] transition-colors">{s.title}</h3>
          <p className="text-white/40 text-xs sm:text-sm leading-relaxed">{s.description}</p>
        </div></AnimatedSection>
      ))}</div>
      <AnimatedSection delay={600}><div className="mt-8 sm:mt-12 glass-card rounded-2xl p-6 sm:p-8 text-center border border-[#6a9fc4]/12">
        <div className="font-[Montserrat] font-extrabold text-3xl sm:text-6xl mb-2 sm:mb-3" style={{ color: A }}>~5 ЧАСОВ</div>
        <div className="font-[Montserrat] font-semibold text-sm sm:text-lg text-white/70">Ваше участие за весь проект</div>
        <p className="text-white/30 text-xs sm:text-sm mt-2 sm:mt-3 max-w-md mx-auto">Я не буду отвлекать вас от вашего бизнеса</p>
      </div></AnimatedSection>
    </div></section>
  );
}

function ResultsSection() {
  const results = [
    { title: 'Говорю на языке клиента', description: 'Понимаю, как можно решить вашу проблему и понятным языком объясняю, как будет проводиться работа, чтобы получился крутой результат.' },
    { title: 'Не провожу утомительный брифинг', description: 'Мой звонок проходит в комфортном режиме, как правило он занимает 10–25 минут и после этого я выдам вам первые результаты.' },
    { title: 'Стратегия с наполнением за 4 дня', description: 'Я делаю свою работу быстро и качественно, уже через 4 дня вы получите полную стратегию с планом действий.' },
    { title: 'Пишу текст, который продаёт', description: 'Я знаю, как написать контент так, чтобы его было интересно читать, и он вёл человека к целевому действию.' },
  ];
  return (
    <section id="results" className="py-12 sm:py-20 lg:py-28"><div className={container}>
      <AnimatedSection><div className="text-center mb-10 sm:mb-16">
        <span className="font-[Montserrat] font-semibold text-[10px] sm:text-sm tracking-[0.15em] uppercase" style={{ color: A }}>Преимущества</span>
        <h2 className="font-[Montserrat] font-bold text-2xl sm:text-4xl mt-3 sm:mt-4">Почему со мной <span style={{ color: A }}>удобно работать</span></h2>
      </div></AnimatedSection>
      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">{results.map((r, i) => (
        <AnimatedSection key={i} delay={i*120}><div className="flex gap-4 sm:gap-5 group">
          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#6a9fc4]/10 flex items-center justify-center group-hover:bg-[#6a9fc4]/20 transition-colors"><CheckIcon /></div>
          <div><h3 className="font-[Montserrat] font-semibold text-base sm:text-lg mb-1.5 sm:mb-2 group-hover:text-[#8abbd8] transition-colors">{r.title}</h3><p className="text-white/40 text-xs sm:text-sm leading-relaxed">{r.description}</p></div>
        </div></AnimatedSection>
      ))}</div>
    </div></section>
  );
}

function CTASection() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-12 sm:py-20 lg:py-28"><div className={container}><AnimatedSection>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <span className="font-[Montserrat] font-semibold text-[10px] sm:text-sm tracking-[0.15em] uppercase" style={{ color: A }}>Начнём?</span>
          <h2 className="font-[Montserrat] font-bold text-2xl sm:text-5xl mt-3 sm:mt-4 mb-3 sm:mb-4">Оставьте <span style={{ color: A }}>заявку</span></h2>
          <p className="text-white/50 text-sm sm:text-lg leading-relaxed">Заполните форму и я свяжусь с вами в течение часа, чтобы обсудить ваш проект</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 sm:p-8 space-y-4 sm:space-y-5">
            <div>
              <label className="block text-white/60 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Ваше имя</label>
              <input
                type="text"
                required
                placeholder="Как к вам обращаться?"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.07] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#6a9fc4]/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Телефон или Telegram</label>
              <input
                type="text"
                required
                placeholder="+7 (___) ___-__-__ или @username"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.07] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#6a9fc4]/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Опишите задачу</label>
              <textarea
                rows={4}
                placeholder="Расскажите кратко о вашем проекте и что нужно сделать"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.07] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#6a9fc4]/40 transition-colors resize-none"
              />
            </div>
            <button type="submit" className="btn-primary text-sm sm:text-base w-full justify-center mt-1 sm:mt-2">
              Отправить заявку
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <p className="text-white/20 text-[10px] sm:text-xs text-center pt-1">Бесплатная консультация • Без обязательств • Ответ в течение 1 часа</p>
          </form>
        ) : (
          <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center" style={{ background: `${A}20` }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M10 16L14 20L22 12" stroke={A} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3 className="font-[Montserrat] font-bold text-xl sm:text-2xl mb-2 sm:mb-3">Заявка отправлена!</h3>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed">Спасибо, {formData.name || 'за вашу заявку'}! Я свяжусь с вами в ближайшее время для обсуждения проекта.</p>
          </div>
        )}
      </div>
    </AnimatedSection></div></section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-8 sm:py-12"><div className={container}>
      <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 items-start">
        <div><div className="font-[Montserrat] font-bold text-base sm:text-lg mb-2 sm:mb-3"><span style={{ color: A }}>Продюсер</span></div><p className="text-white/30 text-xs sm:text-sm leading-relaxed">Продюсирование, маркетинг и автоворонки для экспертов и бизнеса</p></div>
        <div><h4 className="font-[Montserrat] font-semibold text-xs sm:text-sm text-white/50 mb-3 sm:mb-4">Навигация</h4><div className="flex flex-row sm:flex-col flex-wrap gap-x-4 gap-y-1 sm:gap-2"><a href="#about" className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors">О мне</a><a href="#services" className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors">Услуги</a><a href="#cases" className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors">Кейсы</a><a href="#process" className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors">Процесс</a><a href="#contact" className="text-white/30 text-xs sm:text-sm hover:text-white/60 transition-colors">Контакты</a></div></div>
        <div><h4 className="font-[Montserrat] font-semibold text-sm text-white/50 mb-4">Социальные сети</h4><div className="flex gap-3">
          <a href="https://t.me/yurapromarketing" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#6a9fc4]/10 transition-colors group"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 8L17 1L10 17L8 10L1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-white/40 group-hover:text-[#6a9fc4]" /></svg></a>
          <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#6a9fc4]/10 transition-colors group"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-[#6a9fc4]" /><circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-[#6a9fc4]" /><circle cx="14" cy="4" r="1" fill="currentColor" className="text-white/40 group-hover:text-[#6a9fc4]" /></svg></a>
          <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#6a9fc4]/10 transition-colors group"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1C4.6 1 1 4.6 1 9C1 13.4 4.6 17 9 17C13.4 17 17 13.4 17 9" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-[#6a9fc4]" /><path d="M12 1C15.3 1 17 2.7 17 6" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-[#6a9fc4]" /><path d="M9 6V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-white/40 group-hover:text-[#6a9fc4]" /></svg></a>
        </div></div>
      </div>
      <div className="mt-10 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} Юрий — Продюсирование и Маркетинг. Все права защищены.</p>
        <p className="text-white/15 text-xs">yurapromarketing</p>
      </div>
    </div></footer>
  );
}

export default function App() {
  return (<div className="bg-black text-white min-h-screen overflow-x-hidden"><Navbar /><HeroSection /><ProblemsSolutionsSection /><ServicesSection /><AboutSection /><CasesSection /><ProcessSection /><ResultsSection /><CTASection /><Footer /></div>);
}
