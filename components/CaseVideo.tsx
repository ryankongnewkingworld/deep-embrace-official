'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, X, Maximize2 } from 'lucide-react';

export default function CaseVideo({ src, title, portrait = false }: { src: string; title: string; portrait?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  return <div className={`case-video${portrait ? ' case-video-portrait' : ''}`} onContextMenu={event => event.preventDefault()}>
    {playing ? <video ref={ref} controls autoPlay playsInline preload="none" controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback poster={src.replace(/\.mp4$/, '.jpg')} aria-label={title}>
      <source src={src} type="video/mp4" />您的浏览器暂不支持此视频。
    </video> : <button type="button" className="case-video-launch" onClick={() => setPlaying(true)} aria-label={`播放：${title}`}>
      <img src={src.replace(/\.mp4$/, '.jpg')} alt="" loading="lazy" draggable={false} />
      <span className="case-play"><Play size={22} fill="currentColor" /></span>
      <span className="case-video-hint">播放案例视频</span>
    </button>}
  </div>;
}

export function CaseImage({ src, title }: { src: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return <>
    <button type="button" className="case-image-button" onClick={() => setOpen(true)} aria-label={`查看大图：${title}`}>
      <img src={src} alt={title} loading="lazy" draggable={false} />
      <span><Maximize2 size={16} /> 查看图片</span>
    </button>
    <dialog className="case-image-dialog" ref={dialog} onClose={() => setOpen(false)} onClick={event => { if (event.target === dialog.current) setOpen(false); }}>
      <button className="case-dialog-close" type="button" onClick={() => setOpen(false)} aria-label="关闭图片"><X size={24} /></button>
      <img src={src} alt={title} draggable={false} />
      <p>{title}</p>
    </dialog>
  </>;
}
