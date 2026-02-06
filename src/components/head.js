import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import siteMetadata from '@config/site';

// https://www.gatsbyjs.com/docs/add-seo-component/

const Seo = ({ title, description, image }) => {
  const router = useRouter();
  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
    image: defaultImage,
    twitterUsername,
    googleSiteVerification,
    themeColor,
    backgroundColor,
  } = siteMetadata;

  const pathname = router.asPath.split('?')[0] || '';
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  return (
    <>
      <Head>
        <html lang="en" />
        <title>{pageTitle}</title>

        <meta name="description" content={seo.description} />
        <meta name="image" content={seo.image} />

        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={twitterUsername} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />

        <meta name="google-site-verification" content={googleSiteVerification} />
        <meta name="theme-color" content={themeColor} />
        <meta name="background-color" content={backgroundColor} />
        <link rel="manifest" href="/manifest.json" />
      </Head>
    </>
  );
};

export default Seo;

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Seo.defaultProps = {
  title: null,
  description: null,
  image: null,
};
