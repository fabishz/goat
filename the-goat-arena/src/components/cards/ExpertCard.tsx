import { motion } from 'framer-motion';
import { Expert } from '@/types/goat';
import { Quote } from 'lucide-react';

interface ExpertCardProps {
  expert: Expert;
  quote?: string;
  index?: number;
}

export function ExpertCard({ expert, quote, index = 0 }: ExpertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="card-elevated rounded-xl border border-border/50 p-6"
    >
      <Quote className="w-8 h-8 text-accent/50 mb-4" />
      
      <p className="text-foreground/90 italic mb-6 leading-relaxed">
        "{quote || 'True greatness transcends statistics. It\'s about impact, legacy, and inspiring generations.'}"
      </p>

      <div className="flex items-center gap-3">
        <img
          src={expert.avatar}
          alt={expert.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-accent/50"
        />
        <div>
          <p className="font-medium">{expert.name}</p>
          <p className="text-sm text-muted-foreground">{expert.title}</p>
        </div>
      </div>
    </motion.div>
  );
}
