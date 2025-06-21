import React from 'react';
import { Zap, ArrowRight, Star, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export function FeaturePlaceholder() {
  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white">Coming Soon</h3>
          <p className="text-white/70 text-sm">New features</p>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 flex items-center justify-center">
          <Zap className="w-8 h-8 text-purple-400" />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-white">AI Assistant</h4>
          <p className="text-white/60 text-sm leading-relaxed">
            Get intelligent suggestions for your schedule, music, and daily tasks
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>Smart recommendations</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>Voice commands</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>Contextual insights</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Button 
          variant="ghost" 
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          Join Beta Waitlist
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        <p className="text-white/40 text-xs text-center">
          Be the first to experience the future of productivity
        </p>
      </div>
    </div>
  );
}