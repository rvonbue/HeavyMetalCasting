import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderTransparent } from '../../store/appSlice';
import heroSrc from '../../assets/images/hmc_hero.png';
import heroPortraitSrc from '../../assets/images/Hmc_color.jpg';
import illustrationSrc from '../../assets/images/hmc_illustration.jpg';


const SECTION_ONE = {
  heading: 'Handcrafted in Metal',
  paragraphs: [
    `Heavy Metal Casting is a small-batch jewelry studio specializing in lost-wax casting and hand-finished metalwork. Every piece is conceived, sculpted, and cast by hand — from original wax models to the finished ring, pendant, or pin on your finger.`,
    `We work primarily in sterling silver, with select pieces available in bronze and brass. Our designs draw from occult iconography, medieval heraldry, death imagery, and the raw aesthetic of heavy metal culture — built for people who wear their passions on their skin.`,
    `No mass production. No compromise. Each piece is cast in limited quantities and finished by hand, meaning no two are exactly alike.`,
  ],
};

const SECTION_TWO = {
  heading: 'The Process',
  paragraphs: [
    `Lost-wax casting is one of the oldest metalworking techniques known to humanity — used for thousands of years to create objects of extraordinary detail and permanence. We use it because nothing else comes close.`,
    `Each design begins as a hand-carved wax model. That model is invested in a ceramic shell, the wax is burned out, and molten metal is cast directly into the void left behind. The result is a raw casting that is then cleaned, filed, sanded, and polished by hand until it meets our standards.`,
    `From concept to finished piece, a single design can take weeks. That's not a flaw in our process — it's the whole point.`,
  ],
};

export default function Home() {
  const dispatch = useDispatch();
  const heroRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    dispatch(setHeaderTransparent(true));
    return () => dispatch(setHeaderTransparent(false));
  }, []);

  useEffect(() => {
    const el = document.getElementById('home-scroll-container');
    if (!el) return;
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        heroRef.current.style.transform = `translateY(${el.scrollTop * 0.35}px)`;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);


  return (
    <div id="home-scroll-container" className="overflow-y-auto overflow-x-hidden" style={{ height: '100vh' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '100vh' }}>
        {/* Portrait image (shown in portrait orientation, hidden in landscape) */}
        <div
          ref={heroRef}
          className="absolute inset-x-0 will-change-transform landscape:hidden"
          style={{
            backgroundImage: `url(${heroPortraitSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            top: 0,
            height: '140%',
          }}
        />
        {/* Landscape image (hidden in portrait orientation) */}
        <div
          className="absolute inset-x-0 hidden landscape:block"
          style={{
            backgroundImage: `url(${heroSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            top: 0,
            height: '140%',
          }}
        />
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Content layer */}
      <div className="relative bg-hmc-bodybackground z-10">
        <div className="max-w-[1280px] mx-auto px-8 py-16 flex flex-col gap-24">

          {/* Row 1: text left, image right (stacks to text then image on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="flex flex-col gap-5">
              <h2 className="text-3xl font-bold text-hmc-textprimary">{SECTION_ONE.heading}</h2>
              {SECTION_ONE.paragraphs.map((para, i) => (
                <p key={i} className="text-base text-hmc-textprimary leading-relaxed">{para}</p>
              ))}
            </div>
            <div>
              <img src={illustrationSrc} alt="Heavy Metal Casting illustration" className="w-full object-contain" />
            </div>
          </div>

          {/* Row 2: image left, text right (stacks to text then image on mobile via order) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 sm:order-1">
              <img src={illustrationSrc} alt="The casting process" className="w-full object-contain" />
            </div>
            <div className="flex flex-col gap-5 order-1 sm:order-2">
              <h2 className="text-3xl font-bold text-hmc-textprimary">{SECTION_TWO.heading}</h2>
              {SECTION_TWO.paragraphs.map((para, i) => (
                <p key={i} className="text-base text-hmc-textprimary leading-relaxed">{para}</p>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
