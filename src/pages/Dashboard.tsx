import { useState } from 'react';
import { Shield, Lock, Unlock, Activity, ArrowLeft, LogOut, HelpCircle, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { EncryptionFlow } from '../components/EncryptionFlow';
import { DecryptionFlow } from '../components/DecryptionFlow';
import { useAuth } from '../hooks/useAuth';
import { useActivityLog } from '../hooks/useActivityLog';
import { formatDistanceToNow } from 'date-fns';

type FlowType = 'dashboard' | 'encrypt' | 'decrypt';

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { activities, loading: activitiesLoading } = useActivityLog(user?.id);
  const [currentFlow, setCurrentFlow] = useState<FlowType>('dashboard');
  
  if (currentFlow === 'encrypt') {
    return <EncryptionFlow onBack={() => setCurrentFlow('dashboard')} />;
  }
  
  if (currentFlow === 'decrypt') {
    return <DecryptionFlow onBack={() => setCurrentFlow('dashboard')} />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
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
          <h1 className="text-lg font-bold text-foreground">{t('app_title')}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate('/help')}>
            <HelpCircle className="h-4 w-4 mr-2" />
            {t('help_faq')}
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
              {t('login')}
            </Button>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{t('welcome_message')}</h2>
            <p className="text-muted-foreground">
              {t('choose_action')}
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
                      {t('protect_files')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('aes_256_encryption')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('zero_knowledge_title')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('multiple_file_support')}
                  </div>
                </div>
                <Button variant="security" className="w-full mt-4 group-hover:scale-105 transition-transform">
                  {t('start_encryption_btn')}
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
                      {t('unlock_files')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('supports_sfl')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('integrity_verification')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {t('original_filename')}
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 group-hover:scale-105 transition-transform border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  {t('start_decryption_btn')}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Help/FAQ or Recent Activity based on login status */}
          {user ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('recent_activity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
                    <p>{t('loading_activity')}</p>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('no_activity')}</p>
                    <p className="text-sm mt-2">{t('encrypt_decrypt_prompt')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div 
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {activity.action_type === 'encrypt' ? (
                            <Lock className="h-4 w-4 text-primary" />
                          ) : (
                            <Unlock className="h-4 w-4 text-accent" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{activity.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.action_type === 'encrypt' ? t('encrypted') : t('decrypted')} 
                              {' '}{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {activity.file_size && (
                          <span className="text-xs text-muted-foreground">
                            {(activity.file_size / 1024).toFixed(2)} KB
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {t('help_faq')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('how_secure')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('how_secure_answer')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('what_is_zero_knowledge')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('what_is_zero_knowledge_answer')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('forgot_password')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('forgot_password_answer')}
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate('/help')}>
                  {t('view_full_faq')}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Security Info */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">{t('zero_knowledge_title')}</h3>
                  <p className="text-muted-foreground mt-1">
                    {t('zero_knowledge_desc')} {t('local_encryption')}
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="text-sm">
                      <strong>{t('encryption_label')}</strong> AES-256-GCM
                    </div>
                    <div className="text-sm">
                      <strong>{t('key_derivation_label')}</strong> {t('pbkdf2_iterations')}
                    </div>
                    <div className="text-sm">
                      <strong>{t('security_label')}</strong> {t('zero_knowledge_short')}
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
