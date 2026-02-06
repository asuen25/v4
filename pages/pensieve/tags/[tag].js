import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import { useRouter } from 'next/router';
import { Layout, Seo } from '@components';
import { getPostsByTag, getTags } from '@lib/content';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  h1 {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 50px;

    a {
      font-size: var(--fz-lg);
      font-weight: 400;
    }
  }

  ul {
    li {
      font-size: 24px;
      h2 {
        font-size: inherit;
        margin: 0;
        a {
          color: var(--light-slate);
        }
      }
      .subtitle {
        color: var(--slate);
        font-size: var(--fz-sm);

        .tag {
          margin-right: 10px;
        }
      }
    }
  }
`;

const TagPage = ({ tag, posts }) => {
  const router = useRouter();
  const hashIndex = router.asPath.indexOf('#');
  const location = {
    pathname: router.pathname,
    hash: hashIndex >= 0 ? router.asPath.slice(hashIndex) : '',
  };

  return (
    <Layout location={location}>
      <Seo title={`Tagged: #${tag}`} />
      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link href="/pensieve">All memories</Link>
        </span>

        <h1>
          <span>#{tag}</span>
          <span>
            <Link href="/pensieve/tags">View all tags</Link>
          </span>
        </h1>

        <ul className="fancy-list">
          {posts.map(post => {
            const { title, slug, date, tags } = post;
            return (
              <li key={slug}>
                <h2>
                  <Link href={slug}>{title}</Link>
                </h2>
                <p className="subtitle">
                  <time>
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span>&nbsp;&mdash;&nbsp;</span>
                  {tags &&
                    tags.length > 0 &&
                    tags.map((postTag, i) => (
                      <Link key={i} href={`/pensieve/tags/${kebabCase(postTag)}/`} className="tag">
                        #{postTag}
                      </Link>
                    ))}
                </p>
              </li>
            );
          })}
        </ul>
      </StyledTagsContainer>
    </Layout>
  );
};

TagPage.propTypes = {
  tag: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      date: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

TagPage.defaultProps = {
  posts: [],
};

export async function getStaticPaths() {
  const tags = await getTags();
  const paths = tags.map(({ tag }) => ({
    params: {
      tag: kebabCase(tag),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const tags = await getTags();
  const currentTag = tags.find(item => kebabCase(item.tag) === params.tag)?.tag || params.tag;
  const posts = await getPostsByTag(currentTag);

  return {
    props: {
      tag: currentTag,
      posts,
    },
  };
}

export default TagPage;
