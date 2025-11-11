import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function HelpFAQ() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
          <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t('help_faq')}</h1>
        </div>
        
        <LanguageToggle />
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('getting_started')}</CardTitle>
                  <CardDescription>{t('getting_started_desc')}</CardDescription>
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
                  <li>{t('faq_encrypt_step1')}</li>
                  <li>{t('faq_encrypt_step2')}</li>
                  <li>{t('faq_encrypt_step3')}</li>
                  <li>{t('faq_encrypt_step4')}</li>
                  <li>{t('faq_encrypt_step5')}</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {t('decrypting_files')}
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                  <li>{t('faq_decrypt_step1')}</li>
                  <li>{t('faq_decrypt_step2')}</li>
                  <li>{t('faq_decrypt_step3')}</li>
                  <li>{t('faq_decrypt_step4')}</li>
                  <li>{t('faq_decrypt_step5')}</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle>{t('troubleshooting')}</CardTitle>
                  <CardDescription>{t('troubleshooting_desc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t('faq_decrypt_failed')}</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>{t('faq_possible_causes')}</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t('faq_cause1')}</li>
                      <li>{t('faq_cause2')}</li>
                      <li>{t('faq_cause3')}</li>
                    </ul>
                    <p className="mt-2"><strong>{t('faq_solutions')}</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t('faq_solution1')}</li>
                      <li>{t('faq_solution2')}</li>
                      <li>{t('faq_solution3')}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>{t('faq_file_stuck')}</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>{t('faq_try_steps')}</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t('faq_step1')}</li>
                      <li>{t('faq_step2')}</li>
                      <li>{t('faq_step3')}</li>
                      <li>{t('faq_step4')}</li>
                      <li>{t('faq_step5')}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>{t('faq_share_mobile')}</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>{t('faq_solutions')}</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t('faq_share_sol1')}</li>
                      <li>{t('faq_share_sol2')}</li>
                      <li>{t('faq_share_sol3')}</li>
                      <li>{t('faq_share_sol4')}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>{t('faq_drag_drop')}</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>{t('faq_alternative')}</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t('faq_alt1')}</li>
                      <li>{t('faq_alt2')}</li>
                      <li>{t('faq_alt3')}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>{t('faq_weak_password')}</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>{t('faq_stronger')}</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t('faq_pass1')}</li>
                      <li>{t('faq_pass2')}</li>
                      <li>{t('faq_pass3')}</li>
                      <li>{t('faq_pass4')}</li>
                      <li>{t('faq_pass5')}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          {/* Security Best Practices */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <div>
                  <CardTitle>{t('security_best_practices')}</CardTitle>
                  <CardDescription>{t('security_best_practices_desc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>{t('faq_sec1_title')}</strong> {t('faq_sec1_desc')}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>{t('faq_sec2_title')}</strong> {t('faq_sec2_desc')}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>{t('faq_sec3_title')}</strong> {t('faq_sec3_desc')}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>{t('faq_sec4_title')}</strong> {t('faq_sec4_desc')}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>{t('faq_sec5_title')}</strong> {t('faq_sec5_desc')}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Back to App */}
          <div className="text-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              {t('start_encrypting_files')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
