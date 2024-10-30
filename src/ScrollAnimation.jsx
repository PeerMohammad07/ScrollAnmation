import { useEffect, useRef, useState } from 'react';

const ScrollAnimation = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startScrollPosition, setStartScrollPosition] = useState(0);

  const textLines = [
    { words: ["5", "to", "6", "hours.", "That's", "the", "average", "time"] },
    { words: ["you'll", "spend", "on", "your", "phone", "today", "—", "often"] },
    { words: ["without", "realizing.", "It's", "time", "to", "fight", "back."] }
  ];

  const totalWords = textLines.reduce((acc, line) => acc + line.words.length, 0);

  useEffect(() => {
    const checkVisibility = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.3;

        if (isVisible && !isFullyVisible) {
          setIsFullyVisible(true);
          setStartScrollPosition(window.scrollY);
          document.body.style.overflow = 'hidden';

          setTimeout(() => {
            setCanAnimate(true);
            document.body.style.overflow = 'auto';
          }, 0);
        }
      }
    };

    const handleScroll = () => {
      if (!canAnimate || !sectionRef.current) return;
      const currentScroll = window.scrollY - startScrollPosition;
      const animationDistance = window.innerHeight * 1.2;

      const progress = Math.min(
        Math.max(currentScroll / animationDistance, 0),
        1
      );

      setScrollProgress(progress);

      if (progress >= 1 && !isComplete) {
        setIsComplete(true);
      }
    };

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [canAnimate, isFullyVisible, isComplete, startScrollPosition]);

  const getWordStyles = (lineIndex, wordIndex) => {
    if (!canAnimate) return {};

    const previousWordsCount = textLines
      .slice(0, lineIndex)
      .reduce((acc, line) => acc + line.words.length, 0);
    const currentWordIndex = previousWordsCount + wordIndex;

    const wordThreshold = (currentWordIndex / totalWords) * 0.6;
    const isRevealed = scrollProgress >= wordThreshold;

    return {
      background: isRevealed
        ? 'linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.6) 100%)'
        : 'none',
      WebkitBackgroundClip: isRevealed ? 'text' : 'none',
      backgroundClip: isRevealed ? 'text' : 'none',
      WebkitTextFillColor: isRevealed ? 'transparent' : 'inherit',
      color: !isRevealed ? '#666666' : 'inherit',
      fontSize: '49px',
      fontFamily: 'TT Interphases Pro, sans-serif'
    };
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="min-h-[200vh] bg-black"
      >
        <div className={`sticky top-0 h-screen flex items-center justify-center 
        ${isComplete ? '' : 'transition-transform duration-300'}`}>
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center">
              {textLines.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className="leading-tight tracking-tight font-semibold mb-2"
                >
                  {line.words.map((word, wordIndex) => (
                    <span key={wordIndex} className="mx-[0.15rem]">
                      <span
                        className="inline-block transition-all duration-300"
                        style={getWordStyles(lineIndex, wordIndex)}
                      >
                        {`${word} `}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ScrollAnimation;
