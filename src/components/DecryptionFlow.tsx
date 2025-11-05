import { useState } from 'react';
import { ArrowLeft, Unlock, Download, FileCheck, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { useLanguage } from '../contexts/LanguageContext';
import { decryptFile, parseEncryptedPackage } from '../lib/crypto';
import { useToast } from '../hooks/use-toast';
import { FileDropzone } from './FileDropzone';
import { useNavigate } from 'react-router-dom';

interface DecryptionFlowProps {
  onBack: () => void;
}

type Step = 'select' | 'password' | 'decrypt' | 'success';

export function DecryptionFlow({ onBack }: DecryptionFlowProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [encryptedFiles, setEncryptedFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decryptedData, setDecryptedData] = useState<Uint8Array | null>(null);
  const [originalFileName, setOriginalFileName] = useState('');

  const encryptedFile = encryptedFiles[0] || null;
  
  const handleFilesSelected = (files: File[]) => {
    const sflFiles = files.filter(file => file.name.endsWith('.sfl'));
    
    if (sflFiles.length === 0 && files.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please select a .sfl encrypted file.",
        variant: "destructive",
      });
      return;
    }
    
    setEncryptedFiles(sflFiles.slice(0, 1)); // Only allow one file
  };
  
  const handleStartDecryption = async () => {
    if (!encryptedFile || !password) return;
    
    setIsDecrypting(true);
    setStep('decrypt');
    setProgress(0);
    
    try {
      const fileData = new Uint8Array(await encryptedFile.arrayBuffer());
      const { metadata, encryptedData } = parseEncryptedPackage(fileData);
      
      setOriginalFileName(metadata.originalName);
      
      const decrypted = await decryptFile(
        encryptedData,
        metadata,
        password,
        (progress) => setProgress(progress)
      );
      
      setDecryptedData(decrypted);
      setStep('success');
      
      toast({
        title: t('success_decrypt'),
        description: `${metadata.originalName} has been decrypted successfully.`,
      });
      
    } catch (error) {
      toast({
        title: "Decryption failed",
        description: "Please check your password and try again.",
        variant: "destructive",
      });
      setStep('password');
    } finally {
      setIsDecrypting(false);
    }
  };
  
  const handleDownload = () => {
    if (!decryptedData || !originalFileName) return;
    
    const blob = new Blob([new Uint8Array(decryptedData)]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your decrypted file is being downloaded.",
    });
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
            <div className="bg-gradient-to-r from-accent to-primary p-2 rounded-lg">
              <Unlock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-bold">{t('decrypt_file')}</h1>
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
                <CardTitle>Select Encrypted File</CardTitle>
                <CardDescription>
                  Choose the .sfl encrypted file you want to decrypt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileDropzone
                  files={encryptedFiles}
                  onFilesSelected={handleFilesSelected}
                  maxFiles={1}
                  accept=".sfl"
                />
                
                <div className="flex justify-end">
                  <Button 
                    variant="security"
                    onClick={() => setStep('password')}
                    disabled={!encryptedFile}
                    size="lg"
                    className="touch-manipulation"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Password Entry */}
          {step === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle>Enter Decryption Password</CardTitle>
                <CardDescription>
                  Enter the password used to encrypt this file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="decrypt-password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="decrypt-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the encryption password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Security Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Password is verified using cryptographic authentication</li>
                    <li>• Decryption happens locally in your browser</li>
                    <li>• Wrong password will result in decryption failure</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button variant="outline" onClick={() => setStep('select')} size="lg" className="touch-manipulation">
                    Back
                  </Button>
                  <Button 
                    variant="security"
                    onClick={handleStartDecryption}
                    disabled={!password}
                    size="lg"
                    className="touch-manipulation"
                  >
                    {t('start_decryption')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Decrypting */}
          {step === 'decrypt' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('decrypting')}</CardTitle>
                <CardDescription>
                  Please wait while your file is being decrypted...
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
                  <Unlock className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                  <p>Decrypting with AES-256-GCM...</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Success */}
          {step === 'success' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-success">{t('success_decrypt')}</CardTitle>
                <CardDescription>
                  Your file has been decrypted and is ready for download.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="bg-success/10 p-6 rounded-full w-fit mx-auto mb-4">
                    <FileCheck className="h-12 w-12 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">File Decrypted Successfully</h3>
                  <p className="text-muted-foreground">
                    Original filename: <strong>{originalFileName}</strong>
                  </p>
                </div>
                
                <Button 
                  variant="success"
                  onClick={handleDownload}
                  className="w-full touch-manipulation"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Original File
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button variant="outline" onClick={() => {
                    setStep('select');
                    setEncryptedFiles([]);
                    setPassword('');
                    setDecryptedData(null);
                    setProgress(0);
                    setOriginalFileName('');
                  }} className="touch-manipulation" size="lg">
                    Decrypt Another File
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