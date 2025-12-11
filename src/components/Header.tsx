import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { Button } from './ui/button';
export const Header = () => {
  return <header className="relative z-20 py-4 px-4 md:px-8">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-christmas-red hover:text-christmas-red-light transition-colors">
          
          <span className="font-display text-2xl md:text-3xl snow-text">Advent Calendar</span>
        </Link>
        
        <Link to="/create">
          <Button variant="christmas" size="lg" className="gap-2">
            <Gift className="w-5 h-5" />
            <span className="hidden sm:inline">Create Calendar</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </Link>
      </nav>
    </header>;
};