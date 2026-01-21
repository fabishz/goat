import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Vote as VoteIcon, Check, ChevronRight, ChevronLeft, Share2, Crown, Sparkles, Info, ThumbsUp } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { goats } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function Vote() {
  const { currentVote, setVoteStep, setVoteGoat, setVoteReason, resetVote } = useAppStore();
  const [selectedGoat, setSelectedGoat] = useState<string | null>(currentVote.goatId);
  const [reason, setReason] = useState(currentVote.reason);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, label: 'Select GOAT' },
    { number: 2, label: 'Your Reason' },
    { number: 3, label: 'Confirm Vote' },
  ];

  const currentStep = currentVote.step;
  const selectedGoatData = goats.find(g => g.id === selectedGoat);

  const handleGoatSelect = (goatId: string) => {
    setSelectedGoat(goatId);
    setVoteGoat(goatId);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedGoat) {
      setVoteStep(2);
    } else if (currentStep === 2) {
      setVoteReason(reason);
      setVoteStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setVoteStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFD700', '#B8860B'],
    });

    setVoteStep(4); // Success state
    setIsSubmitting(false);
  };

  const handleNewVote = () => {
    resetVote();
    setSelectedGoat(null);
    setReason('');
  };

  return (
    <Layout>
      <section className="py-12 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <VoteIcon className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Cast Your Vote</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Who's Your <span className="gold-text">GOAT</span>?
              </h1>
              <p className="text-muted-foreground text-lg">
                Your vote helps shape the definitive rankings.
              </p>
            </div>
          </FadeIn>

          {/* Progress Steps */}
          {currentStep <= 3 && (
            <FadeIn delay={0.1}>
              <div className="flex items-center justify-center mb-12">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={cn(
                      'flex items-center gap-2',
                      currentStep >= step.number ? 'text-accent' : 'text-muted-foreground'
                    )}>
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                        currentStep > step.number 
                          ? 'bg-accent text-accent-foreground'
                          : currentStep === step.number
                          ? 'border-2 border-accent text-accent'
                          : 'border-2 border-muted text-muted-foreground'
                      )}>
                        {currentStep > step.number ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        'w-16 sm:w-24 h-0.5 mx-2 sm:mx-4 transition-colors',
                        currentStep > step.number ? 'bg-accent' : 'bg-muted'
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Select GOAT */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="card-elevated rounded-xl border border-border/50 p-6">
                  <h2 className="font-serif text-2xl font-bold mb-6">Select Your GOAT</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {goats.slice(0, 8).map((goat) => (
                      <motion.button
                        key={goat.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGoatSelect(goat.id)}
                        className={cn(
                          'glass rounded-xl p-4 text-center transition-all',
                          selectedGoat === goat.id 
                            ? 'border-2 border-accent gold-glow' 
                            : 'border border-border/50 hover:border-accent/50'
                        )}
                      >
                        <div className="relative">
                          <img
                            src={goat.image}
                            alt={goat.name}
                            className={cn(
                              'w-20 h-20 rounded-full object-cover mx-auto mb-3 transition-all',
                              selectedGoat === goat.id && 'ring-4 ring-accent'
                            )}
                          />
                          {selectedGoat === goat.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-accent-foreground" />
                            </motion.div>
                          )}
                        </div>
                        <p className="font-medium text-sm">{goat.name}</p>
                        <p className="text-xs text-muted-foreground">{goat.subdomain}</p>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Link to="/categories" className="text-accent text-sm hover:underline">
                      View all GOATs →
                    </Link>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedGoat}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Reason */}
            {currentStep === 2 && selectedGoatData && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="card-elevated rounded-xl border border-border/50 p-6">
                  <h2 className="font-serif text-2xl font-bold mb-6">Why {selectedGoatData.name}?</h2>
                  
                  {/* Selected GOAT Preview */}
                  <div className="glass rounded-lg p-4 flex items-center gap-4 mb-6">
                    <img
                      src={selectedGoatData.image}
                      alt={selectedGoatData.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                    />
                    <div>
                      <p className="font-serif font-bold text-lg">{selectedGoatData.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedGoatData.subdomain} • Score: {selectedGoatData.overallScore}</p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Share why you believe they're the GOAT (optional but appreciated)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[150px] bg-secondary border-border"
                  />

                  <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Votes with thoughtful reasons carry more weight in our algorithm.</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 3 && selectedGoatData && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="card-elevated rounded-xl border border-accent/30 p-8 text-center">
                  <Crown className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h2 className="font-serif text-2xl font-bold mb-2">Confirm Your Vote</h2>
                  <p className="text-muted-foreground mb-8">
                    You're voting for {selectedGoatData.name} as the GOAT
                  </p>

                  <div className="glass rounded-xl p-6 max-w-sm mx-auto mb-8">
                    <img
                      src={selectedGoatData.image}
                      alt={selectedGoatData.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-accent gold-glow"
                    />
                    <h3 className="font-serif text-2xl font-bold gold-text">{selectedGoatData.name}</h3>
                    <p className="text-muted-foreground italic mb-4">"{selectedGoatData.nickname}"</p>
                    
                    {reason && (
                      <div className="text-left bg-secondary/50 rounded-lg p-4 mt-4">
                        <p className="text-sm text-muted-foreground mb-1">Your reason:</p>
                        <p className="text-sm italic">"{reason}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Your vote weight: <strong className="text-accent">1x</strong></span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow min-w-[150px]"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Submit Vote
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && selectedGoatData && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-24 h-24 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-12 h-12 text-accent" />
                </motion.div>

                <h2 className="font-serif text-3xl font-bold mb-4">
                  Vote Submitted!
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Thank you for voting for <span className="gold-text font-semibold">{selectedGoatData.name}</span>. 
                  Your voice matters in shaping the rankings!
                </p>

                <div className="glass rounded-xl p-6 max-w-sm mx-auto mb-8">
                  <img
                    src={selectedGoatData.image}
                    alt={selectedGoatData.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-accent"
                  />
                  <p className="text-sm text-muted-foreground">You voted for</p>
                  <p className="font-serif text-xl font-bold gold-text">{selectedGoatData.name}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.share?.({
                        title: 'I voted for ' + selectedGoatData.name,
                        text: `I just voted for ${selectedGoatData.name} as the GOAT on GOAT Rankings!`,
                        url: window.location.origin,
                      }).catch(() => {});
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Your Vote
                  </Button>
                  <Button onClick={handleNewVote} className="bg-accent text-accent-foreground">
                    Vote for Another GOAT
                  </Button>
                </div>

                <div className="mt-12">
                  <Link to="/categories" className="text-accent hover:underline">
                    ← Back to Rankings
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
