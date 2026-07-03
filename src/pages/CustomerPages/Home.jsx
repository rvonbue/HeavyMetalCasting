import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderTransparent } from '../../store/appSlice';
import heroSrc from '../../assets/images/hmc_hero.png';
import heroPortraitSrc from '../../assets/images/hmc_hero_portrait.png';
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
  const settings = useSelector((state) => state.settings.settings);
  const heroRef = useRef(null);
  const rafRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(
    () => window.matchMedia('(orientation: landscape)').matches
  );

  // Uploaded homepage images (from store settings), falling back to the bundled
  // assets when not set.
  const heroDesktop = settings.homepage_image_desktop_url || heroSrc;
  const heroMobile = settings.homepage_image_mobile_url || heroPortraitSrc;

  useEffect(() => {
    dispatch(setHeaderTransparent(true));
    return () => dispatch(setHeaderTransparent(false));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)');
    const handler = (e) => setIsLandscape(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = document.getElementById('home-scroll-container');
    if (!el) return;
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (heroRef.current) {
          heroRef.current.style.transform = `translateY(${el.scrollTop * 0.35}px)`;
        }
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
        <div
          ref={heroRef}
          className="absolute inset-x-0 will-change-transform"
          style={{
            backgroundImage: `url(${isLandscape ? heroDesktop : heroMobile})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            top: 0,
            height: '140%',
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative bg-hmc-bodybackground z-10">
        <div className="max-w-[1280px] mx-auto px-8 py-16 flex flex-col gap-24">

          {/* Row 1: text left, image right */}
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

          {/* Row 2: image left, text right */}
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
