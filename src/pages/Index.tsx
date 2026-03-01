import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import KnowledgePillars from "@/components/home/KnowledgePillars";
import AISearchSection from "@/components/home/AISearchSection";
import ManuscriptPreview from "@/components/home/ManuscriptPreview";
import CollaborationStrip from "@/components/home/CollaborationStrip";
import ResearchAccessSection from "@/components/home/ResearchAccessSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <KnowledgePillars />
      <AISearchSection />
      <ManuscriptPreview />
      <CollaborationStrip />
      <ResearchAccessSection />
    </Layout>
  );
};

export default Index;
