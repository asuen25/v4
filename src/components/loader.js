import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconLoader } from '@components/icons';

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;

  .logo-wrapper {
    width: max-content;
    max-width: 100px;
    transition: var(--transition);
    opacity: ${props => (props.isMounted ? 1 : 0)};
    svg {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      fill: none;
      user-select: none;
      #B {
        opacity: 0;
      }
    }
  }
`;

const Loader = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const setDashoffset = target => {
    if (!target || typeof target.getTotalLength !== 'function') {
      return 0;
    }
    const length = target.getTotalLength();
    target.setAttribute('stroke-dasharray', `${length}`);
    return length;
  };

  const animate = async onComplete => {
    const { createTimeline } = await import('animejs');
    const loader = createTimeline({
      complete: () => onComplete(),
    });

    loader
      .add('#logo path', {
        delay: 300,
        duration: 1500,
        easing: 'easeInOutQuart',
        strokeDashoffset: [setDashoffset, 0],
      })
      .add('#logo #B', {
        duration: 700,
        easing: 'easeInOutQuart',
        opacity: 1,
      })
      .add('#logo', {
        delay: 500,
        duration: 300,
        easing: 'easeInOutQuart',
        opacity: 0,
        scale: 0.1,
      })
      .add('.loader', {
        duration: 200,
        easing: 'easeInOutQuart',
        opacity: 0,
        zIndex: -1,
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    let finished = false;
    const handleFinish = () => {
      if (finished) {
        return;
      }
      finished = true;
      finishLoading();
    };
    const fallback = setTimeout(handleFinish, 4000);
    const run = async () => {
      try {
        await animate(handleFinish);
      } catch (error) {
        handleFinish();
      }
    };
    run();
    return () => {
      clearTimeout(timeout);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.classList.add('hidden');
    return () => {
      document.body.classList.remove('hidden');
    };
  }, []);

  return (
    <StyledLoader className="loader" isMounted={isMounted}>
      <div className="logo-wrapper">
        <IconLoader />
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
