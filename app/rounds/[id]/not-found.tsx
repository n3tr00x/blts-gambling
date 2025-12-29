'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-xl rounded-2xl shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="text-muted-foreground font-secondary text-7xl font-bold tracking-tight">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Nie znaleziono rundy</h1>
            <p className="text-muted-foreground text-sm">
              Wygląda na to, że runda której szukasz nie istnieje
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Strona główna
              </Link>
            </Button>
            <Button className="w-full" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
