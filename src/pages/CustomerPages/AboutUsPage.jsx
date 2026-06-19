import { useSelector } from 'react-redux';
import { TwoColumnLayout, PageContainer } from "../../components/Resuables";
import HMC_colorSrc from "../../assets/images/about_us.jpg";

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.225 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function AboutUsPage() {
  const settings = useSelector((state) => state.settings.settings);
  const aboutUsText = settings.about_us_text;
  const instagramUrl = settings.instagram_url;
  const facebookUrl = settings.facebook_url;

  return (
    <PageContainer>
      <TwoColumnLayout
        left={
          <img
            src={HMC_colorSrc}
            alt="Heavy Metal Casting"
            className="w-full object-contain"
          />
        }
        right={
          <div className="flex flex-col gap-6 py-8 px-4">
            <h1 className="text-3xl font-bold text-hmc-textprimary">About Us</h1>
            <p className="text-sm leading-relaxed text-hmc-textprimary whitespace-pre-wrap">
              {aboutUsText}
            </p>
            {(instagramUrl || facebookUrl) && (
              <div className="flex gap-4 mt-2">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-hmc-textprimary hover:opacity-70 transition-opacity"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-hmc-textprimary hover:opacity-70 transition-opacity"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            )}
          </div>
        }
      />
    </PageContainer>
  );
}

export default AboutUsPage
