import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const PROJECT_ROOT = process.cwd();
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'content');
const IMAGES_ROOT = path.join(PROJECT_ROOT, 'src', 'images');
const FONTS_ROOT = path.join(PROJECT_ROOT, 'src', 'fonts');
const STATIC_ROOT = path.join(PROJECT_ROOT, 'static');

const resolvePath = (baseDir, segments) => {
  const resolved = path.resolve(baseDir, ...segments);
  if (!resolved.startsWith(baseDir)) {
    return null;
  }
  return resolved;
};

export default function handler(req, res) {
  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
  const [prefix, ...rest] = segments;

  let baseDir = STATIC_ROOT;
  let fileSegments = segments;

  if (prefix === 'content') {
    baseDir = CONTENT_ROOT;
    fileSegments = rest;
  } else if (prefix === 'images') {
    baseDir = IMAGES_ROOT;
    fileSegments = rest;
  } else if (prefix === 'fonts') {
    baseDir = FONTS_ROOT;
    fileSegments = rest;
  }

  const filePath = resolvePath(baseDir, fileSegments);
  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).end('Not found');
    return;
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    res.status(404).end('Not found');
    return;
  }

  const contentType = mime.contentType(path.extname(filePath)) || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', stat.size);
  fs.createReadStream(filePath).pipe(res);
}
