// Share actions: native image sharing, WhatsApp, and link copying
import { generateShareBlob } from './shareImage.js';

export async function handleShareDots(stats, shareBtn = null) {
  let originalText = '';
  if (shareBtn) {
    originalText = shareBtn.textContent;
    shareBtn.textContent = 'Preparing image...';
    shareBtn.disabled = true;
  }

  try {
    const blob = await generateShareBlob(stats);
    const file = new File([blob], 'life-in-dots.png', { type: 'image/png' });
    const shareUrl = window.location.origin;
    const shareText = `This is my life in dots. One dot is one week. See yours: ${shareUrl}`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'My life in dots',
          text: shareText
        });
      } catch (err) {
        // User cancelled or share aborted; ignore quietly
      }
    } else {
      // Fallback: download the PNG
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'life-in-dots.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    // Ignore quietly
  } finally {
    if (shareBtn) {
      shareBtn.textContent = originalText;
      shareBtn.disabled = false;
    }
  }
}

export function handleShareWhatsApp() {
  const shareUrl = window.location.origin;
  const msg = encodeURIComponent(`This is my life in dots. One dot is one week. See yours: ${shareUrl}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
}

export async function handleCopyLink(btnEl = null) {
  const shareUrl = window.location.origin;
  let copied = false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
    }
  } catch (err) {
    copied = false;
  }

  if (!copied) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copied = true;
    } catch (err) {
      // Ignore
    }
  }

  if (copied && btnEl) {
    const prevText = btnEl.textContent;
    btnEl.textContent = 'Copied';
    setTimeout(() => {
      btnEl.textContent = prevText;
    }, 2000);
  }
}
