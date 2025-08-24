import { Shield, Lock, Key, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t('app_title')}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            {t('help_faq')}
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-2xl shadow-lg">
                <Lock className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('app_title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('app_tagline')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="group"
              >
                {t('get_started')}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                {t('help_faq')}
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('zero_knowledge_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('zero_knowledge_desc')}
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-accent/10 p-3 rounded-lg w-fit">
                  <Key className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>AES-256 Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Military-grade encryption with secure key derivation using PBKDF2.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-success/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-success/10 p-3 rounded-lg w-fit">
                  <Lock className="h-6 w-6 text-success" />
                </div>
                <CardTitle>No Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your files and passwords stay on your device. We never see your data.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          {/* Guest Mode Banner */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{t('guest_mode')}</h3>
                  <p className="text-muted-foreground">
                    {t('guest_mode_desc')}
                  </p>
                </div>
                <Button 
                  variant="security"
                  onClick={() => navigate('/dashboard')}
                >
                  Start Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground">
        <p>Built with security and privacy in mind. Your data never leaves your device.</p>
      </footer>
    </div>
  );
}
