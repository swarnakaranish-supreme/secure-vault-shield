import { useState } from 'react';
import { ArrowLeft, Unlock, Download, FileCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { useLanguage } from '../contexts/LanguageContext';
import { decryptFile, parseEncryptedPackage } from '../lib/crypto';
import { useToast } from '../hooks/use-toast';

interface DecryptionFlowProps {
  onBack: () => void;
}

type Step = 'select' | 'password' | 'decrypt' | 'success';

export function DecryptionFlow({ onBack }: DecryptionFlowProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('select');
  const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decryptedData, setDecryptedData] = useState<Uint8Array | null>(null);
  const [originalFileName, setOriginalFileName] = useState('');
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.sfl')) {
        toast({
          title: "Invalid file type",
          description: "Please select a .sfl encrypted file.",
          variant: "destructive",
        });
        return;
      }
      setEncryptedFile(file);
    }
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
    
    const blob = new Blob([decryptedData]);
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
      <header className="flex items-center p-4 sm:p-6 border-b border-border/50">
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
                <div className="space-y-2">
                  <Label htmlFor="encrypted-file">Encrypted File (.sfl)</Label>
                  <Input
                    id="encrypted-file"
                    type="file"
                    accept=".sfl"
                    onChange={handleFileSelect}
                  />
                </div>
                
                {encryptedFile && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{encryptedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(encryptedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
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
                  <Input
                    id="decrypt-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the encryption password"
                  />
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
                    setEncryptedFile(null);
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