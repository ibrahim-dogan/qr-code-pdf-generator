import { ComponentProps, useState } from 'react';
import { ModeToggle } from './components/mode-toggle';
import { useTheme } from './components/theme-provider';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { cn } from './lib/utils';
import QRCodeGenerator from "@/components/QRCodeGenerator";

const CodeText = (props: ComponentProps<'span'>) => {
  return <span {...props} className={cn(props.className, 'bg-muted text-muted-foreground rounded font-mono text-sm p-1')} />
}

function App() {
  const [count, setCount] = useState(0)
  const { theme } = useTheme()
  return (
      <>
        <QRCodeGenerator />
      </>
        
  );
}

export default App;
