'use client';
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/forms';
import { Eyebrow } from '../ui/layout';
import { getRecruitmentShareCard, RECRUITMENT_SHARE_CAPTION, RECRUITMENT_SHARE_FILENAME, RECRUITMENT_SHARE_URL } from './generateRecruitmentShareCard';

function statusCopy(state, errorMessage) {
  const messages = {
    idle: '', generating: 'Preparing your story card…', ready: 'Your story card is ready to share.', sharing: 'Opening the share menu…', downloaded: 'Story card downloaded.', copied: 'Caption copied ✓',
    unsupported: "Sharing isn't available in this browser. Download the story card instead.",
    error: errorMessage || "We couldn't prepare the story card. You can still copy the caption and share E-CELL manually."
  };
  return messages[state] || '';
}

function errorMessageFor(error, fallbackMessage) { return error instanceof Error && error.message ? error.message : fallbackMessage; }
function logShareError(context, error) { console.error(context, error instanceof Error ? error : new Error('An unexpected browser error occurred.')); }

function PlatformHints() {
  return <><div className="recruitment-share-tag"><p className="eyebrow">TAG US ON INSTAGRAM</p><a aria-label="Visit E-CELL MET on Instagram" href="https://www.instagram.com/ecell.met/" rel="noopener noreferrer" target="_blank">@ecell.met ↗</a><p className="helper mt-1">Tag us so we can spot and reshare your story.</p></div><div className="recruitment-share-platforms" aria-label="Social apps available through your phone's share menu"><p className="helper">Available through your phone&apos;s share menu</p><div aria-hidden="true" className="mt-2 flex flex-wrap gap-2">{['Instagram', 'WhatsApp', 'Snapchat', 'More'].map((platform) => <span className="recruitment-share-platform" key={platform}>{platform}</span>)}</div></div></>;
}

