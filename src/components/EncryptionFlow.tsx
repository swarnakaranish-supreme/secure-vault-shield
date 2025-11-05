import { useState } from 'react';
import { ArrowLeft, Lock, Key, Download, Share2, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { useLanguage } from '../contexts/LanguageContext';
import { FileDropzone } from './FileDropzone';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { generateStrongPassword, encryptFile, createEncryptedPackage } from '../lib/crypto';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

interface EncryptionFlowProps {
  onBack: () => void;
}

type Step = 'select' | 'password' | 'encrypt' | 'success';

export function EncryptionFlow({ onBack }: EncryptionFlowProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [encryptedFile, setEncryptedFile] = useState<Uint8Array | null>(null);
  const [originalFileName, setOriginalFileName] = useState('');
  
  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setPassword(newPassword);
    toast({
      title: "Strong password generated",
      description: "Make sure to save this password securely!",
    });
  };
  
  const handleStartEncryption = async () => {
    if (!files.length || !password) return;
    
    setIsEncrypting(true);
    setStep('encrypt');
    setProgress(0);
    
    try {
      const file = files[0]; // For now, handle single file
      setOriginalFileName(file.name);
      
      const { encryptedData, metadata } = await encryptFile(
        file, 
        password, 
        'AES-256-GCM',
        (progress) => setProgress(progress)
      );
      
      const packageData = createEncryptedPackage(encryptedData, metadata);
      setEncryptedFile(packageData);
      setStep('success');
      
      toast({
        title: t('success_encrypt'),
        description: `${file.name} has been encrypted successfully.`,
      });
      
    } catch (error) {
      toast({
        title: "Encryption failed",
        description: "An error occurred during encryption. Please try again.",
        variant: "destructive",
      });
      setStep('password');
    } finally {
      setIsEncrypting(false);
    }
  };
  
  const handleDownload = () => {
    if (!encryptedFile) return;

    const blob = new Blob([new Uint8Array(encryptedFile)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFileName}.sfl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your encrypted file is being downloaded.",
    });
  };

  const handleShare = async () => {
    if (!encryptedFile) return;

    const blob = new Blob([new Uint8Array(encryptedFile)], { type: 'application/octet-stream' });
    const fileName = `${originalFileName}.sfl`;

    // Check if Web Share API is supported and can share files
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], fileName, { type: 'application/octet-stream' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Encrypted File',
            text: `Secure encrypted file: ${originalFileName}`,
            files: [file]
          });
          
          toast({
            title: "File shared",
            description: "Your encrypted file has been shared successfully.",
          });
          return;
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Share failed",
            description: "Could not share the file. Downloading instead.",
            variant: "destructive",
          });
        }
      }
    }

    // Fallback: Download the file
    handleDownload();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="flex justify-between items-center p-4 sm:p-6 border-b border-border/50">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2 sm:mr-4 touch-manipulation">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-bold">{t('encrypt_file')}</h1>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/help')}>
          <HelpCircle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Help & FAQ</span>
        </Button>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step: File Selection */}
          {step === 'select' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Files to Encrypt</CardTitle>
                <CardDescription>
                  Choose the files you want to protect with encryption.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileDropzone 
                  files={files}
                  onFilesSelected={setFiles}
                  maxFiles={1}
                />
                
                <div className="flex justify-end">
                  <Button 
                    variant="security"
                    onClick={() => setStep('password')}
                    disabled={files.length === 0}
                    size="lg"
                    className="touch-manipulation min-h-12"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Password Setup */}
          {step === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle>Set Encryption Password</CardTitle>
                <CardDescription>
                  Create a strong password to protect your file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleGeneratePassword}
                      className="shrink-0 touch-manipulation"
                      size="lg"
                    >
                      <Key className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Generate</span>
                    </Button>
                  </div>
                  <PasswordStrengthMeter password={password} />
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Security Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Password is used to derive encryption key (PBKDF2, 310k iterations)</li>
                    <li>• Your password never leaves this device</li>
                    <li>• Make sure to save your password securely</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button variant="outline" onClick={() => setStep('select')} size="lg" className="touch-manipulation">
                    Back
                  </Button>
                  <Button 
                    variant="security"
                    onClick={handleStartEncryption}
                    disabled={!password || password.length < 12}
                    size="lg"
                    className="touch-manipulation"
                  >
                    {t('start_encryption')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Encrypting */}
          {step === 'encrypt' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('encrypting')}</CardTitle>
                <CardDescription>
                  Please wait while your file is being encrypted...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="text-center text-muted-foreground">
                  <Lock className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                  <p>Encrypting with AES-256-GCM...</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Success */}
          {step === 'success' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-success">{t('success_encrypt')}</CardTitle>
                <CardDescription>
                  Your file has been encrypted and is ready for download.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="bg-success/10 p-6 rounded-full w-fit mx-auto mb-4">
                    <Lock className="h-12 w-12 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">File Encrypted Successfully</h3>
                  <p className="text-muted-foreground">
                    Your file has been encrypted with AES-256-GCM encryption.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="success"
                    onClick={handleDownload}
                    className="w-full touch-manipulation"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('download')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleShare}
                    className="w-full touch-manipulation"
                    size="lg"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button variant="outline" onClick={() => {
                    setStep('select');
                    setFiles([]);
                    setPassword('');
                    setEncryptedFile(null);
                    setProgress(0);
                  }} className="touch-manipulation" size="lg">
                    Encrypt Another File
                  </Button>
                  <Button variant="ghost" onClick={onBack} className="touch-manipulation" size="lg">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}