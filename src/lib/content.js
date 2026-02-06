import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const JOBS_DIR = path.join(CONTENT_DIR, 'jobs');
const FEATURED_DIR = path.join(CONTENT_DIR, 'featured');

const readMarkdownIndex = dirPath => {
  const filePath = path.join(dirPath, 'index.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return { data, content };
};

const readCollection = baseDir => {
  if (!fs.existsSync(baseDir)) {
    return [];
  }
  const entries = fs.readdirSync(baseDir);
  return entries
    .map(entry => path.join(baseDir, entry))
    .filter(entryPath => fs.statSync(entryPath).isDirectory())
    .map(dirPath => ({ dirPath, ...readMarkdownIndex(dirPath) }));
};

const normalizeDate = value => (value ? new Date(value).getTime() : 0);
const normalizeFrontmatter = data => {
  if (!data) {
    return data;
  }
  const normalized = { ...data };
  if (normalized.date instanceof Date) {
    normalized.date = normalized.date.toISOString().split('T')[0];
  }
  return normalized;
};

export function getAllPostsMeta() {
  return readCollection(POSTS_DIR)
    .map(({ data }) => normalizeFrontmatter(data))
    .filter(Boolean)
    .sort((a, b) => normalizeDate(b.date) - normalizeDate(a.date));
}

export async function getPostBySlug(slug) {
  const match = readCollection(POSTS_DIR).find(({ data }) => data?.slug === slug);
  if (!match) {
    return null;
  }
  const relativeDir = path.relative(CONTENT_DIR, match.dirPath).split(path.sep).join('/');
  const imageBasePath = `/${path.posix.join('content', relativeDir)}`;
  const html = await markdownToHtml(match.content, { imageBasePath });
  return { frontmatter: normalizeFrontmatter(match.data), html };
}

export async function getPostsForListing({ includeDrafts = false } = {}) {
  const posts = readCollection(POSTS_DIR)
    .map(({ data }) => normalizeFrontmatter(data))
    .filter(Boolean)
    .filter(post => (includeDrafts ? true : post.draft !== true))
    .sort((a, b) => normalizeDate(b.date) - normalizeDate(a.date));
  return posts;
}

export async function getTags() {
  const posts = await getPostsForListing();
  const counts = posts.reduce((acc, post) => {
    const tags = post.tags || [];
    tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.keys(counts)
    .sort()
    .map(tag => ({ tag, totalCount: counts[tag] }));
}

export async function getPostsByTag(tag) {
  const posts = await getPostsForListing();
  return posts.filter(post => Array.isArray(post.tags) && post.tags.includes(tag));
}

export async function getJobs() {
  const jobs = readCollection(JOBS_DIR).map(async ({ data, content }) => ({
    frontmatter: normalizeFrontmatter(data),
    html: await markdownToHtml(content),
  }));
  const resolved = await Promise.all(jobs);
  return resolved.sort(
    (a, b) => normalizeDate(b.frontmatter?.date) - normalizeDate(a.frontmatter?.date),
  );
}

export async function getFeaturedProjects() {
  const featured = readCollection(FEATURED_DIR).map(async ({ data, content, dirPath }) => {
    const relativeDir = path.relative(CONTENT_DIR, dirPath).split(path.sep).join('/');
    const coverFile = data?.cover ? data.cover.replace(/^\.\//, '') : null;
    const coverPublicPath = coverFile
      ? `/${path.posix.join('content', relativeDir, coverFile)}`
      : null;

    const imageBasePath = `/${path.posix.join('content', relativeDir)}`;
    return {
      frontmatter: {
        ...normalizeFrontmatter(data),
        coverPublicPath,
      },
      html: await markdownToHtml(content, { imageBasePath }),
    };
  });
  const resolved = await Promise.all(featured);
  return resolved.sort(
    (a, b) => normalizeDate(a.frontmatter?.date) - normalizeDate(b.frontmatter?.date),
  );
}

export function getPostSlugs() {
  return readCollection(POSTS_DIR)
    .map(({ data }) => data?.slug)
    .filter(Boolean);
}
