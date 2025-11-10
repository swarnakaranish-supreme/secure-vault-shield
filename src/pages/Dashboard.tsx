import { useState } from 'react';
import { Shield, Lock, Unlock, ArrowLeft, HelpCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { EncryptionFlow } from '../components/EncryptionFlow';
import { DecryptionFlow } from '../components/DecryptionFlow';

type FlowType = 'dashboard' | 'encrypt' | 'decrypt';

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentFlow, setCurrentFlow] = useState<FlowType>('dashboard');
  
  if (currentFlow === 'encrypt') {
    return <EncryptionFlow onBack={() => setCurrentFlow('dashboard')} />;
  }
  
  if (currentFlow === 'decrypt') {
    return <DecryptionFlow onBack={() => setCurrentFlow('dashboard')} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
          <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">{t('welcome_title')}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate('/help')}>
            <HelpCircle className="h-4 w-4 mr-2" />
            {t('help_faq')}
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{t('dashboard')}</h2>
            <p className="text-muted-foreground">
              {t('welcome_tagline')}
            </p>
          </div>
          
          {/* Main Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 cursor-pointer" 
                  onClick={() => setCurrentFlow('encrypt')}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t('encrypt_file')}</CardTitle>
                    <CardDescription>
                      {t('encrypt_desc')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('aes_256_gcm')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('zero_knowledge_encryption')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('client_side_processing')}
                  </div>
                </div>
                <Button variant="security" className="w-full mt-4 group-hover:scale-105 transition-transform">
                  {t('start_encryption')}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 border-accent/20 hover:border-accent/40 cursor-pointer"
                  onClick={() => setCurrentFlow('decrypt')}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-accent to-primary p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <Unlock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t('decrypt_file')}</CardTitle>
                    <CardDescription>
                      {t('decrypt_desc')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    .sfl files supported
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Integrity verification
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('original_filename')}
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 group-hover:scale-105 transition-transform border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  {t('start_decryption')}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Help Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{t('help_faq')}</CardTitle>
                      <CardDescription>Learn how to use this app</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {t('encrypting_files')}
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                      <li>Click "{t('encrypt_file')}" above</li>
                      <li>Drag & drop your file or click to browse</li>
                      <li>Set a strong password</li>
                      <li>Download your encrypted file</li>
                    </ol>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {t('decrypting_files')}
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                      <li>Click "{t('decrypt_file')}" above</li>
                      <li>Select your encrypted .sfl file</li>
                      <li>Enter the same password</li>
                      <li>Download your original file</li>
                    </ol>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => navigate('/help')}>
                    {t('help_faq')}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Security Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{t('security_info')}</CardTitle>
                </div>
                <CardDescription>{t('security_info_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{t('aes_256_gcm')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{t('pbkdf2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{t('zero_knowledge_encryption')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{t('client_side_processing')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
