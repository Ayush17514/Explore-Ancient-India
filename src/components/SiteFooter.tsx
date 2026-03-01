import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const SiteFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Digital Nalanda</h3>
            <p className="text-sm opacity-80 font-body leading-relaxed">
              A civilizational knowledge infrastructure initiative aimed at preserving and structuring India's ancient intellectual heritage in a research-ready digital format.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Knowledge Domains</h4>
            <ul className="space-y-2 text-sm opacity-80 font-body">
              <li><Link to="/knowledge" className="hover:opacity-100 transition-opacity">Textual Knowledge</Link></li>
              <li><Link to="/knowledge" className="hover:opacity-100 transition-opacity">Scientific Contributions</Link></li>
              <li><Link to="/knowledge" className="hover:opacity-100 transition-opacity">Architecture & Engineering</Link></li>
              <li><Link to="/knowledge" className="hover:opacity-100 transition-opacity">Philosophical Schools</Link></li>
              <li><Link to="/knowledge" className="hover:opacity-100 transition-opacity">Tribal & Oral Traditions</Link></li>
              <li><Link to="/knowledge" className="hover:opacity-100 transition-opacity">Historical Archives</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Research Access</h4>
            <ul className="space-y-2 text-sm opacity-80 font-body">
              <li><Link to="/research" className="hover:opacity-100 transition-opacity">API Documentation</Link></li>
              <li><Link to="/research" className="hover:opacity-100 transition-opacity">Dataset Downloads</Link></li>
              <li><Link to="/research" className="hover:opacity-100 transition-opacity">Citation Export</Link></li>
              <li><Link to="/contribute" className="hover:opacity-100 transition-opacity">Contribute Archives</Link></li>
              <li><Link to="/about" className="hover:opacity-100 transition-opacity">About the Initiative</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80 font-body">
              <li>Digital Nalanda Project Office</li>
              <li>Ministry of Culture, Govt. of India</li>
              <li>New Delhi — 110001</li>
              <li className="pt-2">info@digitalnalanda.gov.in</li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-primary-foreground/20" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60 font-body">
          <p>© 2026 Digital Nalanda — Government of India Initiative. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link to="/about" className="hover:opacity-100 transition-opacity">Terms of Use</Link>
            <Link to="/about" className="hover:opacity-100 transition-opacity">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
