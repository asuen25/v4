import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { email } from '@config';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 1.1;
  }

  p {
    margin: 20px 0 0;
    max-width: 600px;
    font-size: clamp(var(--fz-md), 2.2vw, var(--fz-lg));
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 40px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemRefs = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsMounted(true);
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Alexander Suen.</h2>;
  const three = (
    <h3 className="big-heading">I design hardware for sensing and intelligent systems.</h3>
  );
  const four = (
    <>
      <p>
        Stanford EE undergraduate focused on PCB design, embedded signal processing, and sensor
        systems. Recent work includes a non-invasive glucose wearable at KOS AI and high-speed
        imaging hardware in the Arbabian Lab.
      </p>
    </>
  );
  const five = (
    <a href={`mailto:${email}`} className="email-link">
      Get In Touch
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      <TransitionGroup component={null}>
        {isMounted &&
          items.map((item, i) => {
            const itemRef = itemRefs.current[i] || (itemRefs.current[i] = React.createRef());
            return (
              <CSSTransition
                key={i}
                classNames={prefersReducedMotion ? 'none' : 'fadeup'}
                timeout={prefersReducedMotion ? 0 : loaderDelay}
                nodeRef={itemRef}>
                <div
                  ref={itemRef}
                  style={prefersReducedMotion ? {} : { transitionDelay: `${i + 1}00ms` }}>
                  {item}
                </div>
              </CSSTransition>
            );
          })}
      </TransitionGroup>
    </StyledHeroSection>
  );
};

export default Hero;
