import Layout from "@/components/Layout";
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
  return (
    <Layout>
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-gold mb-2 block">About the Initiative</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">About Digital Nalanda</h1>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container max-w-3xl space-y-10">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">The Initiative</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Digital Nalanda is a civilizational knowledge infrastructure initiative aimed at preserving and structuring India's ancient intellectual heritage in a research-ready digital format. Named after the ancient Nalanda University — one of the world's earliest centers of higher learning — this platform seeks to create a comprehensive, structured archive of India's contributions to human knowledge.
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Vision</h2>
            <blockquote className="font-heading text-lg italic text-foreground/80 border-l-2 border-gold pl-4">
              "To ensure that India's knowledge systems remain accessible, structured, and future-ready in the era of AI and data."
            </blockquote>
          </div>

          <Separator />

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Scope</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              The archive spans six knowledge domains covering the full breadth of Indian civilizational output:
            </p>
            <ul className="space-y-2 font-body text-sm text-muted-foreground list-disc pl-5">
              <li><strong className="text-foreground">Textual Knowledge</strong> — Vedas, Upanishads, technical treatises, literary works</li>
              <li><strong className="text-foreground">Scientific Contributions</strong> — Mathematics, astronomy, metallurgy, medicine</li>
              <li><strong className="text-foreground">Architecture & Engineering</strong> — Temples, stepwells, urban planning, hydraulics</li>
              <li><strong className="text-foreground">Philosophical Schools</strong> — Darshanas, Buddhist and Jain thought systems</li>
              <li><strong className="text-foreground">Tribal & Oral Traditions</strong> — Indigenous knowledge, folk arts, oral histories</li>
              <li><strong className="text-foreground">Historical Archives</strong> — Dynastic records, trade documentation, numismatics</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Technology</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Built with scalable, data-center-ready infrastructure supporting full-text indexing, AI-powered semantic search, structured metadata tagging, multilingual interfaces, and API-first architecture for integration with research tools and AI training pipelines.
            </p>
          </div>

          <Separator />

          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <p className="font-body text-xs text-muted-foreground">
              Digital Nalanda is a Government of India initiative under the Ministry of Culture, developed in collaboration with the National Archives, Archaeological Survey of India, Sanskrit Universities, and Indian Institutes of Technology.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
