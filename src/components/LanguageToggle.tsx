import { Languages } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="flex items-center gap-2"
    >
      <Languages className="h-4 w-4" />
      {language === 'en' ? 'हिं' : 'EN'}
    </Button>
  );
}