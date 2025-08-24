import { useState } from 'react';
import { Shield, Lock, Unlock, Activity, ArrowLeft } from 'lucide-react';
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
            Back
          </Button>
          <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">{t('app_title')}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            {t('recent_activity')}
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome to Secure File Locker</h2>
            <p className="text-muted-foreground">
              Choose an action below to get started with secure file encryption.
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
                      Protect your files with military-grade encryption
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    AES-256-GCM encryption
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Zero-knowledge security
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Multiple file support
                  </div>
                </div>
                <Button variant="security" className="w-full mt-4 group-hover:scale-105 transition-transform">
                  Start Encryption
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
                      Unlock and access your encrypted files
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Supports .sfl files
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Integrity verification
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    Original filename restored
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 group-hover:scale-105 transition-transform border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  Start Decryption
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('recent_activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('no_activity')}</p>
                <p className="text-sm mt-2">Encrypt or decrypt files to see activity here</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Security Info */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">{t('zero_knowledge_title')}</h3>
                  <p className="text-muted-foreground mt-1">
                    {t('zero_knowledge_desc')} All encryption happens locally in your browser using the Web Crypto API.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="text-sm">
                      <strong>Encryption:</strong> AES-256-GCM
                    </div>
                    <div className="text-sm">
                      <strong>Key Derivation:</strong> PBKDF2 (310k iterations)
                    </div>
                    <div className="text-sm">
                      <strong>Security:</strong> Zero-knowledge
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}