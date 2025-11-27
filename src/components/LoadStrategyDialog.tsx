'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, Trash2, Calendar, FileCode } from 'lucide-react';

interface Strategy {
  id: number;
  name: string;
  description: string | null;
  code: string;
  created_at: string;
  updated_at: string;
}

interface LoadStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadStrategy: (code: string) => void;
}

export default function LoadStrategyDialog({
  open,
  onOpenChange,
  onLoadStrategy,
}: LoadStrategyDialogProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchStrategies();
    }
  }, [open]);

  const fetchStrategies = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/strategies');
      if (!response.ok) {
        throw new Error('Failed to load strategies');
      }

      const data = await response.json();
      setStrategies(data.strategies || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load strategies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (strategy: Strategy) => {
    onLoadStrategy(strategy.code);
    onOpenChange(false);
  };

  const handleDelete = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this strategy?')) {
      return;
    }

    setIsDeleting(id);

    try {
      const response = await fetch(`/api/strategies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete strategy');
      }

      // Remove from list
      setStrategies(strategies.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete strategy');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Load Strategy</DialogTitle>
          <DialogDescription>
            Choose a saved strategy to load into the editor
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">
              {error}
            </div>
          ) : strategies.length === 0 ? (
            <div className="text-center py-8">
              <FileCode className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No saved strategies yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Create and save a strategy to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  onClick={() => handleLoad(strategy)}
                  className="group relative border border-slate-800 rounded-lg p-4 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {strategy.name}
                      </h3>
                      {strategy.description && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {strategy.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(strategy.updated_at)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(strategy.id, e)}
                      disabled={isDeleting === strategy.id}
                      className="shrink-0 p-2 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {isDeleting === strategy.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
