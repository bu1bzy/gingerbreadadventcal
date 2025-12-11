import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Snowfall } from '@/components/Snowfall';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, ExternalLink, Pencil, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const CalendarCreated = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  
  const [copiedView, setCopiedView] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  const baseUrl = window.location.origin;
  const viewUrl = `${baseUrl}/calendar/${id}`;
  const editUrl = `${baseUrl}/edit/${id}?token=${token}`;

  const copyToClipboard = async (url: string, isEdit: boolean) => {
    try {
      await navigator.clipboard.writeText(url);
      if (isEdit) {
        setCopiedEdit(true);
        setTimeout(() => setCopiedEdit(false), 2000);
      } else {
        setCopiedView(true);
        setTimeout(() => setCopiedView(false), 2000);
      }
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-christmas-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-christmas-gold/10 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative z-20 pb-20 pt-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-christmas-green/20 text-christmas-green mb-6 animate-scale-in">
            <Check className="w-10 h-10" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-christmas-red mb-4 animate-fade-in">
            Calendar Created! 🎄
          </h1>
          <p className="font-body text-lg text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your advent calendar is ready. Here are your important links:
          </p>

          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Edit Link - Important */}
            <div className="bg-christmas-gold/10 rounded-2xl p-6 border-2 border-christmas-gold/30">
              <div className="flex items-center justify-center gap-2 text-christmas-gold mb-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold font-body">Important!</span>
              </div>
              <h2 className="font-display text-xl text-foreground mb-2">
                📝 Save Your Edit Link
              </h2>
              <p className="text-sm text-muted-foreground mb-4 font-body">
                You'll need this link to make changes to your calendar. Bookmark it or save it somewhere safe!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 bg-background rounded-lg px-4 py-3 text-sm text-left font-mono break-all border border-border">
                  {editUrl}
                </div>
                <Button
                  variant="christmas-gold"
                  onClick={() => copyToClipboard(editUrl, true)}
                  className="shrink-0"
                >
                  {copiedEdit ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  Copy
                </Button>
              </div>

              <Link to={`/edit/${id}?token=${token}`} className="block mt-4">
                <Button variant="christmas" className="w-full gap-2">
                  <Pencil className="w-4 h-4" />
                  Go to Editor
                </Button>
              </Link>
            </div>

            {/* View Link */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl text-foreground mb-2">
                🔗 Share Link
              </h2>
              <p className="text-sm text-muted-foreground mb-4 font-body">
                Share this link with friends and family to view your calendar
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 bg-muted rounded-lg px-4 py-3 text-sm text-left font-mono break-all">
                  {viewUrl}
                </div>
                <Button
                  variant="christmas-green"
                  onClick={() => copyToClipboard(viewUrl, false)}
                  className="shrink-0"
                >
                  {copiedView ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  Copy
                </Button>
              </div>

              <Link to={`/calendar/${id}`} target="_blank" className="block mt-4">
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Preview Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarCreated;
