const isSSR = typeof window === 'undefined';

const getScrollReveal = async () => {
  if (isSSR) {
    return null;
  }
  const { default: ScrollReveal } = await import('scrollreveal');
  return ScrollReveal();
};

export default getScrollReveal;
