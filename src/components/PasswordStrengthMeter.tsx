import { checkPasswordStrength } from '../lib/crypto';
import { cn } from '../lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, feedback } = checkPasswordStrength(password);
  
  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-destructive';
    if (score <= 2) return 'bg-warning';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-success';
  };
  
  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };
  
  if (!password) return null;
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              getStrengthColor(score)
            )}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium">{getStrengthText(score)}</span>
      </div>
      
      {feedback.length > 0 && (
        <ul className="text-sm text-muted-foreground space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="w-1 h-1 bg-current rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}