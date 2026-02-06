import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkPrism from 'remark-prism';
import remarkCodeTitle from 'remark-code-title';
import { visit } from 'unist-util-visit';

const remarkRewriteImages = basePath => tree => {
  if (!basePath) {
    return;
  }
  visit(tree, 'image', node => {
    if (!node.url || node.url.startsWith('http') || node.url.startsWith('data:')) {
      return;
    }
    const cleaned = node.url.replace(/^\.\//, '');
    node.url = `${basePath}/${cleaned}`;
  });
};

const remarkExternalLinks = () => tree => {
  visit(tree, 'link', node => {
    if (!node.url || !/^https?:\/\//.test(node.url)) {
      return;
    }
    node.data = node.data || {};
    node.data.hProperties = {
      ...(node.data.hProperties || {}),
      target: '_blank',
      rel: 'nofollow noopener noreferrer',
    };
  });
};

export async function markdownToHtml(markdown, { imageBasePath } = {}) {
  const result = await remark()
    .use(remarkRewriteImages, imageBasePath)
    .use(remarkExternalLinks)
    .use(remarkCodeTitle)
    .use(remarkPrism)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return result.toString();
}
