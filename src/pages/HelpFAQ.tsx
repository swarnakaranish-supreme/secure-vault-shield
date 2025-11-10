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
                  <li>Select "{t('encrypt_file')}" tab on the dashboard</li>
                  <li>Drag & drop your file or click to browse</li>
                  <li>Enter a strong password (min 8 characters recommended)</li>
                  <li>Click "{t('start_encryption')}" and wait for completion</li>
                  <li>Download or share your encrypted file</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {t('decrypting_files')}
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                  <li>Select "{t('decrypt_file')}" tab on the dashboard</li>
                  <li>Drag & drop your encrypted file or click to browse</li>
                  <li>Enter the SAME password used during encryption</li>
                  <li>Click "{t('start_decryption')}"</li>
                  <li>Download your original file</li>
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
                  <AccordionTrigger>Decryption failed with correct password</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>Possible causes:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Wrong file selected (ensure it's the encrypted file)</li>
                      <li>File was corrupted during transfer/download</li>
                      <li>Password has extra spaces or different case</li>
                    </ul>
                    <p className="mt-2"><strong>Solutions:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Re-download the encrypted file and try again</li>
                      <li>Double-check password (copy-paste if possible)</li>
                      <li>Ensure file extension is correct (.encrypted)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>File not uploading or processing stuck</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>Try these steps:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Refresh the page and try again</li>
                      <li>Clear browser cache and cookies</li>
                      <li>Try a different browser (Chrome, Firefox, Safari)</li>
                      <li>Check if file size is reasonable (very large files may take time)</li>
                      <li>Ensure stable internet connection</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Share button not working on mobile</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>Solutions:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Update your mobile browser to the latest version</li>
                      <li>Use the "Download" button instead and share from files</li>
                      <li>Grant necessary permissions when prompted</li>
                      <li>Try using Chrome or Safari browser on mobile</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Drag & drop not working</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>Alternative method:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Click on the "Choose Files" button instead</li>
                      <li>Select file from your device's file browser</li>
                      <li>On mobile, use the browse button (drag & drop may not work)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Password strength meter showing weak</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p><strong>Create a stronger password:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Use at least 12 characters</li>
                      <li>Mix uppercase and lowercase letters</li>
                      <li>Include numbers and special characters (!@#$%)</li>
                      <li>Avoid common words or patterns</li>
                      <li>Don't reuse passwords from other accounts</li>
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
                <p><strong>Never share your password:</strong> Only you should know the password for your encrypted files</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>Keep backups:</strong> Store encrypted files in multiple locations</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>Remember your password:</strong> We cannot recover forgotten passwords</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>Use unique passwords:</strong> Don't reuse passwords from other services</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p><strong>Verify file integrity:</strong> Ensure encrypted files download completely before deleting originals</p>
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
