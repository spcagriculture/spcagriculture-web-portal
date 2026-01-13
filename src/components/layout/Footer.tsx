import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Printer, Facebook, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="gov-footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{t.siteName}</h3>
                <p className="text-sm opacity-80">{t.siteSubtitle}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Dedicated to serving the people of Sabaragamuwa Province through excellence in land management, agriculture, animal production, and fisheries development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <Link to="/publications" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.nav.publications}
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.nav.downloads}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.nav.gallery}
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              {t.footer.departments}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/departments/agriculture" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.departments.agriculture}
                </Link>
              </li>
              <li>
                <Link to="/departments/land" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.departments.land}
                </Link>
              </li>
              <li>
                <Link to="/departments/animal" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.departments.animal}
                </Link>
              </li>
              <li>
                <Link to="/departments/fisheries" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.departments.fisheries}
                </Link>
              </li>
              <li>
                <Link to="/departments/irrigation" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">
                  {t.departments.irrigation}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              {t.footer.contact}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm opacity-80">
                  Provincial Ministry Complex,<br />
                  Ratnapura, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm opacity-80">+94 45 2222 123</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm opacity-80">info@sabaragamuwa.gov.lk</span>
              </li>
              <li className="flex items-center gap-3">
                <Printer className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm opacity-80">+94 45 2222 124</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70 text-center md:text-left">
            {t.footer.copyright}
          </p>
          <p className="text-sm opacity-70">
            {t.footer.poweredBy}
          </p>
        </div>
      </div>
    </footer>
  );
};
