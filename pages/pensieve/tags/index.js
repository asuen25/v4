import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import { useRouter } from 'next/router';
import { Layout, Seo } from '@components';
import { getTags } from '@lib/content';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  h1 {
    margin-bottom: 50px;
  }
  ul {
    color: var(--light-slate);

    li {
      font-size: var(--fz-xxl);

      a {
        color: var(--light-slate);

        .count {
          color: var(--slate);
          font-family: var(--font-mono);
          font-size: var(--fz-md);
        }
      }
    }
  }
`;

const TagsPage = ({ tags }) => {
  const router = useRouter();
  const hashIndex = router.asPath.indexOf('#');
  const location = {
    pathname: router.pathname,
    hash: hashIndex >= 0 ? router.asPath.slice(hashIndex) : '',
  };

  return (
    <Layout location={location}>
      <Seo title="Tags" />
      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link href="/pensieve">All memories</Link>
        </span>

        <h1>Tags</h1>
        <ul className="fancy-list">
          {tags.map(tag => (
            <li key={tag.tag}>
              <Link href={`/pensieve/tags/${kebabCase(tag.tag)}/`} className="inline-link">
                {tag.tag} <span className="count">({tag.totalCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </StyledTagsContainer>
    </Layout>
  );
};

TagsPage.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string.isRequired,
      totalCount: PropTypes.number.isRequired,
    }),
  ),
};

TagsPage.defaultProps = {
  tags: [],
};

export async function getStaticProps() {
  const tags = await getTags();
  return {
    props: {
      tags,
    },
  };
}

export default TagsPage;
