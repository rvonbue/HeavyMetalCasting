import { TwoColumnLayout, PageContainer } from "../../components/Resuables";
import HMC_colorSrc from "../../assets/images/about_us.jpg";

function AboutUsPage() {
  return (
    <PageContainer>
      <TwoColumnLayout
      left={
        <img
          src={HMC_colorSrc}
          alt="Heavy Metal Casting"
          className="h-full w-full object-contain"
        />
      }
      right={
        <div className="flex flex-col justify-center gap-6 h-full py-8 px-4">
          <h1 className="text-3xl font-bold text-hmc-textprimary">About Us</h1>

          <p className="text-sm leading-relaxed text-hmc-textprimary">
            Heavy Metal Casting was born from a passion for the ancient art of metalwork and a love of bold, enduring design. Founded in a small workshop tucked away in the mountains, we began with a single casting furnace, a handful of tools, and an obsession with getting every detail right.
          </p>

          <p className="text-sm leading-relaxed text-hmc-textprimary">
            Every piece we create is cast by hand using traditional lost-wax and sand-casting techniques passed down through generations of craftsmen. We work primarily in sterling silver, bronze, and brass — metals that carry weight, history, and character.
          </p>

          <p className="text-sm leading-relaxed text-hmc-textprimary">
            Our designs draw inspiration from mythology, nature, and the raw power of heavy metal culture. We believe jewelry should mean something — that the ring on your finger or the pendant around your neck should tell a story worth telling.
          </p>

          <p className="text-sm leading-relaxed text-hmc-textprimary">
            Each piece is finished by hand, inspected, and shipped directly from our workshop. No mass production. No shortcuts. Just metal, fire, and craft.
          </p>
        </div>
      }
      />
    </PageContainer>
  );
}

export default AboutUsPage
