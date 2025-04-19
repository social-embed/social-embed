---
title: Custom Providers
description: Learn how to extend the library with your own custom providers
---

# Custom Providers

The Social Embed library allows you to extend its functionality by creating and registering custom providers for platforms that aren't natively supported.

## What is a Provider?

A provider is an object that knows how to:

1. Detect if a URL belongs to a specific platform
2. Extract the media ID from a URL
3. Generate an embed URL from the media ID
4. Optionally specify default dimensions and iframe attributes

## Creating a Custom Provider

To create a custom provider, you need to implement the `EmbedProvider` interface:

```typescript
import { type EmbedProvider, getDefaultRegistry } from "@social-embed/lib";

const MyCustomProvider: EmbedProvider = {
  // A unique name for your provider
  name: "MyCustom",
  
  // A function that returns true if the URL belongs to your platform
  canParseUrl(url: string): boolean {
    return /mycustom\.example\.com\/video\//.test(url);
  },
  
  // A function that extracts the media ID from a URL
  getIdFromUrl(url: string): string {
    return url.split("/").pop() || "";
  },
  
  // A function that generates an embed URL from a media ID
  getEmbedUrlFromId(id: string): string {
    return `https://mycustom.example.com/embed/${id}`;
  },
  
  // Optional: Specify default dimensions for the embed
  defaultDimensions: {
    width: "640",
    height: "360"
  },
  
  // Optional: Specify custom iframe attributes
  iframeAttributes: {
    allowtransparency: "true",
    allow: "autoplay; encrypted-media"
  }
};
```

## Registering Your Provider

Once you've created your provider, you need to register it with the library:

```typescript
import { getDefaultRegistry } from "@social-embed/lib";

// Register your provider
getDefaultRegistry().register(MyCustomProvider);
```

The provider will now be used automatically when a URL matching its `canParseUrl` function is encountered.

## Using Your Provider

After registering your provider, you can use it just like any built-in provider:

```typescript
import { convertUrlToEmbedUrl } from "@social-embed/lib";

// Convert a URL from your custom platform to an embed URL
const embedUrl = convertUrlToEmbedUrl("https://mycustom.example.com/video/xyz123");
console.log(embedUrl); // "https://mycustom.example.com/embed/xyz123"
```

## Using with the Web Component

If you're using the `<o-embed>` web component, your custom provider will automatically be used when a matching URL is provided:

```html
<o-embed url="https://mycustom.example.com/video/xyz123"></o-embed>
```

## Advanced Provider Features

### Custom Dimensions

The `defaultDimensions` property allows you to specify the default width and height for embeds from your platform:

```typescript
defaultDimensions: {
  width: "640",
  height: "360"
}
```

These dimensions will be used unless overridden by attributes on the `<o-embed>` element.

### Custom iframe Attributes

The `iframeAttributes` property allows you to specify additional attributes that should be applied to the iframe:

```typescript
iframeAttributes: {
  allowtransparency: "true",
  allow: "autoplay; encrypted-media",
  loading: "lazy",
  title: "My Custom Embed"
}
```

These attributes will be applied to the iframe when rendering the embed.

## Complete Example

Here's a complete example of creating and using a custom provider:

```typescript
import { type EmbedProvider, getDefaultRegistry, convertUrlToEmbedUrl } from "@social-embed/lib";
import "@social-embed/wc";

// Create a custom provider for a fictional video platform
const MyVideoProvider: EmbedProvider = {
  name: "MyVideo",
  canParseUrl(url) {
    return /myvideo\.example\.com\/watch\//.test(url);
  },
  getIdFromUrl(url) {
    const match = url.match(/watch\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
  },
  getEmbedUrlFromId(id) {
    return `https://myvideo.example.com/embed/${id}?autoplay=0`;
  },
  defaultDimensions: {
    width: "720",
    height: "405"
  },
  iframeAttributes: {
    allowtransparency: "true",
    allow: "autoplay; encrypted-media; picture-in-picture",
    loading: "lazy",
    title: "MyVideo Player"
  }
};

// Register the provider
getDefaultRegistry().register(MyVideoProvider);

// Use with the library
const url = "https://myvideo.example.com/watch/abc123";
const embedUrl = convertUrlToEmbedUrl(url);
console.log(embedUrl); // "https://myvideo.example.com/embed/abc123?autoplay=0"

// Use with the web component
document.body.innerHTML += `
  <o-embed url="https://myvideo.example.com/watch/abc123"></o-embed>
`;
```

## Best Practices

1. **Robust URL Parsing**: Make your `canParseUrl` and `getIdFromUrl` functions robust enough to handle various URL formats.

2. **Meaningful Names**: Give your provider a clear, descriptive name.

3. **Error Handling**: Include error handling in your functions to gracefully handle edge cases.

4. **Accessibility**: Include appropriate attributes in `iframeAttributes` for accessibility, such as `title`.

5. **Performance**: Keep your functions lightweight and efficient.

## Limitations

- Custom providers must be registered on the client side before they can be used.
- The provider registry is global, so be careful not to register providers with conflicting `canParseUrl` functions.
- Custom providers are not persisted between page loads unless you register them again.