export function RecruitmentShareSection() {
  const [state, setState] = useState('idle');
  const [card, setCard] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const cardRef = useRef(null);
  const isBusy = state === 'generating' || state === 'sharing' || !card;

  useEffect(() => () => { if (cardRef.current?.previewUrl) URL.revokeObjectURL(cardRef.current.previewUrl); }, []);

  async function prepareCard({ announce = true } = {}) {
    if (cardRef.current) return cardRef.current;
    if (announce) setState('generating');
    setErrorMessage('');
    try {
      const generatedCard = await getRecruitmentShareCard();
      if (cardRef.current) return cardRef.current;
      const nextCard = { ...generatedCard, previewUrl: URL.createObjectURL(generatedCard.blob) };
      cardRef.current = nextCard;
      setCard(nextCard);
      setState('ready');
      return nextCard;
    } catch (error) {
      logShareError('Failed to generate the recruitment story card.', error);
      setErrorMessage(errorMessageFor(error, "We couldn't prepare the story card."));
      setState('error');
      return null;
    }
  }

  useEffect(() => {
    let cancelled = false;
    const prepareWhenIdle = async () => {
      const preparedCard = await prepareCard({ announce: false });
      if (cancelled && preparedCard?.previewUrl) URL.revokeObjectURL(preparedCard.previewUrl);
    };
    const idleCallback = window.requestIdleCallback?.(prepareWhenIdle, { timeout: 1800 });
    const timeoutId = idleCallback ? null : window.setTimeout(prepareWhenIdle, 700);
    return () => { cancelled = true; if (idleCallback) window.cancelIdleCallback?.(idleCallback); if (timeoutId) window.clearTimeout(timeoutId); };
  }, []);

  async function handleShare() {
    if (isBusy) return;
    if (!cardRef.current) return;
    try {
      const shareCard = cardRef.current;
      const canShareFiles = window.isSecureContext && shareCard.file && navigator.share && navigator.canShare?.({ files: [shareCard.file] });
      if (!canShareFiles) {
        setErrorMessage(process.env.NODE_ENV === 'development' && !window.isSecureContext ? 'Native sharing needs HTTPS. Test the share flow on an HTTPS preview/deployment.' : "Native sharing isn't available in this browser. Save the story card and upload it manually.");
        setState('unsupported');
        return;
      }
      setState('sharing');
      await navigator.share({ files: [shareCard.file], text: RECRUITMENT_SHARE_CAPTION, title: 'E-CELL MET Recruitment 2026–27', url: RECRUITMENT_SHARE_URL });
      setState('ready');
    } catch (error) {
      if (error?.name === 'AbortError') { setState('ready'); return; }
      logShareError('Failed to open the native share menu.', error);
      setErrorMessage('We could not open the share menu. Download the story card or copy the caption instead.');
      setState('error');
    }
  }

  async function handleDownload() {
    if (isBusy) return;
    try {
      const shareCard = cardRef.current || await prepareCard();
      if (!shareCard) return;
      const downloadLink = document.createElement('a');
      downloadLink.href = shareCard.previewUrl;
      downloadLink.download = RECRUITMENT_SHARE_FILENAME;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      setState('downloaded');
    } catch (error) {
      logShareError('Failed to download the recruitment story card.', error);
      setErrorMessage('We could not download the story card. Please try again.');
      setState('error');
    }
  }

  async function handleCopyCaption() {
    if (isBusy) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(RECRUITMENT_SHARE_CAPTION);
      else {
        const textarea = document.createElement('textarea');
        textarea.value = RECRUITMENT_SHARE_CAPTION;
        textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(textarea);
        textarea.select();
        const didCopy = document.execCommand('copy');
        textarea.remove();
        if (!didCopy) throw new Error('Copy is unavailable.');
      }
      setState('copied');
    } catch (error) {
      logShareError('Failed to copy the recruitment share caption.', error);
      setErrorMessage('Copy is unavailable here. You can select the caption below instead.');
      setState('error');
    }
  }

  function handlePreviewError() {
    logShareError('The generated recruitment story card preview could not be displayed.', new Error('Generated preview image failed to load.'));
    setErrorMessage('Your story card was created, but its preview could not be shown. You can still download it.');
    setState('error');
  }

  return <section aria-labelledby="share-heading" className="recruitment-share-section"><div className="recruitment-share-layout"><div className="recruitment-share-preview-wrap"><p className="recruitment-share-preview-label eyebrow">STORY PREVIEW</p><div aria-label="E-CELL MET recruitment story card preview" className="recruitment-share-preview">{card?.previewUrl ? <><span className="sr-only">Generated story card preview</span><img alt="E-CELL MET recruitment story card. It says: I just applied to build with E-CELL." className="absolute inset-0 h-full w-full object-cover" onError={handlePreviewError} src={card.previewUrl} /></> : <div className="recruitment-share-placeholder"><span aria-hidden="true" className="recruitment-share-tape" /><div className="relative flex items-center gap-3"><Image alt="" aria-hidden="true" className="h-11 w-11 object-contain" height={44} src="/brand/ecell-met-logo.png" width={44} /><p className="eyebrow text-[#7b2d33]">E-CELL MET<br />RECRUITMENT 2026–27</p></div><p className="recruitment-share-placeholder-title">I JUST APPLIED<br />TO BUILD WITH<br /><span>E-CELL.</span></p><div className="relative border-t border-[#242120]/20 pt-4"><p className="recruitment-share-placeholder-meta">BUILD / CREATE / CONNECT / EXECUTE</p><p className="mt-3 font-serif text-lg">Think you&apos;d fit in too?</p></div></div>}</div></div><div className="recruitment-share-content"><Eyebrow>MAKE IT OFFICIAL</Eyebrow><h2 className="heading mt-3 text-[clamp(1.75rem,7vw,2.35rem)] leading-[1.03]" id="share-heading">You applied. Now put it out there.</h2><p className="body mt-3 max-w-[31rem] text-muted">Your story might bring the next builder into E-CELL.</p><div className="mt-6 grid gap-3"><Button className="recruitment-share-primary w-full" disabled={isBusy} isLoading={isBusy} onClick={handleShare}>Share this with your network ↗</Button><PlatformHints /><div className="grid grid-cols-2 gap-3"><Button className="w-full px-3 sm:px-5" disabled={isBusy} onClick={handleDownload} variant="secondary">Download story card</Button><Button className="w-full px-3 sm:px-5" disabled={isBusy} onClick={handleCopyCaption} variant="secondary">Copy caption</Button></div><p aria-live="polite" className="helper min-h-5" role="status">{statusCopy(state, errorMessage)}</p><p className="sr-only">{RECRUITMENT_SHARE_CAPTION}</p></div></div></div></section>;
}
