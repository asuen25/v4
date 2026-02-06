import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import { useRouter } from 'next/router';
import { Layout, Seo } from '@components';
import { getPostBySlug, getPostSlugs } from '@lib/content';

const StyledPostContainer = styled.main`
  max-width: 1000px;
`;
const StyledPostHeader = styled.header`
  margin-bottom: 50px;
  .tag {
    margin-right: 10px;
  }
`;
const StyledPostContent = styled.div`
  margin-bottom: 100px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
    color: var(--light-slate);
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  code {
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
    border-radius: var(--border-radius);
    font-size: var(--fz-sm);
    padding: 0.2em 0.4em;
  }

  pre code {
    background-color: transparent;
    padding: 0;
  }
`;

const PostPage = ({ post }) => {
  const router = useRouter();
  const hashIndex = router.asPath.indexOf('#');
  const location = {
    pathname: router.pathname,
    hash: hashIndex >= 0 ? router.asPath.slice(hashIndex) : '',
  };

  if (!post) {
    return null;
  }

  const { frontmatter, html } = post;
  const { title, date, tags } = frontmatter;

  return (
    <Layout location={location}>
      <Seo title={frontmatter?.title} description={frontmatter?.description} />
      <StyledPostContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link href="/pensieve">All memories</Link>
        </span>

        <StyledPostHeader>
          <h1 className="medium-heading">{title}</h1>
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
              tags.map((tag, i) => (
                <Link key={i} href={`/pensieve/tags/${kebabCase(tag)}/`} className="tag">
                  #{tag}
                </Link>
              ))}
          </p>
        </StyledPostHeader>

        <StyledPostContent dangerouslySetInnerHTML={{ __html: html }} />
      </StyledPostContainer>
    </Layout>
  );
};

PostPage.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.object,
    html: PropTypes.string,
  }),
};

PostPage.defaultProps = {
  post: null,
};

export async function getStaticPaths() {
  const slugs = getPostSlugs();
  const paths = slugs.map(slug => ({
    params: {
      slug: slug.replace(/^\/pensieve\//, '').replace(/\/$/, ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slugParam = params?.slug || '';
  const post = await getPostBySlug(`/pensieve/${slugParam}`);

  return {
    props: {
      post,
    },
  };
}

export default PostPage;
