import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Layout, Hero, About, Jobs, Featured, Contact, Seo } from '@components';
import { getJobs, getFeaturedProjects } from '@lib/content';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ jobs, featured }) => {
  const router = useRouter();
  const hashIndex = router.asPath.indexOf('#');
  const location = {
    pathname: router.pathname,
    hash: hashIndex >= 0 ? router.asPath.slice(hashIndex) : '',
  };

  return (
    <Layout location={location}>
      <Seo />
      <StyledMainContainer className="fillHeight">
        <Hero />
        <About />
        <Jobs jobs={jobs} />
        <Featured projects={featured} />
        <Contact />
      </StyledMainContainer>
    </Layout>
  );
};

IndexPage.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      frontmatter: PropTypes.object,
      html: PropTypes.string,
    }),
  ),
  featured: PropTypes.arrayOf(
    PropTypes.shape({
      frontmatter: PropTypes.object,
      html: PropTypes.string,
    }),
  ),
};

IndexPage.defaultProps = {
  jobs: [],
  featured: [],
};

export async function getStaticProps() {
  const jobs = await getJobs();
  const featured = await getFeaturedProjects();
  return {
    props: {
      jobs,
      featured,
    },
  };
}

export default IndexPage;
