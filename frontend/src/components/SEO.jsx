import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
  const location = useLocation();

  useEffect(() => {
    // Default values
    const defaultTitle = 'Rush Delivery - Real-time Parcel Tracking & Logistics';
    const defaultDescription = 'Track your parcels in real-time with Rush Delivery. Fast, secure, and reliable delivery services with live GPS tracking, instant notifications, and comprehensive logistics management.';
    const defaultKeywords = 'parcel tracking, delivery service, logistics, real-time tracking, GPS tracking, package delivery, shipping, courier service';
    const defaultImage = '/logo.png';
    const siteUrl = window.location.origin;

    // Use provided values or defaults
    const pageTitle = title || defaultTitle;
    const pageDescription = description || defaultDescription;
    const pageKeywords = keywords || defaultKeywords;
    const pageImage = image || defaultImage;
    const pageUrl = url || `${siteUrl}${location.pathname}`;

    // Update document title
    document.title = pageTitle;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.getElementsByTagName('head')[0].appendChild(element);
      }
    };

    // Basic meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', pageKeywords);
    updateMetaTag('author', 'Rush Delivery');

    // Open Graph tags
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:image', `${siteUrl}${pageImage}`, true);
    updateMetaTag('og:url', pageUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Rush Delivery', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', `${siteUrl}${pageImage}`);

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (canonicalElement) {
      canonicalElement.setAttribute('href', pageUrl);
    } else {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      canonicalElement.setAttribute('href', pageUrl);
      document.getElementsByTagName('head')[0].appendChild(canonicalElement);
    }

    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Rush Delivery",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "description": pageDescription,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+234-700-7874-335",
        "contactType": "customer service",
        "email": "support@rushdelivery.com"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Swift Lane",
        "addressLocality": "Ikeja",
        "addressRegion": "Lagos",
        "postalCode": "100001",
        "addressCountry": "Nigeria"
      },
      "sameAs": [
        "https://facebook.com/rushdelivery",
        "https://twitter.com/rushdelivery",
        "https://linkedin.com/company/rushdelivery"
      ]
    };

    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    if (scriptElement) {
      scriptElement.textContent = JSON.stringify(structuredData);
    } else {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.textContent = JSON.stringify(structuredData);
      document.getElementsByTagName('head')[0].appendChild(scriptElement);
    }

  }, [title, description, keywords, image, url, location.pathname, type]);

  return null;
};

export default SEO;
