import { Crown, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-accent" />
              <span className="font-serif text-xl font-bold gold-text">GOAT Rankings</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The definitive platform for determining greatness across sports, music, and beyond.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/categories?domain=sports" className="hover:text-accent transition-colors">Sports</Link></li>
              <li><Link to="/categories?domain=music" className="hover:text-accent transition-colors">Music</Link></li>
              <li><Link to="/categories?domain=politics" className="hover:text-accent transition-colors">Politics</Link></li>
              <li><Link to="/categories?domain=entertainment" className="hover:text-accent transition-colors">Entertainment</Link></li>
              <li><Link to="/categories?domain=science" className="hover:text-accent transition-colors">Science</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/vote" className="hover:text-accent transition-colors">Vote</Link></li>
              <li><Link to="/compare" className="hover:text-accent transition-colors">Compare GOATs</Link></li>
              <li><Link to="/profile" className="hover:text-accent transition-colors">Your Profile</Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Methodology</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get weekly GOAT debates and rankings in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 GOAT Rankings. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
