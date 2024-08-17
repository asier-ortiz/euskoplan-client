// src/utils/meta.ts

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface MetaTagsInput {
  title: string;
  description: string;
  image: string;
  url: string;
}

export function updateMetaTags({ title, description, image, url }: MetaTagsInput): void {
  document.title = title || 'Euskoplan';

  const tags: MetaTag[] = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:url', content: url },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];

  tags.forEach(tag => {
    const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
    let element = document.querySelector<HTMLMetaElement>(selector);

    if (element) {
      element.setAttribute('content', tag.content);
    } else {
      element = document.createElement('meta');
      if (tag.name) {
        element.setAttribute('name', tag.name);
      } else if (tag.property) {
        element.setAttribute('property', tag.property);
      }
      element.setAttribute('content', tag.content);
      document.head.appendChild(element);
    }
  });
}
