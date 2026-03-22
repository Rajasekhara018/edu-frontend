export class ImageFallbackUtil {
  static ensureImage(url: string | undefined | null, label: string, context = 'Food On Farm'): string {
    const value = (url || '').trim();
    return value ? value : this.createImage(label, context);
  }

  static handleImageError(event: Event, label: string, context = 'Food On Farm'): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.dataset['fallbackApplied'] === '1') {
      return;
    }

    image.dataset['fallbackApplied'] = '1';
    image.src = this.createImage(label, context);
  }

  static ensureDescription(description: string | undefined | null, category: string): string {
    const value = (description || '').trim();
    return value || `Traditional ${category.toLowerCase()} prepared in small batches with quality ingredients.`;
  }

  static createImage(label: string, context = 'Food On Farm'): string {
    const safeLabel = this.clean(label).slice(0, 34) || 'Image';
    const safeContext = this.clean(context).slice(0, 24) || 'Food On Farm';
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbe9dc"/>
      <stop offset="100%" stop-color="#f4d7bf"/>
    </linearGradient>
  </defs>
  <rect width="960" height="640" rx="28" fill="url(#bg)"/>
  <circle cx="810" cy="120" r="78" fill="#c0673c" opacity="0.2"/>
  <circle cx="170" cy="520" r="96" fill="#c0673c" opacity="0.18"/>
  <rect x="72" y="64" width="210" height="44" rx="22" fill="#9e4f2a" opacity="0.16"/>
  <text x="88" y="93" fill="#6f351d" font-family="Arial, sans-serif" font-size="21" font-weight="700">${safeContext}</text>
  <text x="72" y="305" fill="#532615" font-family="Arial, sans-serif" font-size="54" font-weight="700">${safeLabel}</text>
  <text x="72" y="355" fill="#6f4a38" font-family="Arial, sans-serif" font-size="24">Image unavailable. Showing fallback artwork.</text>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private static clean(value: string): string {
    return value.replace(/[^A-Za-z0-9 .,&()-]/g, '');
  }
}
